import Groq from "groq-sdk";
import type { Channel, DefaultGenerics, Event, StreamChat } from "stream-chat";
import type { AIAgent } from "../types";
import { GroqResponseHandler } from "./GroqResponseHandler";

export class GroqAgent implements AIAgent {
  private groq?: Groq;
  private lastInteractionTs = Date.now();
  private conversationHistory: Groq.Chat.ChatCompletionMessageParam[] = [];
  private conversationSummary = "";
  private handlers: GroqResponseHandler[] = [];
  private messageQueue: string[] = [];
  private isProcessing = false;
  private readonly maxRecentMessages = 8;

  constructor(
    readonly chatClient: StreamChat,
    readonly channel: Channel
  ) {}

  dispose = async () => {
    this.chatClient.off("message.new", this.handleMessage);
    await this.chatClient.disconnectUser();
    this.handlers.forEach((handler) => handler.dispose());
    this.handlers = [];
  };

  get user() {
    return this.chatClient.user;
  }

  getLastInteraction = (): number => this.lastInteractionTs;

  init = async () => {
    const apiKey = process.env.GROQ_API_KEY as string | undefined;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is required");
    }

    this.groq = new Groq({ apiKey });

    this.conversationHistory = [
      {
        role: "system",
        content: this.getSystemPrompt(),
      },
    ];

    this.chatClient.on("message.new", this.handleMessage);
    console.log("[GroqAgent] Initialized successfully");
  };

  private getSystemPrompt = (): string => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `You are an AI writing assistant. Today is ${currentDate}.
Help with drafting, rewriting, summarizing, editing, and brainstorming.
Default to concise answers under 180 words unless the user asks for detail.
Use bullets only when helpful. Keep tone clear and professional.
If more context is needed, ask one short clarifying question.`;
  };

  private handleMessage = async (e: Event<DefaultGenerics>) => {
    if (!this.groq) return;
    if (e.message?.user?.id === this.chatClient.user?.id) return;
    if (!e.message || e.message.ai_generated) return;
    if ((e.message as { skip_ai_analysis?: boolean }).skip_ai_analysis) return;
    if ((e.message.attachments?.length || 0) > 0) return;

    const message = e.message.text?.trim();
    if (!message) return;

    this.lastInteractionTs = Date.now();
    this.messageQueue.push(message.slice(0, 3000));

    if (this.isProcessing) return;
    await this.processQueue();
  };

  private processQueue = async () => {
    if (this.isProcessing || this.messageQueue.length === 0) return;

    this.isProcessing = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      await this.processMessage(message);
    }

    this.isProcessing = false;
  };

  private processMessage = async (message: string) => {
    if (!this.groq) return;

    this.conversationHistory.push({
      role: "user",
      content: message,
    });

    await this.compactHistoryIfNeeded();

    const { message: channelMessage } = await this.channel.sendMessage({
      text: "",
      ai_generated: true,
    });

    await this.channel.sendEvent({
      type: "ai_indicator.update",
      ai_state: "AI_STATE_THINKING",
      cid: channelMessage.cid,
      message_id: channelMessage.id,
    });

    await new Promise<void>((resolve) => {
      const handler = new GroqResponseHandler(
        this.groq!,
        this.buildPromptMessages(),
        this.chatClient,
        this.channel,
        channelMessage,
        async (assistantMessage: string) => {
          this.conversationHistory.push({
            role: "assistant",
            content: assistantMessage,
          });
          await this.compactHistoryIfNeeded();
          this.removeHandler(handler);
          resolve();
        }
      );

      this.handlers.push(handler);
      void handler.run();
    });
  };

  private buildPromptMessages = (): Groq.Chat.ChatCompletionMessageParam[] => {
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      this.conversationHistory[0],
    ];

    if (this.conversationSummary) {
      messages.push({
        role: "system",
        content: `Conversation summary: ${this.conversationSummary}`,
      });
    }

    messages.push(...this.conversationHistory.slice(1));
    return messages;
  };

  private compactHistoryIfNeeded = async () => {
    const nonSystemMessages = this.conversationHistory.slice(1);
    const overflow = nonSystemMessages.length - this.maxRecentMessages;

    if (overflow <= 0) return;

    const messagesToSummarize = nonSystemMessages.slice(0, overflow);
    const summary = await this.summarizeMessages(messagesToSummarize);

    if (summary) {
      this.conversationSummary = this.conversationSummary
        ? `${this.conversationSummary} ${summary}`.trim().slice(-1200)
        : summary.slice(0, 1200);
    }

    this.conversationHistory = [
      this.conversationHistory[0],
      ...nonSystemMessages.slice(overflow),
    ];
  };

  private summarizeMessages = async (
    messages: Groq.Chat.ChatCompletionMessageParam[]
  ): Promise<string> => {
    if (!this.groq || messages.length === 0) return "";

    const transcript = messages
      .map((msg) => `${msg.role}: ${String(msg.content)}`)
      .join("\n")
      .slice(0, 3000);

    try {
      const response = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Summarize in under 80 words. Keep only goals, constraints, and decisions.",
          },
          {
            role: "user",
            content: transcript,
          },
        ],
        temperature: 0.1,
        max_tokens: 120,
      });

      return response.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      console.error("[GroqAgent] Failed to summarize history:", error);
      return "";
    }
  };

  private removeHandler = (handlerToRemove: GroqResponseHandler) => {
    this.handlers = this.handlers.filter((h) => h !== handlerToRemove);
  };
}

import { createHash } from "crypto";
import Groq from "groq-sdk";

const pdfParse = require("pdf-parse");

export class FileUploadService {
  private groq: Groq;
  private pdfCache = new Map<string, string>();
  private imageCache = new Map<string, string>();

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is required");
    this.groq = new Groq({ apiKey });
  }

  analyzePDF = async (
    base64Data: string,
    fileName: string,
    userPrompt?: string
  ): Promise<string> => {
    console.log(`[FileUploadService] Analyzing PDF: ${fileName}`);

    const cacheKey = this.createCacheKey("pdf", fileName, userPrompt, base64Data);
    const cached = this.pdfCache.get(cacheKey);
    if (cached) return cached;

    const buffer = Buffer.from(base64Data, "base64");
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error(
        "Could not extract text from PDF. The file may be scanned or image-based."
      );
    }

    const compactText = this.buildCompactDocumentContext(extractedText);
    const prompt =
      userPrompt?.trim() ||
      "Summarize the document, list key points, and mention any important actions.";

    const response = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You analyze documents. Respond briefly with summary, key points, and actions only.",
        },
        {
          role: "user",
          content: `Document: "${fileName}"\n\n${compactText}\n\nTask: ${prompt}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const result =
      response.choices[0]?.message?.content || "Unable to analyze document.";
    this.setCache(this.pdfCache, cacheKey, result);
    return result;
  };

  analyzeImage = async (
    base64Data: string,
    mimeType: string,
    fileName: string,
    userPrompt?: string
  ): Promise<string> => {
    console.log(`[FileUploadService] Analyzing image: ${fileName}`);

    const supportedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!supportedTypes.includes(mimeType)) {
      throw new Error(
        `Unsupported image type: ${mimeType}. Use JPEG, PNG, GIF, or WebP.`
      );
    }

    const cacheKey = this.createCacheKey("image", fileName, userPrompt, base64Data);
    const cached = this.imageCache.get(cacheKey);
    if (cached) return cached;

    const prompt =
      userPrompt?.trim() ||
      "Describe the image briefly, extract visible text, and list useful insights.";

    const response = await this.groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: "Keep the answer concise and focused on the user's task.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Data}`,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const result =
      response.choices[0]?.message?.content || "Unable to analyze image.";
    this.setCache(this.imageCache, cacheKey, result);
    return result;
  };

  private buildCompactDocumentContext(text: string): string {
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (cleaned.length <= 4500) return `Content:\n${cleaned}`;

    const sliceLength = 1500;
    const middleStart = Math.max(0, Math.floor(cleaned.length / 2) - 750);

    const head = cleaned.slice(0, sliceLength);
    const middle = cleaned.slice(middleStart, middleStart + sliceLength);
    const tail = cleaned.slice(-sliceLength);

    return [
      "Document excerpts:",
      `Start:\n${head}`,
      `Middle:\n${middle}`,
      `End:\n${tail}`,
    ].join("\n\n");
  }

  private createCacheKey(
    type: "pdf" | "image",
    fileName: string,
    prompt: string | undefined,
    base64Data: string
  ): string {
    const fileHash = createHash("sha256").update(base64Data).digest("hex");
    return `${type}:${fileName}:${prompt || ""}:${fileHash}`;
  }

  private setCache(cache: Map<string, string>, key: string, value: string) {
    cache.set(key, value);
    if (cache.size > 50) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
  }
}

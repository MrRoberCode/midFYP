import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  private buildOtpEmail({
    otp,
    title,
    subtitle,
    expiryMinutes,
  }: {
    otp: string;
    title: string;
    subtitle: string;
    expiryMinutes: number;
  }) {
    const html = `
      <div style="margin:0;padding:32px 16px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 45px rgba(15,23,42,0.12);border:1px solid #e2e8f0;">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0f172a 0%,#2563eb 100%);color:#ffffff;">
            <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.14);font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              RH Writing AI Security
            </div>
            <h1 style="margin:18px 0 8px;font-size:28px;line-height:1.2;">${title}</h1>
            <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.9);">
              ${subtitle}
            </p>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
              Use the one-time password below to continue. For your security, this code will expire in
              <strong>${expiryMinutes} minutes</strong>.
            </p>

            <div style="margin:24px 0;padding:22px;border-radius:20px;background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:1px solid #bfdbfe;text-align:center;">
              <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#1d4ed8;font-weight:700;margin-bottom:10px;">
                Your verification code
              </div>
              <div style="font-size:36px;line-height:1;letter-spacing:0.38em;font-weight:800;color:#0f172a;">
                ${otp}
              </div>
            </div>

            <div style="padding:18px 20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Security note</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                If you did not request this code, you can safely ignore this email. Do not share this OTP with anyone.
              </p>
            </div>

            <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
              Sent by RH Writing AI Account Protection
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `${title}\n\n${subtitle}\n\nYour verification code is: ${otp}\nThis code expires in ${expiryMinutes} minutes.\n\nIf you did not request this code, you can safely ignore this email.`;

    return { html, text };
  }

  async sendOTP(
    email: string,
    otp: string,
    expiryMinutes: number,
  ): Promise<void> {
    const { html, text } = this.buildOtpEmail({
      otp,
      expiryMinutes,
      title: 'Confirm your login',
      subtitle:
        'We received a sign-in request for your RH Writing AI account. Please verify it with the secure code below.',
    });

    await this.transporter.sendMail({
      from: `"RH Writing AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your RH Writing AI login code',
      text,
      html,
    });
  }

  async sendResetOTP(
    email: string,
    otp: string,
    expiryMinutes: number,
  ): Promise<void> {
    const { html, text } = this.buildOtpEmail({
      otp,
      expiryMinutes,
      title: 'Reset your password',
      subtitle:
        'We received a password reset request for your RH Writing AI account. Use the secure code below to continue.',
    });

    await this.transporter.sendMail({
      from: `"RH Writing AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your RH Writing AI password reset code',
      text,
      html,
    });
  }
}

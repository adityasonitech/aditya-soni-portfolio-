import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rawName = typeof body?.name === 'string' ? body.name.trim() : '';
    const rawEmail = typeof body?.email === 'string' ? body.email.trim() : '';
    const rawMessage = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!rawName || !rawEmail || !rawMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (rawName.length > MAX_NAME || rawEmail.length > MAX_EMAIL || rawMessage.length > MAX_MESSAGE) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 });
    }
    if (!EMAIL_RE.test(rawEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Escaped versions for safe use inside HTML. Newlines in the message become <br>.
    const name = escapeHtml(rawName);
    const email = escapeHtml(rawEmail);
    const message = escapeHtml(rawMessage).replace(/\r?\n/g, '<br>');

    // 1. Send Notification to Owner
    const ownerEmail = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Default for unverified domains
      to: 'adityasoni.tech04@gmail.com',
      subject: `New Message from ${rawName.replace(/[\r\n]/g, ' ')}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #8b5cf6;">
            ${message}
          </div>
        </div>
      `,
    });

    // 2. Send Auto-Reply to Sender
    const autoReply = await resend.emails.send({
      from: 'Aditya Soni <onboarding@resend.dev>',
      to: rawEmail,
      subject: 'Message Received - Aditya Soni Portfolio',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #030712; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
              .container { max-width: 600px; margin: 40px auto; background: #0f172a; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
              .header { background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); padding: 40px 20px; text-align: center; }
              .content { padding: 40px; color: #f8fafc; }
              .footer { background: #1e293b; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
              h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
              h2 { color: #8b5cf6; margin-bottom: 16px; font-size: 20px; font-weight: 600; }
              p { line-height: 1.6; margin-bottom: 24px; color: #cbd5e1; }
              .button { display: inline-block; padding: 12px 24px; background: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; transition: background 0.3s; margin-right: 10px; }
              .social-links { margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; }
              .social-links a { color: #cbd5e1; text-decoration: none; margin: 0 10px; font-size: 14px; font-weight: 500; }
              .social-links a:hover { color: #8b5cf6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Aditya Soni Portfolio</h1>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Thank you for reaching out. I've received your message and I'm looking forward to reading it. I'll get back to you within the next 24-48 hours.</p>
                <div style="margin-top: 32px;">
                  <a href="https://github.com/adityajsoni25" class="button">View Projects</a>
                  <a href="https://linkedin.com/in/aditya-soni-927ab5259" class="button" style="background: transparent; border: 1px solid #8b5cf6;">Connect</a>
                </div>
                <div class="social-links">
                  <p style="font-size: 14px; margin-bottom: 12px;">Find me online:</p>
                  <a href="https://github.com/adityajsoni25">GitHub</a>
                  <a href="https://linkedin.com/in/aditya-soni-927ab5259">LinkedIn</a>
                </div>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Aditya Soni. This is an automated response.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}

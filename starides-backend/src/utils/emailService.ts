import * as nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'Starides <noreply@starides.com>',
                to: options.to,
                subject: options.subject,
                html: options.html,
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${options.to}`);
        } catch (error) {
            console.error('❌ Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .container {
                        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                        padding: 40px;
                        border-radius: 10px;
                    }
                    .content {
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #0ea5e9;
                        margin-bottom: 20px;
                    }
                    h1 {
                        color: #1e293b;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #64748b;
                        margin-bottom: 15px;
                    }
                    .button {
                        display: inline-block;
                        padding: 14px 28px;
                        background: linear-gradient(135deg, #0ea5e9, #06b6d4);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 12px;
                        color: #94a3b8;
                    }
                    .warning {
                        background: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 12px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <div class="logo">🚀 Starides</div>
                        <h1>Reset Your Password</h1>
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your Starides account. Click the button below to create a new password:</p>
                        
                        <a href="${resetUrl}" class="button">Reset Password</a>
                        
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
                        </div>
                        
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #0ea5e9;">${resetUrl}</p>
                        
                        <div class="footer">
                            <p>This is an automated email from Starides. Please do not reply to this email.</p>
                            <p>&copy; ${new Date().getFullYear()} Starides. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Reset Your Starides Password',
            html,
        });
    }

    async sendPasswordResetConfirmation(email: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .container {
                        background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
                        padding: 40px;
                        border-radius: 10px;
                    }
                    .content {
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #0ea5e9;
                        margin-bottom: 20px;
                    }
                    h1 {
                        color: #1e293b;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #64748b;
                        margin-bottom: 15px;
                    }
                    .success {
                        background: #d1fae5;
                        border-left: 4px solid #10b981;
                        padding: 12px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 12px;
                        color: #94a3b8;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <div class="logo">🚀 Starides</div>
                        <h1>Password Reset Successful</h1>
                        
                        <div class="success">
                            <strong>✅ Success!</strong> Your password has been successfully reset.
                        </div>
                        
                        <p>Your Starides account password has been changed. You can now log in with your new password.</p>
                        
                        <p>If you didn't make this change, please contact our support team immediately.</p>
                        
                        <div class="footer">
                            <p>This is an automated email from Starides. Please do not reply to this email.</p>
                            <p>&copy; ${new Date().getFullYear()} Starides. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Your Starides Password Has Been Reset',
            html,
        });
    }
}

export const emailService = new EmailService();

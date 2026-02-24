"""
Email utility for sending emails via SMTP
Supports Gmail, Outlook, and custom SMTP servers
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

def send_email(
    to_email: str,
    subject: str,
    body_html: str,
    body_text: Optional[str] = None
) -> bool:
    """
    Send an email using SMTP configuration from environment variables
    
    Required env vars:
    - SMTP_HOST: SMTP server hostname (e.g., smtp.gmail.com)
    - SMTP_PORT: SMTP server port (e.g., 587)
    - SMTP_USER: SMTP username/email
    - SMTP_PASSWORD: SMTP password or app password
    - SMTP_FROM_EMAIL: Sender email address (optional, defaults to SMTP_USER)
    - SMTP_FROM_NAME: Sender name (optional, defaults to "Projects Club")
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body_html: HTML email body
        body_text: Plain text email body (optional fallback)
    
    Returns:
        True if email sent successfully, False otherwise
    """
    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = int(os.getenv('SMTP_PORT', 587))
    smtp_user = os.getenv('SMTP_USER')
    smtp_password = os.getenv('SMTP_PASSWORD')
    from_email = os.getenv('SMTP_FROM_EMAIL', smtp_user)
    from_name = os.getenv('SMTP_FROM_NAME', 'UofT Projects Club')
    
    # Validate required config
    if not all([smtp_host, smtp_user, smtp_password]):
        print("ERROR: SMTP configuration missing. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{from_name} <{from_email}>"
        msg['To'] = to_email
        
        # Add text and HTML parts
        if body_text:
            part1 = MIMEText(body_text, 'plain')
            msg.attach(part1)
        
        part2 = MIMEText(body_html, 'html')
        msg.attach(part2)
        
        # Connect to SMTP server and send
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()  # Secure the connection
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        print(f"✅ Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False


def send_password_reset_email(to_email: str, reset_link: str, user_email: str) -> bool:
    """
    Send a password reset email
    
    Args:
        to_email: Recipient email
        reset_link: Password reset link with token
        user_email: User's email (for reference)
    
    Returns:
        True if sent successfully
    """
    subject = "Reset Your Password - UofT Projects Club"
    
    # HTML email body
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }}
            .button {{ display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Reset Your Password</h1>
            </div>
            <div class="content">
                <p>Hi there,</p>
                <p>We received a request to reset the password for your UofT Projects Club account (<strong>{user_email}</strong>).</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button" style="display: inline-block; padding: 12px 30px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
                    {reset_link}
                </p>
                <div class="warning">
                    <strong>⚠️ Security Note:</strong> This link will expire in 15 minutes. If you didn't request this password reset, you can safely ignore this email.
                </div>
                <p>If you have any questions, please contact us at projectsclub@utoronto.ca</p>
                <p>Best regards,<br>The Projects Club Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 UofT Projects Club. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    body_text = f"""
Reset Your Password - UofT Projects Club

Hi there,

We received a request to reset the password for your account ({user_email}).

Click this link to reset your password:
{reset_link}

This link will expire in 15 minutes.

If you didn't request this password reset, you can safely ignore this email.

Best regards,
The Projects Club Team

---
© 2025 UofT Projects Club. All rights reserved.
    """
    
    return send_email(to_email, subject, body_html, body_text)


def send_welcome_email(to_email: str, user_email: str) -> bool:
    """
    Send a welcome email to new users
    
    Args:
        to_email: Recipient email
        user_email: User's email
    
    Returns:
        True if sent successfully
    """
    subject = "Welcome to UofT Projects Club!"
    
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to Projects Club!</h1>
            </div>
            <div class="content">
                <p>Hi there,</p>
                <p>Thanks for signing up! Your account (<strong>{user_email}</strong>) has been created successfully.</p>
                <p>Here's what you can do next:</p>
                <ul>
                    <li>✏️ Complete your profile to showcase your skills</li>
                    <li>🔍 Browse upcoming events and workshops</li>
                    <li>🤝 Connect with other members</li>
                    <li>💡 Join exciting projects</li>
                </ul>
                <p>Join our Discord community: <a href="https://discord.gg/EpgUyjtZm5">https://discord.gg/EpgUyjtZm5</a></p>
                <p>Questions? Email us at projectsclub@utoronto.ca</p>
                <p>See you around!<br>The Projects Club Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 UofT Projects Club. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    body_text = f"""
Welcome to UofT Projects Club!

Hi there,

Thanks for signing up! Your account ({user_email}) has been created successfully.

Here's what you can do next:
- Complete your profile to showcase your skills
- Browse upcoming events and workshops
- Connect with other members
- Join exciting projects

Join our Discord community: https://discord.gg/EpgUyjtZm5

Questions? Email us at projectsclub@utoronto.ca

See you around!
The Projects Club Team
    """
    
    return send_email(to_email, subject, body_html, body_text)

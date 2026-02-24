# Email Configuration Guide

This guide explains how to set up email functionality for password resets and welcome emails.

# Email Configuration Guide

This guide explains how to set up email functionality for password resets and welcome emails.

## 🚨 Common Issue: Emails Sent From Wrong Address

**Problem:** "I set `SMTP_FROM_EMAIL=projectsclub@utoronto.ca` but emails are sent from my Gmail!"

**Why:** Email providers block address spoofing for security. `SMTP_FROM_EMAIL` must match `SMTP_USER` or be a verified alias.

**Quick Fix:**
```bash
# ❌ This WON'T work:
SMTP_USER=personal@gmail.com
SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # Gmail will override this

# ✅ Option 1: Match the addresses
SMTP_USER=personal@gmail.com
SMTP_FROM_EMAIL=personal@gmail.com

# ✅ Option 2: Use club's email server
SMTP_HOST=smtp.office365.com
SMTP_USER=projectsclub@utoronto.ca
SMTP_FROM_EMAIL=projectsclub@utoronto.ca
```

**See detailed solutions below ↓**

---

## ⚠️ Important: SMTP_FROM_EMAIL Limitation

**Most email providers require `SMTP_FROM_EMAIL` to match `SMTP_USER`**

- Gmail, Outlook, and most SMTP servers block "spoofing" (sending from a different address)
- If you set `SMTP_USER=personal@gmail.com` and `SMTP_FROM_EMAIL=club@utoronto.ca`, Gmail will override it
- **Solution:** Either use the club's official email server OR use your personal email for development

## Overview

The app now sends real emails for:
- 🔐 Password reset links (when users forget their password)
- 👋 Welcome emails (when new users sign up)

## Quick Setup Options

## Quick Setup Options

### Option 1: UofT Email (Recommended for Production)

**Use the official club email for professional appearance**

1. **Get club email credentials**
   - Access to `projectsclub@utoronto.ca` mailbox
   - Contact UofT IT if needed for SMTP access

2. **Update `.env` file:**
   ```bash
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_USER=projectsclub@utoronto.ca
   SMTP_PASSWORD=club-email-password
   SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # ✅ Matches SMTP_USER
   SMTP_FROM_NAME=UofT Projects Club
   ```

3. **Restart the backend**
   ```bash
   cd backend
   python run.py
   ```

✅ **Result:** Emails sent from `projectsclub@utoronto.ca`

---

### Option 2: Gmail (Development/Testing Only)

**Quick setup for development, but emails will show your personal Gmail**

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Update `.env` file:**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com  # ⚠️ Must match SMTP_USER
   SMTP_FROM_NAME=UofT Projects Club
   ```

4. **Restart the backend**

⚠️ **Result:** Emails sent from `your-email@gmail.com` (not ideal for production)

---

### Option 3: Gmail with "Send As" Alias

**Send from club email using your Gmail account**

1. **Add club email as alias in Gmail:**
   - Go to Gmail Settings → Accounts and Import → Send mail as
   - Click "Add another email address"
   - Enter: `UofT Projects Club <projectsclub@utoronto.ca>`
   - **Verify ownership** of `projectsclub@utoronto.ca` (requires access to that mailbox)

2. **After verification, use this config:**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # ✅ Now allowed!
   SMTP_FROM_NAME=UofT Projects Club
   ```

✅ **Result:** Emails sent from `projectsclub@utoronto.ca` via your Gmail

---

### Option 4: SendGrid (Production - Best for Scale)

### Option 4: SendGrid (Production - Best for Scale)

**Professional email service with generous free tier**

1. **Sign up:** https://sendgrid.com (Free: 100 emails/day)

2. **Create API Key:**
   - Dashboard → Settings → API Keys → Create API Key
   - Copy the API key

3. **Verify sender email:**
   - Settings → Sender Authentication
   - Verify `projectsclub@utoronto.ca` or your domain

4. **Update `.env`:**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # Must be verified
   SMTP_FROM_NAME=UofT Projects Club
   ```

✅ **Benefits:** 
- Professional delivery
- Detailed analytics
- Better deliverability than personal email

---

### Option 5: Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email@outlook.com  # ⚠️ Must match SMTP_USER
SMTP_FROM_NAME=UofT Projects Club
```

---

### Option 6: Other SMTP Servers

For services like Mailgun or custom SMTP:

```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@yourclub.com
SMTP_FROM_NAME=UofT Projects Club
```

## Common Issues

### ❌ "Why are emails sent from my Gmail instead of club email?"

**Problem:** You set:
```bash
SMTP_USER=personal@gmail.com
SMTP_FROM_EMAIL=projectsclub@utoronto.ca
```

**Why it fails:** Gmail blocks this as spoofing/impersonation

**Solutions:**
1. **Use club's email server** (Option 1 above)
2. **Set up "Send As" alias** (Option 3 above)
3. **Accept personal email** temporarily for development
   ```bash
   SMTP_FROM_EMAIL=personal@gmail.com  # Match SMTP_USER
   ```

### ❌ Gmail "Less secure app" error

✅ **Solution:** Use App Password, not your regular password
- App Passwords: https://myaccount.google.com/apppasswords
- Regular Gmail passwords won't work with SMTP

### ❌ "Failed to send email" error

**Check these:**
1. SMTP credentials are correct
2. `.env` file is in `backend/` directory
3. Backend server was restarted after `.env` changes
4. Firewall not blocking port 587
5. `SMTP_FROM_EMAIL` matches `SMTP_USER` (or is verified alias)

## Testing Email Functionality

### Test Password Reset

1. Go to `http://localhost:5173/#/login`
2. Click "Forgot your password?"
3. Enter your email address
4. Click "Send Reset Link"
5. Check your email inbox
6. Click the reset link in the email
7. Enter your new password

### Test Welcome Email

1. Sign up for a new account
2. Check your email inbox
3. You should receive a welcome email

## Email Templates

The app sends beautifully formatted HTML emails with:
- Professional design matching the club branding
- Responsive layout that works on mobile
- Plain text fallback for older email clients
- Security warnings and expiration notices

### Password Reset Email Includes:
- Reset link button (expires in 15 minutes)
- Plain text link as fallback
- Security warning
- Contact information

### Welcome Email Includes:
- Friendly greeting
- Quick start guide
- Links to Discord and resources
- Contact information

## Development vs Production

### Development
- Emails are sent directly from your configured SMTP server
- Perfect for testing the full flow
- May end up in spam folder (that's okay for testing)

### Production
Use a professional email service:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (cheap and reliable)
- **Postmark** (developer-friendly)

## Troubleshooting

### "Failed to send email" in console

**Check SMTP settings:**
```bash
# Verify in backend/.env
SMTP_HOST=smtp.gmail.com  # Correct hostname?
SMTP_PORT=587             # Correct port?
SMTP_USER=...             # Valid email?
SMTP_PASSWORD=...         # Correct password/app password?
```

### Gmail "Less secure app" error

✅ **Solution:** Use App Password instead of your regular password
- Regular Gmail passwords won't work with SMTP
- You MUST create an App Password (see setup above)

### ❌ Emails going to spam

This is normal in development. In production:
- Use a professional email service (SendGrid, Mailgun)
- Set up SPF, DKIM, and DMARC records for your domain
- Use a domain email (not personal Gmail)
- Warm up your sending reputation gradually

### ❌ "Network unreachable" error

**Possible causes:**
- Firewall blocking SMTP port 587
- Wrong SMTP hostname
- ISP blocking SMTP traffic

**Solutions:**
- Try port 465 with SSL
- Check firewall settings
- Use a different SMTP provider

### ❌ No email configuration (development mode)

If SMTP is not configured, the app will:
- Still accept password reset requests
- Log a warning in the console: `ERROR: SMTP configuration missing`
- Return success to the user (for security)
- Not send any actual email

## Configuration Quick Reference

### For Development (Easy Setup)
```bash
# Use your personal Gmail - emails show as from your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com  # ✅ Matches user
SMTP_FROM_NAME=UofT Projects Club
```

### For Production (Professional)
```bash
# Use official club email
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=projectsclub@utoronto.ca
SMTP_PASSWORD=club-password
SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # ✅ Matches user
SMTP_FROM_NAME=UofT Projects Club
```

### For Scale (SendGrid)
```bash
# Best for high volume
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # Must be verified
SMTP_FROM_NAME=UofT Projects Club
```

## Security Best Practices

### ✅ DO:
- Use App Passwords (never your main password)
- Store credentials in `.env` file (never commit to git)
- Use environment variables for production
- Set up email rate limiting in production
- Monitor email sending for abuse
- **Match `SMTP_FROM_EMAIL` with `SMTP_USER`** (or use verified alias)

### ❌ DON'T:
- Commit `.env` file to git
- Use your personal Gmail for production
- Share SMTP credentials
- Log email content or passwords
- Disable email verification in production
- **Try to spoof from addresses** (won't work and may get blocked)

## Email Rate Limits

### Gmail App Password:
- Limit: ~500 emails/day
- Good for: Development and small apps

### SendGrid Free Tier:
- Limit: 100 emails/day
- Good for: Development and MVP

### Production Recommendations:
- SendGrid: Up to 40,000 emails for first month free
- Mailgun: 5,000 emails/month free
- AWS SES: $0.10 per 1,000 emails

## Example: Full Gmail Setup

1. **Create App Password:**
   ```
   Visit: https://myaccount.google.com/apppasswords
   Password: abcd efgh ijkl mnop
   ```

2. **Update `.env`:**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=abcdefghijklmnop
   SMTP_FROM_EMAIL=your-email@gmail.com  # ⚠️ Must match SMTP_USER
   SMTP_FROM_NAME=UofT Projects Club
   FRONTEND_URL=http://localhost:5173
   ```

3. **Restart backend:**
   ```bash
   cd backend
   python run.py
   ```

4. **Test:**
   - Request password reset
   - Check email (emails will be from `your-email@gmail.com`)
   - Click link
   - Reset password

## Example: UofT Email Setup (Production)

1. **Get club email access:**
   - Login to `projectsclub@utoronto.ca` mailbox
   - Contact UofT IT if needed

2. **Update `.env`:**
   ```bash
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_USER=projectsclub@utoronto.ca
   SMTP_PASSWORD=your-club-email-password
   SMTP_FROM_EMAIL=projectsclub@utoronto.ca  # ✅ Matches SMTP_USER
   SMTP_FROM_NAME=UofT Projects Club
   FRONTEND_URL=http://localhost:5173
   ```

3. **Restart and test**
   - Emails now sent from `projectsclub@utoronto.ca` ✅

## What Changed

### Backend Changes:
- ✅ New `app/utils/email.py` - Email sending utility
- ✅ Updated `auth_routes.py` - Sends real emails
- ✅ Environment variables for SMTP configuration

### Frontend Changes:
- ✅ New `ResetPasswordPage.tsx` - Password reset UI
- ✅ Updated routing in `App.tsx`
- ✅ Better user feedback for password resets

### Flow:
1. User clicks "Forgot password"
2. Backend generates secure token
3. Backend sends email with reset link
4. User clicks link → goes to reset page
5. User enters new password
6. Backend validates token and updates password
7. User redirected to login

## Support

If you encounter issues:
1. Check console logs in backend terminal
2. Verify `.env` configuration
3. Test with the test script above
4. Check spam folder
5. Try a different email provider

For production setup or custom email providers, refer to the provider's documentation.

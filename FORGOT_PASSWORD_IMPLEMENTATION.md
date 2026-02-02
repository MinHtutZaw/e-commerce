# Forgot Password Implementation Guide

## Overview
Complete implementation of a custom forgot password feature with branded emails, logo embedding, and success notifications for Laravel + Inertia.js applications.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Email Service Setup (Mailtrap)](#email-service-setup-mailtrap)
3. [Custom Password Reset Notification](#custom-password-reset-notification)
4. [Logo Embedding in Emails](#logo-embedding-in-emails)
5. [Success Toast Notifications](#success-toast-notifications)
6. [Testing the Feature](#testing-the-feature)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Packages
- Laravel 11.x
- Inertia.js
- Sonner (for toast notifications)
- React/TypeScript

### Files You'll Need
- Logo image: `public/img/logo.png`
- Mail templates (published)
- Custom notification class

---

## Email Service Setup (Mailtrap)

### 1. Create Mailtrap Account
1. Go to https://mailtrap.io
2. Sign up for a free account
3. Create a new inbox for your project

### 2. Get SMTP Credentials
1. Open your inbox in Mailtrap
2. Click "Show Credentials"
3. Copy the SMTP settings

### 3. Configure `.env` File
```env
# Application
APP_NAME=EduFit
APP_URL=http://edufit.test

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username_here
MAIL_PASSWORD=your_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@edufit.com
MAIL_FROM_NAME="EduFit Support Team"
```

### 4. Clear Config Cache
```bash
php artisan config:clear
```

---

## Custom Password Reset Notification

### Step 1: Create Notification Class

Run the artisan command:
```bash
php artisan make:notification CustomResetPasswordNotification
```

### Step 2: Edit the Notification File

**File**: `app/Notifications/CustomResetPasswordNotification.php`

```php
<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPasswordNotification extends Notification
{
    use Queueable;

    /**
     * The password reset token.
     */
    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('Reset Your EduFit Password')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('We received a request to reset the password for your **EduFit School Uniform Store** account.')
            ->line('Click the button below to create a new password:')
            ->action('Reset Password Now', $url)
            ->line('**Security Notice:** This link expires in 60 minutes for your protection.')
            ->line('If you didn\'t make this request, please ignore this email. Your account remains secure.')
            ->line('**Need help?** Contact our support team at support@edufit.com')
            ->salutation('Stay safe and shop uniforms with ease!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
```

### Step 3: Update User Model

**File**: `app/Models/User.php`

Add the import at the top:
```php
use App\Notifications\CustomResetPasswordNotification;
```

Add this method to the User class:
```php
/**
 * Send the password reset notification.
 *
 * @param  string  $token
 * @return void
 */
public function sendPasswordResetNotification($token)
{
    $this->notify(new CustomResetPasswordNotification($token));
}
```

---


## Logo Embedding in Emails

### Why Embed Logo?
- Email clients can't access `localhost` URLs
- Mailtrap can't load images from your local server
- Base64 embedding makes logo part of the email itself

### Step 1: Publish Mail Templates

```bash
php artisan vendor:publish --tag=laravel-mail
```

### Step 2: Update Email Header Template

**File**: `resources/views/vendor/mail/html/header.blade.php`

```blade
@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel' || trim($slot) === 'EduFit')
    @php
        $logoPath = public_path('img/logo.png');
        if (file_exists($logoPath)) {
            $logoData = base64_encode(file_get_contents($logoPath));
            $logoSrc = 'data:image/png;base64,' . $logoData;
        } else {
            $logoSrc = config('app.url') . '/img/logo.png';
        }
    @endphp
    <img src="{{ $logoSrc }}" class="logo" alt="EduFit Logo" style="height: 50px; max-height: 50px; width: auto;">
@else
    {{ $slot }}
@endif
</a>
</td>
</tr>
```

### How It Works:
1. Reads `public/img/logo.png`
2. Converts to base64
3. Creates data URI: `data:image/png;base64,{encoded_data}`
4. Embeds directly in HTML
5. Works in all email clients including Mailtrap

---

## Success Toast Notifications

### Step 1: Update Login Page

**File**: `resources/js/pages/auth/login.tsx`

Add imports:
```typescript
import { useEffect } from 'react';
import { toast } from 'sonner';
```

Update the interface:
```typescript
interface LoginProps {
    status?: string;
    flash?: {
        success?: string;
        error?: string;
    };
}
```

Add useEffect for flash messages:
```typescript
useEffect(() => {
    if (flash?.success) {
        toast.success(flash.success, {
            duration: 5000,
            position: 'top-right',
        });
    }
    if (flash?.error) {
        toast.error(flash.error, {
            duration: 5000,
            position: 'top-right',
        });
    }
}, [flash]);
```

### Step 2: Update Password Reset Controller

**File**: `app/Http/Controllers/Auth/NewPasswordController.php`

Update the success redirect:
```php
if ($status == Password::PasswordReset) {
    return to_route('login')->with('success', 'Password reset successful! You can now login with your new password.');
}
```

### Step 3: Update Inertia Middleware

**File**: `app/Http/Middleware/HandleInertiaRequests.php`

Add flash messages to shared data:
```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'message' => $request->session()->get('flash'),
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ],
    ];
}
```

---

## Testing the Feature

### Complete Testing Checklist

#### 1. Request Password Reset
- [ ] Go to forgot password page
- [ ] Enter valid email address
- [ ] Click "Email password reset link"
- [ ] See success message

#### 2. Check Mailtrap Inbox
- [ ] Login to https://mailtrap.io
- [ ] Open your project inbox
- [ ] Find the password reset email
- [ ] Verify logo appears at top
- [ ] Verify custom subject: "Reset Your EduFit Password"
- [ ] Verify personalized greeting with user's name
- [ ] Verify custom message content
- [ ] Verify "Reset Password Now" button

#### 3. Test Reset Link
- [ ] Click "Reset Password Now" button in email
- [ ] Verify redirects to reset password page
- [ ] Email field is pre-filled
- [ ] Token is in URL

#### 4. Reset Password
- [ ] Enter new password
- [ ] Enter password confirmation
- [ ] Click "Reset Password"
- [ ] See success toast notification
- [ ] Verify redirected to login page

#### 5. Test New Password
- [ ] Login with email
- [ ] Enter new password
- [ ] Verify successful login
- [ ] See welcome toast

---

## Troubleshooting

### Logo Not Appearing

**Problem**: Logo doesn't show in email

**Solutions**:
1. Check file exists: `public/img/logo.png`
2. Verify file permissions (readable)
3. Clear view cache: `php artisan view:clear`
4. Check Mailtrap HTML view (not Text view)

### Email Not Sending

**Problem**: Email doesn't arrive in Mailtrap

**Solutions**:
1. Verify `.env` credentials are correct
2. Check `MAIL_MAILER=smtp` (not `log`)
3. Clear config: `php artisan config:clear`
4. Check Laravel logs: `storage/logs/laravel.log`
5. Test connection:
```bash
php artisan tinker
Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

### Toast Not Showing

**Problem**: Success toast doesn't appear

**Solutions**:
1. Verify Sonner is installed: `npm list sonner`
2. Check Toaster component in `app.tsx`
3. Verify flash middleware configuration
4. Check browser console for errors
5. Verify useEffect dependencies

### Reset Link Not Working

**Problem**: Reset link shows 404 or invalid token

**Solutions**:
1. Check `APP_URL` in `.env` matches your server
2. Verify routes in `routes/auth.php`
3. Check token hasn't expired (60 minutes)
4. Clear route cache: `php artisan route:clear`

---

## Production Deployment

### Changes Needed for Production

#### 1. Update Email Service
Replace Mailtrap with real SMTP service:

**For Gmail:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="Your Company Name"
```

**For SendGrid:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
```

#### 2. Update APP_URL
```env
APP_URL=https://yourdomain.com
```

#### 3. Use CDN for Logo (Optional)
For better performance, host logo on CDN:

```php
// In header.blade.php
<img src="https://cdn.yourdomain.com/img/logo.png" alt="Logo">
```

#### 4. Enable HTTPS
Ensure `APP_URL` uses `https://` for security

#### 5. Clear All Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

---

## Customization Options

### Change Email Colors

**File**: `resources/views/vendor/mail/html/themes/default.css`

```css
/* Primary button color */
.button-primary {
    background-color: #10b981 !important; /* Your brand color */
}

/* Header background */
.header {
    background-color: #ffffff;
}
```

### Change Token Expiry Time

**File**: `config/auth.php`

```php
'passwords' => [
    'users' => [
        'expire' => 60, // Change from 60 to desired minutes
    ],
],
```

### Add More Email Content

Edit the `toMail()` method in your notification:

```php
->line('Additional information here')
->line('Another line of text')
```

---

## Security Best Practices

1. **Never expose SMTP credentials**
   - Keep `.env` in `.gitignore`
   - Use environment variables

2. **Use strong passwords**
   - Enforce minimum 8 characters
   - Require special characters

3. **Rate limiting**
   - Limit password reset requests
   - Add throttling middleware

4. **HTTPS only**
   - Force HTTPS in production
   - Secure cookies

5. **Token expiration**
   - Keep default 60 minutes
   - Don't extend too long

---

## Summary

### What We Built:
✅ Custom password reset email with branding  
✅ Logo embedded in emails (works in Mailtrap)  
✅ Success toast notifications  
✅ Personalized email content  
✅ Professional error handling  
✅ Complete testing workflow  

### Technologies Used:
- Laravel 11 (Backend)
- Inertia.js (Frontend bridge)
- React + TypeScript (UI)
- Sonner (Toast notifications)
- Mailtrap (Email testing)
- Base64 encoding (Logo embedding)

### Time to Implement:
- Email service setup: 10 minutes
- Custom notification: 15 minutes
- Logo embedding: 10 minutes
- Toast notifications: 10 minutes
- Testing: 15 minutes

**Total: ~60 minutes**

---

## Files Modified/Created

### Created:
1. `app/Notifications/CustomResetPasswordNotification.php`

### Modified:
1. `app/Models/User.php`
2. `app/Http/Controllers/Auth/NewPasswordController.php`
3. `resources/views/vendor/mail/html/header.blade.php`
4. `resources/js/pages/auth/login.tsx`
5. `app/Http/Middleware/HandleInertiaRequests.php`
6. `.env`

---

## Quick Reference Commands

```bash
# Create notification
php artisan make:notification CustomResetPasswordNotification

# Publish mail templates
php artisan vendor:publish --tag=laravel-mail

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Test email in tinker
php artisan tinker
>>> User::first()->sendPasswordResetNotification('test-token');
```

---

## Next Steps for Future Projects

1. Copy this guide to new project
2. Update company name and branding
3. Replace logo in `public/img/logo.png`
4. Update email content in notification
5. Configure email service (Mailtrap for dev, real SMTP for prod)
6. Test all scenarios
7. Deploy!

---

**Last Updated**: February 2026  
**Author**: Implementation for EduFit E-commerce  
**Version**: 1.0

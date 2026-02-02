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

        // Convert logo to base64 for email embedding
        $logoPath = public_path('img/logo.png');
        $logoData = base64_encode(file_get_contents($logoPath));
        $logoSrc = 'data:image/png;base64,' . $logoData;

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

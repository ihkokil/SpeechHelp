# Send Email Edge Function

This Edge Function uses Resend and React Email to send beautifully formatted welcome emails to new users.

## Setup

1. Create a Resend account at https://resend.com and get an API key.
2. Add the API key to your Supabase project:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## Local Development

1. Create a `.env` file from the template:

```bash
cp .env.example .env
```

2. Add your Resend API key to the `.env` file.

3. Run the function locally:

```bash
supabase functions serve send-email --env-file ./functions/.env
```

## Example Usage

```typescript
// Call the function from your client code
const { data, error } = await supabase.functions.invoke('send-email', {
  body: {
    email: 'user@example.com',
    username: 'John', // Optional
    subject: 'Welcome to SpeechHelp!', // Optional
    message: 'Welcome to our platform!' // Optional plain text version
  }
});

if (error) {
  console.error('Error sending email:', error);
} else {
  console.log('Email sent successfully:', data);
}
```

## Deployment

Deploy the function to your Supabase project:

```bash
supabase functions deploy send-email
```

## API Reference

### Request

```typescript
interface EmailRequestBody {
  email: string;        // Required: Recipient email address
  username?: string;    // Optional: User's name for the email greeting
  subject?: string;     // Optional: Email subject line
  message?: string;     // Optional: Plain text version of the email
}
```

### Response

```typescript
interface EmailResponse {
  success: boolean;     // Whether the email was sent successfully
  message: string;      // Status message
  data?: object;        // Response from Resend API if successful
  error?: string;       // Error message if unsuccessful
  details?: string;     // Detailed error information if available
}
``` 
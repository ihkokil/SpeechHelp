# Deploying Supabase Edge Functions

This guide explains how to deploy the Edge Functions in this project.

## Prerequisites

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   supabase login
   ```

## Deploy the Functions

1. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Set the required secrets:
   ```bash
   # For the OpenAI function
   supabase secrets set OPENAI_API_KEY=your_openai_api_key
   
   # For the send-email function
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   ```

3. Deploy all functions or specific functions:
   ```bash
   # Deploy all functions
   supabase functions deploy
   
   # Or deploy a specific function
   supabase functions deploy send-email
   ```

## Updating Functions

When you make changes to any function, redeploy it using:
```bash
supabase functions deploy function-name
```

## Testing Functions Locally

You can test functions locally before deployment:

1. Create a `.env` file in the functions directory with your environment variables:
   ```
   RESEND_API_KEY=your_resend_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

2. Start the functions locally:
   ```bash
   supabase functions serve --env-file ./functions/.env
   ```

3. Test your function in a new terminal:
   ```bash
   curl -X POST 'http://localhost:54321/functions/v1/send-email' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"email": "test@example.com", "username": "Test User"}'
   ```

## Troubleshooting

If you encounter issues:

1. Check logs:
   ```bash
   supabase functions logs
   ```

2. Verify your API keys are correctly set:
   ```bash
   supabase secrets list
   ```

3. Make sure you're using the correct Supabase project:
   ```bash
   supabase projects list
   ``` 
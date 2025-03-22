
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8?target=deno';

// Helper function to log with timestamps
const log = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

serve(async (req) => {
  log(`Received ${req.method} request to ${req.url}`);

  if (req.method === 'OPTIONS') {
    log('Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, resetUrl } = await req.json();

    if (!email || !resetUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email and resetUrl' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Processing password reset request', { email, resetUrlDomain: new URL(resetUrl).hostname });

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      log('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use Supabase's built-in password reset with proper error handling
    log('Calling Supabase resetPasswordForEmail...');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    });

    if (error) {
      log('Error from Supabase resetPasswordForEmail:', error);
      
      // Handle rate limiting specifically
      if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
        log('Rate limit detected');
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            message: 'Too many password reset requests. Please wait a few minutes before trying again.',
            rateLimited: true
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Handle email not found or other auth errors
      if (error.message?.includes('User not found') || error.message?.includes('Email not confirmed')) {
        log('User not found or email not confirmed');
        // For security, we still return success even if user doesn't exist
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'If an account with that email exists, you will receive a password reset link.',
            emailSent: true,
            recipient: email,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Handle other errors
      log('Other error occurred:', error.message);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send password reset email',
          message: 'Unable to send password reset email. Please try again later.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    log('Password reset email sent successfully via Supabase');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password reset email sent successfully',
        emailSent: true,
        recipient: email,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    log('Unexpected error in password reset function:', error);
    return new Response(
      JSON.stringify({
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

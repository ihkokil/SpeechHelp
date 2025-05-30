
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import { decode as base32Decode } from "https://deno.land/std@0.168.0/encoding/base32.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HMAC-SHA1 implementation for TOTP
async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return new Uint8Array(signature);
}

// Convert base32 secret to bytes
function base32ToBytes(base32: string): Uint8Array {
  try {
    // Ensure the base32 string is properly padded
    const paddedBase32 = base32.toUpperCase().replace(/=/g, '');
    const padding = paddedBase32.length % 8;
    const finalBase32 = paddedBase32 + '='.repeat(padding ? 8 - padding : 0);
    
    return base32Decode(finalBase32);
  } catch (error) {
    console.error('Error decoding base32:', error);
    throw new Error('Invalid base32 secret');
  }
}

// Generate TOTP code for a given time step
async function generateTOTP(secret: string, timeStep: number): Promise<string> {
  try {
    // Convert base32 secret to bytes
    const secretBytes = base32ToBytes(secret);
    
    // Convert time step to 8-byte big-endian
    const timeBuffer = new ArrayBuffer(8);
    const timeView = new DataView(timeBuffer);
    timeView.setUint32(4, timeStep, false); // big-endian
    
    // Generate HMAC-SHA1
    const hmac = await hmacSha1(secretBytes, new Uint8Array(timeBuffer));
    
    // Dynamic truncation
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000;
    
    return code.toString().padStart(6, '0');
  } catch (error) {
    console.error('Error generating TOTP:', error);
    throw new Error('Failed to generate TOTP');
  }
}

// Verify TOTP code
async function verifyTOTP(secret: string, token: string, windowSize: number = 1): Promise<boolean> {
  try {
    // Get current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    
    // Check current and adjacent time steps (30 seconds each)
    const currentStep = Math.floor(now / 30);
    
    for (let i = -windowSize; i <= windowSize; i++) {
      const timeStep = currentStep + i;
      const expectedToken = await generateTOTP(secret, timeStep);
      
      console.log(`Checking time step ${timeStep}, expected: ${expectedToken}, provided: ${token}`);
      
      if (expectedToken === token) {
        console.log('TOTP verification successful');
        return true;
      }
    }
    
    console.log('TOTP verification failed - no matching codes found');
    return false;
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return false;
  }
}

// Check if code is a backup code
function verifyBackupCode(backupCodes: string[], providedCode: string): boolean {
  console.log('Verifying backup code...');
  console.log('Provided code:', providedCode, 'Type:', typeof providedCode);
  console.log('Available backup codes:', backupCodes, 'Type:', typeof backupCodes);
  
  if (!Array.isArray(backupCodes) || backupCodes.length === 0) {
    console.log('No backup codes available or not an array');
    return false;
  }
  
  // Normalize the provided code
  const normalizedProvidedCode = String(providedCode).trim().replace(/\s+/g, '');
  console.log('Normalized provided code:', normalizedProvidedCode);
  
  // Check against each backup code
  for (let i = 0; i < backupCodes.length; i++) {
    const backupCode = backupCodes[i];
    const normalizedBackupCode = String(backupCode).trim().replace(/\s+/g, '');
    
    console.log(`Backup code ${i}: "${backupCode}" -> normalized: "${normalizedBackupCode}"`);
    console.log(`Comparing: "${normalizedProvidedCode}" === "${normalizedBackupCode}"`);
    
    if (normalizedProvidedCode === normalizedBackupCode) {
      console.log(`Backup code match found at index ${i}!`);
      return true;
    }
  }
  
  console.log('No backup code match found');
  return false;
}

serve(async (req) => {
  console.log('verify-2fa-login function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, code } = await req.json();
    console.log('Verifying 2FA for user:', userId, 'with code:', code, 'code length:', code?.length, 'code type:', typeof code);
    
    if (!userId || !code) {
      throw new Error("Missing userId or code");
    }

    // Validate code format (should be 6 digits for both TOTP and backup codes)
    const codeStr = String(code).trim();
    if (!/^\d{6}$/.test(codeStr)) {
      console.log('Invalid code format - not 6 digits:', codeStr);
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid code format"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Fetching 2FA data for user...');

    // Get the secret and backup codes from database
    const { data: twoFactorData, error: fetchError } = await supabaseClient
      .from('user_2fa')
      .select('secret_key, is_enabled, backup_codes')
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single();

    if (fetchError || !twoFactorData) {
      console.error('Error fetching 2FA data:', fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "2FA not enabled for this user"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('2FA data fetched:', {
      hasSecret: !!twoFactorData.secret_key,
      hasBackupCodes: !!twoFactorData.backup_codes,
      backupCodesLength: twoFactorData.backup_codes?.length || 0,
      backupCodesType: typeof twoFactorData.backup_codes
    });

    let verified = false;
    let isBackupCode = false;

    // First try backup codes (they are usually checked first in most 2FA implementations)
    if (twoFactorData.backup_codes && Array.isArray(twoFactorData.backup_codes)) {
      console.log('Checking backup codes first...');
      verified = verifyBackupCode(twoFactorData.backup_codes, codeStr);
      isBackupCode = verified;
      console.log('Backup code verification result:', verified);
    }

    // If backup code fails, try TOTP verification
    if (!verified) {
      console.log('Backup code failed, trying TOTP...');
      try {
        verified = await verifyTOTP(twoFactorData.secret_key, codeStr);
      } catch (error) {
        console.error('TOTP verification error:', error);
      }
    }

    console.log('Final verification result:', verified, 'isBackupCode:', isBackupCode);

    if (!verified) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid verification code"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // If a backup code was used, remove it from the list
    if (isBackupCode) {
      console.log('Removing used backup code...');
      const updatedBackupCodes = twoFactorData.backup_codes.filter((backupCode: string) => {
        const normalizedBackupCode = String(backupCode).trim().replace(/\s+/g, '');
        const normalizedUsedCode = String(codeStr).trim().replace(/\s+/g, '');
        return normalizedBackupCode !== normalizedUsedCode;
      });
      
      console.log('Original backup codes:', twoFactorData.backup_codes);
      console.log('Updated backup codes:', updatedBackupCodes);
      console.log('Removed codes count:', twoFactorData.backup_codes.length - updatedBackupCodes.length);
      
      const { error: updateError } = await supabaseClient
        .from('user_2fa')
        .update({ backup_codes: updatedBackupCodes })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating backup codes:', updateError);
        // Don't fail the login for this, just log it
      } else {
        console.log('Backup code removed successfully');
      }
    }

    console.log('2FA verification successful');

    return new Response(JSON.stringify({
      success: true,
      usedBackupCode: isBackupCode
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in verify-2fa-login function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

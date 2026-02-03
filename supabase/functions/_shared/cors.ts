
// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://speech-helper-ai.lovable.app',
  'https://id-preview--603a1be0-e4e5-42f8-98ef-79a50200ed19.lovable.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

// Get CORS headers with origin validation
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.lovable.app')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed && origin ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Legacy export for backward compatibility - use getCorsHeaders for new code
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

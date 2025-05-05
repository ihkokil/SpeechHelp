
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface SpeechDetails {
	[key: string]: string;
}

interface RequestBody {
	speechTitle?: string;
	speechType?: string;
	speechDetails?: SpeechDetails;
	existingSpeech?: string;
	instruction?: string;
	isModification?: boolean;
}

// OpenAI API configuration
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o'; // Using GPT-4o for high-quality speech generation

interface OpenAIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface OpenAIRequestBody {
	model: string;
	messages: OpenAIMessage[];
	temperature: number;
	max_tokens: number;
}

serve(async (req) => {
	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		// Get the API key from environment variable
		const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

		if (!OPENAI_API_KEY) {
			return new Response(
				JSON.stringify({ error: 'API key configuration error' }),
				{
					status: 500,
					headers: {
						...corsHeaders,
						'Content-Type': 'application/json'
					}
				}
			);
		}

		// Parse request body
		const requestData = await req.json() as RequestBody;
		
		// Check if this is a modification request or a new speech generation
		if (requestData.isModification && requestData.existingSpeech && requestData.instruction) {
			return await handleSpeechModification(requestData, OPENAI_API_KEY);
		} else {
			return await handleSpeechGeneration(requestData, OPENAI_API_KEY);
		}
	} catch (error) {
		console.error('Error in edge function:', error);
		return new Response(
			JSON.stringify({ error: error.message || 'Internal server error' }),
			{
				status: 500,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json'
				}
			}
		);
	}
});

/**
 * Handles modifying an existing speech based on instructions
 */
async function handleSpeechModification(
	requestData: RequestBody,
	apiKey: string
): Promise<Response> {
	const { existingSpeech, instruction } = requestData;

	// Create the system message for speech modification
	const systemMessage: OpenAIMessage = {
		role: 'system',
		content: `You are an expert speechwriter tasked with modifying existing speeches.
    Carefully follow the user's instructions to improve the speech while maintaining its core message and purpose.
    Preserve the overall structure and key points but apply the requested changes.
    Return ONLY the modified speech content, no additional commentary.`
	};

	// Create user message with the existing speech and modification instructions
	const userMessage: OpenAIMessage = {
		role: 'user',
		content: `
INSTRUCTION: ${instruction}

ORIGINAL SPEECH:
${existingSpeech}
`
	};

	// Prepare the request body
	const requestBody: OpenAIRequestBody = {
		model: MODEL,
		messages: [systemMessage, userMessage],
		temperature: 0.7,
		max_tokens: 4000,
	};

	// Call OpenAI API
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		const errorData = await response.json();
		return new Response(
			JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
			{
				status: response.status,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json'
				}
			}
		);
	}

	const data = await response.json();
	const modifiedSpeech = data.choices[0].message.content.trim();

	// Return the modified speech
	return new Response(
		JSON.stringify({ speech: modifiedSpeech }),
		{
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		}
	);
}

/**
 * Handles generating a new speech based on details
 */
async function handleSpeechGeneration(
	requestData: RequestBody,
	apiKey: string
): Promise<Response> {
	const { speechTitle, speechType, speechDetails } = requestData;

	if (!speechTitle) {
		return new Response(
			JSON.stringify({ error: 'Speech title is required' }),
			{
				status: 400,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json'
				}
			}
		);
	}

	// Create the system message that instructs OpenAI how to generate the speech
	const systemMessage: OpenAIMessage = {
		role: 'system',
		content: `You are an expert speechwriter who creates compelling, professional speeches.
      Create a speech that follows the user's requirements precisely.
      Your speech should be authentic, emotionally resonant, and structured for maximum impact.
      The speech should be well-organized with a clear introduction, body, and conclusion.
      Adapt your style to match the requested tone, humor level, and formality.`
	};

	// Generate the user message containing all the speech details
	const userMessage: OpenAIMessage = {
		role: 'user',
		content: createPromptFromDetails(speechTitle, speechType, speechDetails)
	};

	// Prepare the request body
	const requestBody: OpenAIRequestBody = {
		model: MODEL,
		messages: [systemMessage, userMessage],
		temperature: 0.7, // Balance between creativity and consistency
		max_tokens: 4000, // Allow for a substantial speech
	};

	// Call OpenAI API
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('OpenAI API error:', errorData);
		return new Response(
			JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
			{
				status: response.status,
				headers: {
					...corsHeaders,
					'Content-Type': 'application/json'
				}
			}
		);
	}

	const data = await response.json();
	const generatedSpeech = data.choices[0].message.content.trim();

	// Return the generated speech
	return new Response(
		JSON.stringify({ speech: generatedSpeech }),
		{
			headers: {
				...corsHeaders,
				'Content-Type': 'application/json'
			}
		}
	);
}

/**
 * Creates a detailed prompt for OpenAI based on speech details
 */
function createPromptFromDetails(
	speechTitle: string,
	speechType: string,
	speechDetails: SpeechDetails
): string {
	// Start with the basic information
	let prompt = `
# Speech Generation Request

## CORE INFORMATION
- Speech Title: "${speechTitle}"
- Speech Type: ${speechType}

## USER-PROVIDED DETAILS
`;

	// Add all user-provided questionnaire answers
	Object.entries(speechDetails).forEach(([question, answer]) => {
		if (answer && answer.trim()) {
			prompt += `- ${question}: ${answer}\n`;
		}
	});

	// Add detailed instructions
	prompt += `
## INSTRUCTIONS

Please write a complete, ready-to-deliver speech based on these specifications.
The speech should be structured for maximum impact with a compelling opening,
coherent flow between ideas, and a memorable conclusion.

The speech should feel natural and conversational, with appropriate emotional moments
and emphasis. It should be authentic and tailored to the audience information provided.

Please organize the speech with clear sections and paragraphs for easy reading and delivery.
`;

	return prompt;
}

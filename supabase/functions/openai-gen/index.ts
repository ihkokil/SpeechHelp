
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
		console.log('Received request:', JSON.stringify({
			isModification: requestData.isModification,
			hasInstruction: !!requestData.instruction,
			hasExistingSpeech: !!requestData.existingSpeech,
			speechTitle: requestData.speechTitle,
			speechType: requestData.speechType,
			detailsCount: Object.keys(requestData.speechDetails || {}).length
		}));
		
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
	console.log('Starting speech modification process');

	// Create enhanced system message for speech modification
	const systemMessage: OpenAIMessage = {
		role: 'system',
		content: `You are an expert professional speechwriter with decades of experience crafting compelling speeches for all occasions.

MODIFICATION GUIDELINES:
- Carefully analyze the user's instruction and apply the changes precisely
- Maintain the original speech's core message, purpose, and emotional impact
- Preserve the existing structure unless specifically asked to change it
- Ensure the modified speech flows naturally and maintains coherence
- Keep the same tone and style unless the instruction specifically requests a change
- Make sure all modifications enhance rather than detract from the speech's effectiveness

QUALITY STANDARDS:
- Every sentence should serve a purpose and advance the speech's message
- Use vivid, engaging language that connects with the audience
- Ensure smooth transitions between ideas and sections
- Maintain appropriate pacing and rhythm for spoken delivery
- Include natural pauses and emphasis points for effective delivery

Return ONLY the complete modified speech content with no additional commentary.`
	};

	// Create user message with the existing speech and modification instructions
	const userMessage: OpenAIMessage = {
		role: 'user',
		content: `
MODIFICATION INSTRUCTION: ${instruction}

ORIGINAL SPEECH TO MODIFY:
${existingSpeech}

Please apply the requested modification while maintaining the speech's quality and effectiveness.`
	};

	// Prepare the request body
	const requestBody: OpenAIRequestBody = {
		model: MODEL,
		messages: [systemMessage, userMessage],
		temperature: 0.7,
		max_tokens: 4000,
	};

	console.log('Sending modification request to OpenAI');
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
	const modifiedSpeech = data.choices[0].message.content.trim();
	console.log('Successfully modified speech');

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
	console.log('Starting new speech generation process');

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

	// Create enhanced system message that ensures high-quality speech generation
	const systemMessage: OpenAIMessage = {
		role: 'system',
		content: `You are a world-class professional speechwriter with expertise in crafting exceptional speeches for all occasions. You have written speeches for presidents, CEOs, wedding parties, and graduation ceremonies.

SPEECH GENERATION EXCELLENCE STANDARDS:
- Create speeches that are engaging, memorable, and emotionally resonant
- Use sophisticated yet accessible language appropriate for the occasion
- Incorporate storytelling techniques, vivid imagery, and compelling narratives
- Structure speeches with powerful openings, coherent development, and memorable conclusions
- Adapt tone, style, and content precisely to the audience and occasion
- Include natural speech patterns, pauses, and emphasis for effective delivery
- Ensure every element serves the speech's overall purpose and message

DETAILED REQUIREMENTS:
1. OPENING: Create a compelling hook that immediately captures attention
2. STRUCTURE: Organize content logically with smooth transitions
3. CONTENT: Weave in all provided details naturally and meaningfully
4. LANGUAGE: Use varied sentence structure and engaging vocabulary
5. EMOTION: Include appropriate emotional moments that resonate with the audience
6. CONCLUSION: End with a powerful, memorable statement that reinforces the key message
7. DELIVERY: Write for spoken delivery with natural rhythm and flow

PERSONALIZATION:
- Incorporate ALL provided questionnaire details meaningfully
- Reflect the specific speech type and occasion appropriately
- Match the requested tone, length, and style precisely
- Include personal anecdotes and stories as provided
- Address the specific audience mentioned in the details

Generate a complete, professionally crafted speech that exceeds expectations and delivers real impact.`
	};

	// Generate enhanced user message with all speech details
	const userMessage: OpenAIMessage = {
		role: 'user',
		content: createEnhancedPromptFromDetails(speechTitle, speechType, speechDetails)
	};

	// Prepare the request body with optimized parameters
	const requestBody: OpenAIRequestBody = {
		model: MODEL,
		messages: [systemMessage, userMessage],
		temperature: 0.8, // Slightly higher for more creativity while maintaining quality
		max_tokens: 4000, // Allow for substantial speeches
	};

	console.log('Sending generation request to OpenAI');
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
	console.log('Successfully generated new speech');

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
 * Creates an enhanced, detailed prompt for OpenAI based on speech details
 */
function createEnhancedPromptFromDetails(
	speechTitle: string,
	speechType: string,
	speechDetails: SpeechDetails
): string {
	// Analyze the speech details to extract key information
	const detailsEntries = Object.entries(speechDetails || {});
	
	// Categorize the information for better organization
	const audienceInfo = extractInformation(detailsEntries, ['audience', 'who are you addressing', 'listeners']);
	const toneInfo = extractInformation(detailsEntries, ['tone', 'mood', 'style', 'feeling']);
	const lengthInfo = extractInformation(detailsEntries, ['length', 'duration', 'time', 'long']);
	const personalInfo = extractInformation(detailsEntries, ['story', 'memory', 'experience', 'anecdote', 'personal']);
	const keyPoints = extractInformation(detailsEntries, ['points', 'topics', 'themes', 'message', 'include']);
	const contextInfo = extractInformation(detailsEntries, ['occasion', 'event', 'ceremony', 'celebration']);

	// Create comprehensive prompt
	let prompt = `# SPEECH GENERATION REQUEST

## CORE INFORMATION
- **Speech Title**: "${speechTitle}"
- **Speech Type**: ${speechType}
- **Primary Occasion**: ${contextInfo || 'As specified in details'}

## AUDIENCE & CONTEXT`;

	if (audienceInfo) {
		prompt += `\n- **Target Audience**: ${audienceInfo}`;
	}
	
	if (contextInfo) {
		prompt += `\n- **Event Context**: ${contextInfo}`;
	}

	prompt += `\n\n## SPEECH SPECIFICATIONS`;

	if (toneInfo) {
		prompt += `\n- **Tone & Style**: ${toneInfo}`;
	}

	if (lengthInfo) {
		prompt += `\n- **Length Requirements**: ${lengthInfo}`;
	}

	prompt += `\n\n## CONTENT REQUIREMENTS`;

	if (keyPoints) {
		prompt += `\n- **Key Points to Include**: ${keyPoints}`;
	}

	if (personalInfo) {
		prompt += `\n- **Personal Elements**: ${personalInfo}`;
	}

	// Add all questionnaire details
	prompt += `\n\n## DETAILED QUESTIONNAIRE RESPONSES`;
	detailsEntries.forEach(([question, answer]) => {
		if (answer && answer.trim()) {
			prompt += `\n- **${question}**: ${answer}`;
		}
	});

	// Add specific generation instructions
	prompt += `\n\n## GENERATION INSTRUCTIONS

Please create a complete, professionally crafted speech that:

1. **INCORPORATES ALL PROVIDED DETAILS**: Every questionnaire response should be meaningfully woven into the speech content
2. **MATCHES THE SPECIFIED TONE**: Ensure the speech reflects the requested emotional tone and style
3. **ENGAGES THE AUDIENCE**: Write specifically for the mentioned audience with appropriate language and references
4. **FOLLOWS PROPER STRUCTURE**: Include a compelling opening, well-organized body, and memorable conclusion
5. **INCLUDES PERSONAL ELEMENTS**: Naturally incorporate any stories, memories, or personal details provided
6. **MAINTAINS AUTHENTICITY**: Create content that sounds genuine and heartfelt, not artificial or generic
7. **OPTIMIZES FOR DELIVERY**: Write for spoken presentation with natural rhythm and emphasis points

The speech should be ready for immediate delivery and should make a lasting impact on the audience.

Generate the complete speech now:`;

	return prompt;
}

/**
 * Helper function to extract specific information from questionnaire entries
 */
function extractInformation(entries: [string, string][], keywords: string[]): string | null {
	for (const [question, answer] of entries) {
		if (answer && answer.trim()) {
			for (const keyword of keywords) {
				if (question.toLowerCase().includes(keyword.toLowerCase())) {
					return answer;
				}
			}
		}
	}
	return null;
}

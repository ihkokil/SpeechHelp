
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
const MODEL = 'gpt-4.1'; // Using GPT-4o for high-quality speech generation

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

	// Analyze the requested duration
	const durationDetails = analyzeDurationRequirements(speechDetails || {});
	console.log('Duration analysis:', durationDetails);

	// Create enhanced system message that ensures high-quality speech generation
	const systemMessage: OpenAIMessage = {
		role: 'system',
		content: `You are a world-class professional speechwriter with expertise in crafting exceptional speeches for all occasions. You have written speeches for presidents, CEOs, wedding parties, and graduation ceremonies.

CRITICAL REQUIREMENTS:
1. **EXACT LENGTH**: The speech must be approximately ${durationDetails.targetWords} words to achieve ${durationDetails.targetMinutes} minutes at 130 words/minute speaking pace
2. **WORD COUNT COMPLIANCE**: This is essential - the speech length must match the requested duration exactly
3. **PROFESSIONAL QUALITY**: This is a professional speech that will be delivered to a real audience
4. **PERSONAL CONNECTION**: Use the provided personal details to make the speech authentic and meaningful
5. **NATURAL FLOW**: Ensure smooth transitions between ideas and sections

SPEECH STRUCTURE REQUIREMENTS:
- Compelling opening that immediately grabs attention (10% of total length)
- Clear main points with detailed supporting content (70% of total length)
- Personal anecdotes and examples strategically placed throughout
- Strong, memorable conclusion that reinforces key messages (20% of total length)

${durationDetails.isLongSpeech ? `
EXTENDED SPEECH INSTRUCTIONS (${durationDetails.targetMinutes} minutes = ${durationDetails.targetWords} words):
- Develop 5-7 major themes/points with rich detail
- Include multiple detailed personal stories and anecdotes (2-3 minutes each)
- Add philosophical reflections and deeper insights
- Incorporate audience interaction cues and strategic pauses
- Build multiple emotional peaks throughout the speech
- Include transitional sections between major points
- Create memorable moments and quotable phrases
- Allow for natural breathing room and emphasis
- End with an extended, inspiring conclusion
` : `
STANDARD SPEECH INSTRUCTIONS (${durationDetails.targetMinutes} minutes = ${durationDetails.targetWords} words):
- Focus on 3-4 key points with clear supporting evidence
- Include 1-2 well-developed personal examples
- Keep examples concise but emotionally impactful
- Maintain engaging pace with natural transitions
- End with a clear call to action or memorable thought
`}

TONE AND STYLE REQUIREMENTS:
- Match the formality level appropriate for a ${speechType}
- Use language that feels natural and conversational
- Include appropriate humor if suitable for the occasion
- Show genuine emotion and personality throughout
- Ensure every sentence adds value toward the total word count goal

WORD COUNT VALIDATION:
- Count your words as you write to ensure you meet exactly ${durationDetails.targetWords} words
- If under target, add more detailed examples, stories, or elaboration
- If over target, refine and focus your content while maintaining quality
- Remember: ${durationDetails.targetMinutes} minutes = ${durationDetails.targetWords} words is the non-negotiable target

Please create a complete, ready-to-deliver speech that meets these exact specifications, especially the word count requirement.`
	};

	// Generate enhanced user message with all speech details
	const userMessage: OpenAIMessage = {
		role: 'user',
		content: createEnhancedPromptFromDetails(speechTitle, speechType, speechDetails, durationDetails)
	};

	// Adjust max_tokens based on speech length requirements
	const maxTokens = durationDetails.isLongSpeech ? 8000 : 4000;

	// Prepare the request body with optimized parameters
	const requestBody: OpenAIRequestBody = {
		model: MODEL,
		messages: [systemMessage, userMessage],
		temperature: 0.8, // Slightly higher for more creativity while maintaining quality
		max_tokens: maxTokens, // Increased for longer speeches
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
 * Analyzes duration requirements from speech details
 */
function analyzeDurationRequirements(speechDetails: SpeechDetails) {
	const detailsEntries = Object.entries(speechDetails);
	
	// Look for duration-related information
	const durationInfo = detailsEntries.find(([question, answer]) => {
		const q = question.toLowerCase();
		return (q.includes('length') || q.includes('duration') || q.includes('time') || q.includes('how long')) && answer && answer.trim();
	});

	let targetMinutes = 5; // default
	let durationInput = '';

	if (durationInfo && durationInfo[1]) {
		durationInput = durationInfo[1];
		const input = durationInput.toLowerCase().trim();
		
		// Enhanced duration parsing logic
		if (input.includes('hour') || input.includes('hr')) {
			const hourMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/);
			if (hourMatch) {
				targetMinutes = parseFloat(hourMatch[1]) * 60;
			}
		} else if (input.includes('minute') || input.includes('min')) {
			const minuteMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:minute|min)/);
			if (minuteMatch) {
				targetMinutes = parseFloat(minuteMatch[1]);
			}
		} else if (input.includes('second') || input.includes('sec')) {
			const secondMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:second|sec)/);
			if (secondMatch) {
				targetMinutes = parseFloat(secondMatch[1]) / 60;
			}
		} else {
			// Handle time formats and simple numbers
			const timeMatch = input.match(/(\d+):(\d+)/);
			if (timeMatch) {
				const minutes = parseInt(timeMatch[1]);
				const seconds = parseInt(timeMatch[2]);
				targetMinutes = minutes + (seconds / 60);
			} else {
				const numberMatch = input.match(/(\d+(?:\.\d+)?)/);
				if (numberMatch) {
					const number = parseFloat(numberMatch[1]);
					if (number >= 60) {
						targetMinutes = number; // Large numbers likely minutes
					} else if (number >= 10) {
						targetMinutes = number; // Medium numbers likely minutes
					} else if (number <= 3 && !input.includes('min')) {
						targetMinutes = number * 60; // Small numbers likely hours
					} else {
						targetMinutes = number; // Default to minutes
					}
				}
			}
		}
	}

	// Ensure reasonable bounds
	targetMinutes = Math.max(1, Math.min(targetMinutes, 180)); // 1 minute to 3 hours max

	const targetWords = Math.round(targetMinutes * 130); // 130 words per minute
	const isLongSpeech = targetMinutes >= 30;

	return {
		targetMinutes,
		targetWords,
		isLongSpeech,
		durationInput
	};
}

/**
 * Creates an enhanced, detailed prompt for OpenAI based on speech details
 */
function createEnhancedPromptFromDetails(
	speechTitle: string,
	speechType: string,
	speechDetails: SpeechDetails,
	durationDetails: any
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

## CRITICAL DURATION REQUIREMENTS
- **Target Duration**: ${durationDetails.targetMinutes} minutes
- **Target Word Count**: approximately ${durationDetails.targetWords} words
- **Speech Length Category**: ${durationDetails.isLongSpeech ? 'LONG SPEECH - Requires substantial, comprehensive content' : 'Standard Speech'}
${durationDetails.durationInput ? `- **Original Duration Request**: "${durationDetails.durationInput}"` : ''}

${durationDetails.isLongSpeech ? `
🚨 CRITICAL: This is a LONG SPEECH requiring extensive content development:
- Multiple detailed sections with comprehensive coverage
- Extensive examples, stories, case studies, and elaborations
- Multiple perspectives and angles on the topic
- Detailed storytelling and comprehensive explanations
- Philosophical reflections and practical applications
- Rich, detailed, and thoroughly developed content throughout
` : ''}

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

1. **MEETS THE EXACT DURATION REQUIREMENT**: Generate approximately ${durationDetails.targetWords} words to fill ${durationDetails.targetMinutes} minutes of speaking time
2. **INCORPORATES ALL PROVIDED DETAILS**: Every questionnaire response should be meaningfully woven into the speech content
3. **MATCHES THE SPECIFIED TONE**: Ensure the speech reflects the requested emotional tone and style
4. **ENGAGES THE AUDIENCE**: Write specifically for the mentioned audience with appropriate language and references
5. **FOLLOWS PROPER STRUCTURE**: Include a compelling opening, well-organized body, and memorable conclusion
6. **INCLUDES PERSONAL ELEMENTS**: Naturally incorporate any stories, memories, or personal details provided
7. **MAINTAINS AUTHENTICITY**: Create content that sounds genuine and heartfelt, not artificial or generic
8. **OPTIMIZES FOR DELIVERY**: Write for spoken presentation with natural rhythm and emphasis points

${durationDetails.isLongSpeech ? `
🎯 SPECIAL INSTRUCTIONS FOR LONG SPEECH:
- Create multiple substantial sections with detailed coverage of the topic
- Include extensive examples, anecdotes, and detailed explanations
- Add comprehensive storytelling elements throughout
- Incorporate multiple perspectives and detailed analysis
- Ensure every section is fully developed and substantial
- Use detailed transitions between major sections
- Include philosophical reflections and practical applications
- Make sure the content truly justifies the requested ${durationDetails.targetMinutes}-minute duration
` : ''}

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

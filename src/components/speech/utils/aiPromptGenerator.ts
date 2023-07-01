
/**
 * Generates an optimized prompt for the third-party AI system based on user inputs
 * This creates a detailed, context-rich prompt that helps the AI create unique, 
 * high-quality speeches tailored to the specific occasion and user requirements
 */
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { speechTypesData } from '../data/speechTypesData';

export const generateAIPrompt = (
  speechTitle: string, 
  speechType: string, 
  speechDetails: SpeechDetails = {}
): string => {
  // Get the selected speech type label
  const speechTypeLabel = speechTypesData.find(type => type.id === speechType)?.label || speechType;
  
  // Create a formatted version of user inputs for the AI
  const formattedUserInputs = Object.entries(speechDetails)
    .filter(([_, value]) => value && value.trim())
    .map(([question, answer]) => `- ${question.replace(/\?$/, '')}: ${answer}`)
    .join('\n');

  // Generate a unique identifier for this speech to ensure it's one-of-a-kind
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  return `
# EXPERT SPEECH WRITER INSTRUCTIONS

## SPEECH CREATION TASK (Unique ID: ${uniqueId})
You are an expert speech writer with decades of experience crafting powerful, memorable, and emotionally resonant speeches for all occasions. Your task is to create a completely original ${speechTypeLabel.toLowerCase()} that feels authentic, personalized, and tailored specifically to the speaker and their audience.

## SPEECH TITLE
"${speechTitle}"

## SPEECH TYPE
${speechTypeLabel}

## USER REQUIREMENTS
The following information has been provided by the speaker:

${formattedUserInputs}

## DETAILED GUIDELINES

### TONE AND STYLE
- Analyze the user's desired tone carefully and maintain it consistently throughout
- Use natural, conversational language that sounds like the speaker's authentic voice
- Ensure the speech flows organically with smooth transitions between topics
- Match vocabulary and formality level to the occasion, audience, and speaker's role

### STRUCTURE AND CONTENT
- Create a captivating introduction that grabs attention immediately
- Develop a clear organizational framework with logical progression
- Include personal stories, anecdotes, and examples provided by the user
- Incorporate appropriate emotional moments, humor, or poignant reflections based on the occasion
- Craft a memorable conclusion that leaves a lasting impression

### AUTHENTICITY AND ORIGINALITY
- This speech MUST be completely unique and tailored to this specific occasion
- Avoid generic platitudes, clichés, and overused speech formulas
- Transform user input into something better than they could write themselves, while preserving their intent
- Pay special attention to personal details, relationships, and specific memories mentioned

### CUSTOMIZATION REQUIREMENTS
- Adjust speech length to match the user's specified duration
- For cultural/religious occasions, respectfully incorporate relevant traditions or references
- For technical/professional speeches, balance expertise with accessibility
- For emotional occasions (weddings, funerals, etc.), strike the right emotional tone without being overly sentimental

## ADVANCED SPEECH TECHNIQUES
- Use rhetorical devices like metaphor, anecdote, rule of three, and contrast where appropriate
- Create "quotable moments" - memorable lines that could be remembered and shared
- Employ varied sentence structure and rhythm to maintain engagement
- Consider including a call-to-action or reflection question if appropriate to the occasion

## FINAL CHECKS
- Ensure the speech is completely original and tailored to this specific occasion
- Maintain consistency in tone, style, and voice throughout
- Verify the speech addresses all key points from the user's input
- Confirm the speech feels authentic to the speaker and appropriate for the audience
- Make necessary adjustments to match the requested duration

## FORMAT
Structure the speech with clear sections but don't label them as "Introduction," "Body," etc. The speech should flow naturally as it would be delivered verbally. Use natural pauses and transitions between ideas.

Now, using all of this information, create an exceptional, unique ${speechTypeLabel.toLowerCase()} that exceeds expectations and feels personally crafted for this specific occasion.
`;
};

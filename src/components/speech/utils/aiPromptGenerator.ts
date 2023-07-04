
import { SpeechDetails } from '../hooks/useSpeechLabState';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a detailed AI prompt for third-party speech generation services,
 * taking into account all user-provided details from questionnaires
 */
export const generateAIPrompt = (speechTitle: string, speechType: string, speechDetails: SpeechDetails = {}): string => {
  // Create a unique identifier for this speech to ensure uniqueness
  const uniqueId = uuidv4().substring(0, 8);
  
  // Extract important preference information from the details
  const emotionalImpact = getDetailsByKeyword(speechDetails, "emotional impact");
  const humorLevel = getDetailsByKeyword(speechDetails, "humor");
  const speechStructure = getDetailsByKeyword(speechDetails, "structure");
  const languageStyle = getDetailsByKeyword(speechDetails, "language");
  const culturalElements = getDetailsByKeyword(speechDetails, "cultural");
  
  // Construct a comprehensive AI prompt
  let prompt = `
# Speech Generation Request [ID: ${uniqueId}]

## CORE INFORMATION
- Speech Title: "${speechTitle}"
- Speech Type: ${speechType}
- Unique Identifier: ${uniqueId}

## SPEECH PREFERENCES
- Emotional Impact: ${emotionalImpact || "Balanced"}
- Humor Level: ${humorLevel || "As appropriate for the occasion"}
- Structure Preference: ${speechStructure || "Standard (introduction, body, conclusion)"}
- Language Style: ${languageStyle || "Natural and conversational"}
- Cultural Elements: ${culturalElements ? `Include ${culturalElements}` : "Standard approach"}

## USER-PROVIDED DETAILS
`;

  // Add all user-provided questionnaire answers
  Object.entries(speechDetails).forEach(([question, answer]) => {
    if (answer && answer.trim()) {
      prompt += `- ${question}: ${answer}\n`;
    }
  });

  // Add detailed instructions for the AI
  prompt += `
## INSTRUCTIONS FOR AI SPEECH GENERATION

1. CREATE A COMPLETELY UNIQUE SPEECH:
   - This must be entirely original content, different from any other speech
   - Incorporate the unique identifier ${uniqueId} subtly into the speech content
   - Avoid generic templates or common speech patterns

2. HONOR THE SPECIFIED TONE AND STYLE:
   - Match the requested emotional impact and humor level exactly
   - Follow the requested speech structure preference
   - Use language at the requested sophistication level
   - Incorporate cultural elements as specified

3. AUDIENCE ADAPTATION:
   - Analyze the audience information to tailor content appropriately
   - Consider knowledge level, interests, and context of the listeners
   - Adjust technical terms and references based on audience familiarity

4. INCORPORATE PERSONAL ELEMENTS:
   - Weave in the provided stories, anecdotes, and personal details naturally
   - Give prominence to meaningful experiences and relationships mentioned
   - Maintain the authentic voice of the speaker

5. APPROPRIATE LENGTH:
   - Generate content that would take approximately the requested speech duration to deliver
   - Adjust word count based on speaking rate (approximately 130-150 words per minute)
   - Ensure adequate coverage of all important points without unnecessary padding

6. ENSURE AUTHENTICITY AND EMOTIONAL RESONANCE:
   - Write in a natural, conversational style that sounds like a real person speaking
   - Include appropriate emotional moments, pauses, or emphasis
   - Create content that feels genuine and heartfelt, not artificial

7. STRUCTURE FOR MAXIMUM IMPACT:
   - Create a compelling opening that grabs attention
   - Develop a coherent flow between ideas and sections
   - Craft a memorable conclusion that reinforces the key message

Please generate a complete, ready-to-deliver speech based on these specifications.
`;

  return prompt;
};

/**
 * Helper function to extract details containing specific keywords
 */
const getDetailsByKeyword = (details: SpeechDetails, keyword: string): string | null => {
  const matchingEntry = Object.entries(details).find(([question, answer]) => 
    question.toLowerCase().includes(keyword.toLowerCase()) && answer && answer.trim()
  );
  
  return matchingEntry ? matchingEntry[1] : null;
};

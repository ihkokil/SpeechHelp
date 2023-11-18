
import { QuestionItem } from '@/components/speech/questionnaires/types';

/**
 * Formats a question for template display
 * @param question The question to format
 * @returns Formatted question text with answer space
 */
export const formatQuestionForTemplate = (question: QuestionItem): string => {
  let formattedContent = '';
  
  // Format the question
  formattedContent += `### ${question.question}\n`;
  
  // Add options if they exist
  if (question.type === 'radio' && question.options) {
    formattedContent += `Options: ${question.options.join(', ')}\n\n`;
  } else {
    // Add a blank space for written answers
    formattedContent += `Answer: _____________________________________________\n\n`;
  }
  
  return formattedContent;
};

/**
 * Creates the full content for a speech template PDF
 * @param speechTypeLabel The label for the speech type
 * @param questionnaire The questionnaire for this speech type
 * @returns Formatted template content ready for PDF generation
 */
export const createTemplateContent = (
  speechTypeLabel: string,
  questionnaire: QuestionItem[]
): string => {
  const templateTitle = `${speechTypeLabel} Speech Template`;
  
  return `# ${templateTitle}\n\n` +
    `## Questionnaire\n\n` +
    `${questionnaire.map(q => {
      // Check if this question has a condition
      if (q.condition) {
        const conditionInfo = `Note: This question appears when "${q.condition.question}" is answered with "${q.condition.value}"\n\n`;
        return formatQuestionForTemplate(q) + conditionInfo;
      }
      return formatQuestionForTemplate(q);
    }).join('')}` +
    `\n## Sample Speech Structure\n\n` +
    `### Introduction\n` +
    `• Opening hook\n` +
    `• Greeting and introduction\n` +
    `• Purpose statement\n\n` +
    `### Body\n` +
    `• Main point 1 (with supporting details)\n` +
    `• Main point 2 (with supporting details)\n` +
    `• Main point 3 (with supporting details)\n\n` +
    `### Conclusion\n` +
    `• Summary of key points\n` +
    `• Final message or call to action\n` +
    `• Closing statement`;
};

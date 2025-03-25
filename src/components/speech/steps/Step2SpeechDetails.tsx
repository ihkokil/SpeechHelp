
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Translate from '@/components/Translate';

interface StepProps {
  nextStep: () => void;
  prevStep: () => void;
  selectedSpeechType: string;
  onDetailsChange: (details: Record<string, string>) => void;
}

type QuestionType = 'text' | 'textarea' | 'radio';

interface Question {
  question: string;
  type: QuestionType;
  placeholder?: string;
  options?: string[];
  condition?: {
    questionId: string;
    value: string;
  };
}

const Step2SpeechDetails: React.FC<StepProps> = ({
  nextStep,
  prevStep,
  selectedSpeechType,
  onDetailsChange,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  // Introduction question that will be added to all speech types
  const introductionQuestion: Question = {
    question: "Will you be introduced before you speak?",
    type: "radio",
    options: ["Yes", "No"]
  };

  // Common follow-up questions when the user answers "No" to the introduction question
  const introFollowUpQuestions: Question[] = [
    {
      question: "What is your name?",
      type: "text",
      placeholder: "Enter your full name",
      condition: {
        questionId: "Will you be introduced before you speak?",
        value: "No"
      }
    },
    {
      question: "What is your relationship to the occasion?",
      type: "text",
      placeholder: "e.g., Friend of the graduate, CEO of the company, etc.",
      condition: {
        questionId: "Will you be introduced before you speak?",
        value: "No"
      }
    }
  ];

  useEffect(() => {
    let speechQuestions: Question[] = [];

    // Add the introduction question to all speech types first
    speechQuestions.push(introductionQuestion);
    
    // Then add the conditional follow-up questions
    speechQuestions = [...speechQuestions, ...introFollowUpQuestions];

    // Add specific questions based on speech type
    switch (selectedSpeechType) {
      case 'wedding-toast':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who are you toasting?",
            type: "text",
            placeholder: "e.g., The bride and groom, Sarah and John"
          },
          {
            question: "How do you know them?",
            type: "textarea",
            placeholder: "Describe your relationship..."
          },
          {
            question: "How long have you known them?",
            type: "text",
            placeholder: "e.g., 10 years, since college, etc."
          },
          {
            question: "Any specific memories you'd like to share?",
            type: "textarea",
            placeholder: "Describe a significant moment..."
          },
          {
            question: "What do you want to wish for them?",
            type: "textarea",
            placeholder: "Your wishes for their future..."
          }
        ];
        break;

      case 'maid-of-honor':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Bride's name",
            type: "text",
            placeholder: "Enter bride's name"
          },
          {
            question: "Groom's name",
            type: "text",
            placeholder: "Enter groom's name"
          },
          {
            question: "How long have you known the bride?",
            type: "text",
            placeholder: "e.g., 15 years, since childhood, etc."
          },
          {
            question: "How did the couple meet?",
            type: "textarea",
            placeholder: "Share their story..."
          },
          {
            question: "Any funny or touching memories to share?",
            type: "textarea",
            placeholder: "Describe a significant memory..."
          },
          {
            question: "What do you admire most about their relationship?",
            type: "textarea",
            placeholder: "Share what makes their love special..."
          }
        ];
        break;

      case 'best-man':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Groom's name",
            type: "text",
            placeholder: "Enter groom's name"
          },
          {
            question: "Bride's name",
            type: "text",
            placeholder: "Enter bride's name"
          },
          {
            question: "How long have you known the groom?",
            type: "text",
            placeholder: "e.g., 20 years, since school, etc."
          },
          {
            question: "How did the couple meet?",
            type: "textarea",
            placeholder: "Share their story..."
          },
          {
            question: "Any funny or memorable stories about the groom?",
            type: "textarea",
            placeholder: "Share a memorable anecdote..."
          },
          {
            question: "What do you admire most about their relationship?",
            type: "textarea",
            placeholder: "Share what makes their love special..."
          }
        ];
        break;

      case 'birthday-toast':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who is celebrating their birthday?",
            type: "text",
            placeholder: "Enter their name"
          },
          {
            question: "How do you know them?",
            type: "text",
            placeholder: "e.g., Friend, family member, colleague"
          },
          {
            question: "Which birthday are they celebrating?",
            type: "text",
            placeholder: "e.g., 30th, 50th, etc."
          },
          {
            question: "Any special memories you'd like to share?",
            type: "textarea",
            placeholder: "Describe a meaningful moment..."
          },
          {
            question: "What qualities do you admire most about them?",
            type: "textarea",
            placeholder: "Describe what makes them special..."
          }
        ];
        break;

      case 'graduation':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "What degree/level of education is being celebrated?",
            type: "text",
            placeholder: "e.g., High School, Bachelor's, Master's, PhD"
          },
          {
            question: "What was the field of study?",
            type: "text",
            placeholder: "e.g., Computer Science, Literature, Medicine"
          },
          {
            question: "Any specific achievements during their education?",
            type: "textarea",
            placeholder: "Describe notable accomplishments..."
          },
          {
            question: "Any challenges overcome during their studies?",
            type: "textarea",
            placeholder: "Describe significant obstacles..."
          },
          {
            question: "What are their future plans or aspirations?",
            type: "textarea",
            placeholder: "Describe what comes next..."
          }
        ];
        break;

      case 'retirement':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who is retiring?",
            type: "text",
            placeholder: "Enter their name"
          },
          {
            question: "What position/role are they retiring from?",
            type: "text",
            placeholder: "e.g., CEO, Teacher, Engineer"
          },
          {
            question: "How many years did they work in this field?",
            type: "text",
            placeholder: "e.g., 25 years, 3 decades"
          },
          {
            question: "What were their biggest achievements?",
            type: "textarea",
            placeholder: "Describe significant accomplishments..."
          },
          {
            question: "How have they influenced others?",
            type: "textarea",
            placeholder: "Describe their impact..."
          },
          {
            question: "What are their retirement plans?",
            type: "textarea",
            placeholder: "Describe their future plans..."
          }
        ];
        break;

      case 'funeral-eulogy':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who has passed away?",
            type: "text",
            placeholder: "Enter their name"
          },
          {
            question: "What was your relationship to them?",
            type: "text",
            placeholder: "e.g., Friend, family member, colleague"
          },
          {
            question: "What were they known for?",
            type: "textarea",
            placeholder: "Describe their character, career, passions..."
          },
          {
            question: "What special memories would you like to share?",
            type: "textarea",
            placeholder: "Describe meaningful moments..."
          },
          {
            question: "What legacy do they leave behind?",
            type: "textarea",
            placeholder: "Describe their lasting impact..."
          },
          {
            question: "What would you like others to remember about them?",
            type: "textarea",
            placeholder: "Share important qualities or achievements..."
          }
        ];
        break;

      case 'award-acceptance':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "What award are you receiving?",
            type: "text",
            placeholder: "Enter award name"
          },
          {
            question: "Who is presenting the award?",
            type: "text",
            placeholder: "Enter organization or individual name"
          },
          {
            question: "Why are you receiving this award?",
            type: "textarea",
            placeholder: "Describe the achievement being recognized..."
          },
          {
            question: "Who would you like to thank?",
            type: "textarea",
            placeholder: "List individuals or groups..."
          },
          {
            question: "Any challenges you overcame to achieve this?",
            type: "textarea",
            placeholder: "Describe significant obstacles..."
          },
          {
            question: "What does this award mean to you?",
            type: "textarea",
            placeholder: "Describe the personal significance..."
          }
        ];
        break;

      case 'business-presentation':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "What is the main topic of your presentation?",
            type: "text",
            placeholder: "e.g., Quarterly results, new product launch"
          },
          {
            question: "Who is your audience?",
            type: "text",
            placeholder: "e.g., Board members, team, clients"
          },
          {
            question: "What are the key points you want to cover?",
            type: "textarea",
            placeholder: "List main topics..."
          },
          {
            question: "Any specific data or statistics to include?",
            type: "textarea",
            placeholder: "List important numbers or trends..."
          },
          {
            question: "What action do you want the audience to take?",
            type: "textarea",
            placeholder: "Describe desired outcomes..."
          },
          {
            question: "Any challenges or opportunities to address?",
            type: "textarea",
            placeholder: "Describe relevant issues..."
          }
        ];
        break;

      case 'motivational':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "What is the main theme of your speech?",
            type: "text",
            placeholder: "e.g., Perseverance, innovation, teamwork"
          },
          {
            question: "Who is your audience?",
            type: "text",
            placeholder: "e.g., Students, employees, conference attendees"
          },
          {
            question: "What personal experience can you share related to this theme?",
            type: "textarea",
            placeholder: "Describe a relevant story..."
          },
          {
            question: "What challenges did you overcome?",
            type: "textarea",
            placeholder: "Describe significant obstacles..."
          },
          {
            question: "What key lessons do you want to convey?",
            type: "textarea",
            placeholder: "List main takeaways..."
          },
          {
            question: "What call to action do you want to leave them with?",
            type: "textarea",
            placeholder: "Describe what you want them to do..."
          }
        ];
        break;

      case 'honor-speech':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who are you honoring?",
            type: "text",
            placeholder: "Enter their name"
          },
          {
            question: "What is the occasion?",
            type: "text",
            placeholder: "e.g., Award ceremony, retirement, anniversary"
          },
          {
            question: "How do you know the honoree?",
            type: "text",
            placeholder: "Describe your relationship..."
          },
          {
            question: "What specific achievements are being recognized?",
            type: "textarea",
            placeholder: "Describe their accomplishments..."
          },
          {
            question: "Any memorable stories to share?",
            type: "textarea",
            placeholder: "Describe a significant moment..."
          },
          {
            question: "Qualities or achievements to highlight.",
            type: "textarea",
            placeholder: "What would you like to recognize?"
          },
          {
            question: "How has this person impacted others?",
            type: "textarea",
            placeholder: "Describe their influence..."
          }
        ];
        break;

      case 'farewell-speech':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who is leaving?",
            type: "text",
            placeholder: "Enter their name or group"
          },
          {
            question: "What is their role/position?",
            type: "text",
            placeholder: "e.g., Manager, colleague, classmate"
          },
          {
            question: "How long have they been with the organization?",
            type: "text",
            placeholder: "e.g., 5 years, 2 decades"
          },
          {
            question: "What have been their key contributions?",
            type: "textarea",
            placeholder: "Describe major achievements..."
          },
          {
            question: "Any memorable experiences to share?",
            type: "textarea",
            placeholder: "Describe significant moments..."
          },
          {
            question: "Where are they going next?",
            type: "text",
            placeholder: "e.g., New job, retirement, relocation"
          },
          {
            question: "What will be missed most about them?",
            type: "textarea",
            placeholder: "Describe their unique qualities..."
          }
        ];
        break;

      case 'anniversary-toast':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Whose anniversary is being celebrated?",
            type: "text",
            placeholder: "Enter their names"
          },
          {
            question: "How many years are they celebrating?",
            type: "text",
            placeholder: "e.g., 25 years, Golden anniversary"
          },
          {
            question: "What is your relationship to the couple?",
            type: "text",
            placeholder: "e.g., Friend, family member"
          },
          {
            question: "How did they meet?",
            type: "textarea",
            placeholder: "Share their story..."
          },
          {
            question: "What challenges have they overcome together?",
            type: "textarea",
            placeholder: "Describe significant moments..."
          },
          {
            question: "What makes their relationship special?",
            type: "textarea",
            placeholder: "Describe qualities you admire..."
          },
          {
            question: "What do you wish for their future?",
            type: "textarea",
            placeholder: "Share your hopes for them..."
          }
        ];
        break;

      case 'promotion-congrats':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "Who has been promoted?",
            type: "text",
            placeholder: "Enter their name"
          },
          {
            question: "What is their new position?",
            type: "text",
            placeholder: "e.g., Senior Manager, Director, VP"
          },
          {
            question: "How long have they been with the company?",
            type: "text",
            placeholder: "e.g., 3 years, a decade"
          },
          {
            question: "What achievements led to this promotion?",
            type: "textarea",
            placeholder: "Describe key accomplishments..."
          },
          {
            question: "Any memorable projects or initiatives?",
            type: "textarea",
            placeholder: "Describe significant contributions..."
          },
          {
            question: "Qualities or achievements to highlight.",
            type: "textarea",
            placeholder: "What contributions or strengths to recognize?"
          },
          {
            question: "What impact have they had on the team/company?",
            type: "textarea",
            placeholder: "Describe their influence..."
          }
        ];
        break;

      case 'toast':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "What occasion is this toast for?",
            type: "text",
            placeholder: "e.g., Wedding, birthday, achievement"
          },
          {
            question: "Who are you toasting?",
            type: "text",
            placeholder: "Enter their name"
          },
          {
            question: "What is your relationship to them?",
            type: "text",
            placeholder: "e.g., Friend, family member, colleague"
          },
          {
            question: "Any special memories to share?",
            type: "textarea",
            placeholder: "Describe meaningful moments..."
          },
          {
            question: "What qualities do you admire about them?",
            type: "textarea",
            placeholder: "Describe what makes them special..."
          },
          {
            question: "What are you celebrating or acknowledging?",
            type: "textarea",
            placeholder: "Describe the achievement or milestone..."
          }
        ];
        break;

      case 'other':
        speechQuestions = [
          ...speechQuestions,
          {
            question: "What type of speech is this?",
            type: "text",
            placeholder: "e.g., Roast, welcome address, etc."
          },
          {
            question: "What is the occasion?",
            type: "text",
            placeholder: "Describe the event..."
          },
          {
            question: "Who is your audience?",
            type: "text",
            placeholder: "e.g., Friends, colleagues, mixed group"
          },
          {
            question: "What is the main message you want to convey?",
            type: "textarea",
            placeholder: "Describe your key points..."
          },
          {
            question: "Any specific stories or examples to include?",
            type: "textarea",
            placeholder: "Describe relevant anecdotes..."
          },
          {
            question: "What tone would you like for your speech?",
            type: "radio",
            options: ["Formal", "Casual", "Humorous", "Serious", "Inspirational"]
          }
        ];
        break;

      default:
        break;
    }

    setQuestions(speechQuestions);
  }, [selectedSpeechType]);

  const handleAnswerChange = (questionText: string, value: string) => {
    const updatedAnswers = { ...answers, [questionText]: value };
    setAnswers(updatedAnswers);
    onDetailsChange(updatedAnswers);
  };

  const shouldShowQuestion = (question: Question): boolean => {
    // If there's no condition, always show the question
    if (!question.condition) return true;

    // If there's a condition, check if it's met
    const { questionId, value } = question.condition;
    return answers[questionId] === value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.detailsTitle" /></CardTitle>
        <CardDescription>
          <Translate text="speechLab.detailsDesc" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((q, index) => (
            shouldShowQuestion(q) && (
              <div key={index} className="space-y-2">
                <Label htmlFor={`question-${index}`}>{q.question}</Label>
                
                {q.type === 'text' && (
                  <Input
                    id={`question-${index}`}
                    placeholder={q.placeholder || ''}
                    value={answers[q.question] || ''}
                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                  />
                )}
                
                {q.type === 'textarea' && (
                  <Textarea
                    id={`question-${index}`}
                    placeholder={q.placeholder || ''}
                    value={answers[q.question] || ''}
                    onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                    rows={3}
                  />
                )}
                
                {q.type === 'radio' && q.options && (
                  <RadioGroup
                    value={answers[q.question] || ''}
                    onValueChange={(value) => handleAnswerChange(q.question, value)}
                  >
                    {q.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem id={`question-${index}-${option}`} value={option} />
                        <Label htmlFor={`question-${index}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ButtonCustom onClick={prevStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Translate text="speechLab.backButton" />
        </ButtonCustom>
        <ButtonCustom onClick={nextStep} variant="magenta">
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step2SpeechDetails;

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MicIcon, 
  PlayIcon, 
  RefreshCwIcon, 
  SendIcon, 
  DownloadIcon,
  ChevronDownIcon,
  TrashIcon,
  SaveIcon,
  PlusIcon,
  ArrowRightIcon,
  ListIcon,
  FileTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  PencilIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import SpeechStepIndicator from '@/components/speech/SpeechStepIndicator';
import ReactConfetti from 'react-confetti';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const speechTypes = [
  { value: 'wedding', label: 'Wedding Speech' },
  { value: 'graduation', label: 'Graduation Speech' },
  { value: 'birthday', label: 'Birthday Speech / Anniversary / Special Occasion' },
  { value: 'business', label: 'Business Speech' },
  { value: 'tedtalk', label: 'TED Talk' },
  { value: 'motivational', label: 'Motivational Speech' },
  { value: 'funeral', label: 'Funeral / Commemorative Speech' },
  { value: 'keynote', label: 'Keynote Address' },
  { value: 'social', label: 'Social Speech' },
  { value: 'farewell', label: 'Farewell Speech' },
  { value: 'informative', label: 'Informative Speech' },
  { value: 'persuasive', label: 'Persuasive Speech' },
  { value: 'entertaining', label: 'Entertaining Speech' },
  { value: 'retirement', label: 'Retirement Speech' },
  { value: 'award', label: 'Award Ceremony Speech' },
  { value: 'other', label: 'Other Speech / Special Event Speech' },
];

const weddingRoles = [
  { value: 'bride', label: 'Bride' },
  { value: 'groom', label: 'Groom' },
  { value: 'bestman', label: 'Best Man' },
  { value: 'maidofhonor', label: 'Maid of Honor' },
  { value: 'fatherofbride', label: 'Father of the Bride' },
  { value: 'motherofbride', label: 'Mother of the Bride' },
  { value: 'fatherofgroom', label: 'Father of the Groom' },
  { value: 'motherofgroom', label: 'Mother of the Groom' },
  { value: 'bridesmaid', label: 'Bridesmaid' },
  { value: 'groomsman', label: 'Groomsman' },
  { value: 'other', label: 'Other' },
];

const speechDurations = [
  { value: '2min', label: '2 minutes (approx. 250-300 words)' },
  { value: '5min', label: '5 minutes (approx. 650-750 words)' },
  { value: '8min', label: '8 minutes (approx. 1000-1200 words)' },
  { value: '10min', label: '10 minutes (approx. 1300-1500 words)' },
  { value: 'custom', label: 'Custom length' },
];

const speechTones = [
  { value: 'funny', label: 'Funny & Light-hearted' },
  { value: 'heartwarming', label: 'Heartwarming & Emotional' },
  { value: 'romantic', label: 'Romantic & Sentimental' },
  { value: 'inspirational', label: 'Inspirational & Uplifting' },
  { value: 'formal', label: 'Formal & Traditional' },
  { value: 'mixed', label: 'Mixed (Humor with Sentiment)' },
];

const speechQuestions = {
  wedding: [
    {
      id: 'role',
      question: "Who are you in relation to the wedding?",
      type: 'select',
      options: weddingRoles,
      placeholder: "Select your role",
    },
    {
      id: 'relationship',
      question: "What is your specific relationship to the couple?",
      type: 'text',
      placeholder: "E.g., Groom's childhood friend, Bride's college roommate",
    },
    {
      id: 'names',
      question: "What are the names of the people mentioned in your speech?",
      type: 'longtext',
      placeholder: "E.g., Bride: Sarah, Groom: Michael, Bride's Parents: John and Mary",
    },
    {
      id: 'duration',
      question: "How long would you like the speech to be?",
      type: 'select',
      options: speechDurations,
      placeholder: "Select desired length",
    },
    {
      id: 'tone',
      question: "What would you like the tone of the speech to be?",
      type: 'select',
      options: speechTones,
      placeholder: "Select speech tone",
    },
    {
      id: 'funny_anecdote',
      question: "Can you share a funny anecdote about the couple?",
      type: 'longtext',
      placeholder: "E.g., A humorous story about how they met or a memorable experience",
    },
    {
      id: 'opening_quote',
      question: "Would you like to open with a famous romantic quote?",
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes, I have one in mind' },
        { value: 'suggestion', label: 'Yes, I would like a suggestion' },
        { value: 'no', label: 'No, skip the opening quote' },
      ],
    },
    {
      id: 'quote_text',
      question: "Please provide the quote you'd like to use",
      type: 'longtext',
      placeholder: "Enter your quote",
      conditional: { field: 'opening_quote', value: 'yes' },
    },
    {
      id: 'bride_qualities',
      question: "What are some qualities you admire about the bride?",
      type: 'longtext',
      placeholder: "E.g., Her kindness, sense of humor, intelligence, etc.",
    },
    {
      id: 'groom_qualities',
      question: "What are some qualities you admire about the groom?",
      type: 'longtext',
      placeholder: "E.g., His loyalty, sense of adventure, generosity, etc.",
    },
    {
      id: 'memorable_moment',
      question: "Can you share a heartwarming or memorable moment you've shared with the couple?",
      type: 'longtext',
      placeholder: "E.g., A special trip, a meaningful conversation, etc.",
    },
    {
      id: 'message_theme',
      question: "Is there a particular message or theme you would like to convey?",
      type: 'longtext',
      placeholder: "E.g., Love, friendship, family, etc.",
    },
    {
      id: 'cultural_religious',
      question: "Would you like to include any specific cultural or religious references?",
      type: 'longtext',
      placeholder: "If yes, please specify",
    },
    {
      id: 'inside_jokes',
      question: "Are there any inside jokes or personal references you would like to include?",
      type: 'longtext',
      placeholder: "E.g., A nickname, a shared experience, etc.",
    },
    {
      id: 'toast_ending',
      question: "Would you like to end the speech with a toast?",
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes, I have specific wording in mind' },
        { value: 'suggestion', label: 'Yes, I would like a suggestion' },
        { value: 'no', label: 'No toast' },
      ],
    },
    {
      id: 'toast_text',
      question: "Please provide the toast wording you'd like to use",
      type: 'longtext',
      placeholder: "Enter your toast wording",
      conditional: { field: 'toast_ending', value: 'yes' },
    },
    {
      id: 'additional_elements',
      question: "Is there anything else you would like to include?",
      type: 'longtext',
      placeholder: "E.g., A special thank you, a piece of advice, mentioning deceased loved ones",
    },
    {
      id: 'avoid_topics',
      question: "Are there any topics or subjects you would like to avoid?",
      type: 'longtext',
      placeholder: "E.g., Personal struggles, certain relationships, etc.",
    },
  ],
  birthday: [
    {
      id: 'relationship',
      question: "What is your relationship to the birthday person?",
      type: 'text',
      placeholder: "E.g., Friend, Parent, Sibling, etc.",
    },
    {
      id: 'age',
      question: "How old is the person turning?",
      type: 'text',
      placeholder: "Enter age",
    },
    {
      id: 'duration',
      question: "How long would you like the speech to be?",
      type: 'select',
      options: speechDurations,
      placeholder: "Select desired length",
    },
    {
      id: 'tone',
      question: "What would you like the tone of the speech to be?",
      type: 'select',
      options: speechTones,
      placeholder: "Select speech tone",
    },
    {
      id: 'qualities',
      question: "What are some qualities you admire about this person?",
      type: 'longtext',
      placeholder: "E.g., Their kindness, humor, intelligence, etc.",
    },
    {
      id: 'memories',
      question: "What are some of your favorite memories with this person?",
      type: 'longtext',
      placeholder: "Share 2-3 memorable stories or moments",
    },
    {
      id: 'achievements',
      question: "What achievements or milestones would you like to highlight?",
      type: 'longtext',
      placeholder: "Personal or professional accomplishments",
    },
    {
      id: 'inside_jokes',
      question: "Are there any inside jokes or personal references you would like to include?",
      type: 'longtext',
      placeholder: "E.g., Nicknames, recurring jokes, etc.",
    },
    {
      id: 'wishes',
      question: "What wishes do you have for their future?",
      type: 'longtext',
      placeholder: "Your hopes and dreams for them",
    },
    {
      id: 'avoid_topics',
      question: "Are there any topics you would like to avoid?",
      type: 'longtext',
      placeholder: "E.g., Personal struggles, certain relationships, etc.",
    },
  ],
};

const SpeechLab = () => {
  const { user, saveSpeech } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedSpeechType, setSelectedSpeechType] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isQuestionnaire, setIsQuestionnaire] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any>>({});
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [speechTitle, setSpeechTitle] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showNameInput, setShowNameInput] = useState(false);
  const [isEditingGeneratedSpeech, setIsEditingGeneratedSpeech] = useState(false);
  const [editedSpeechContent, setEditedSpeechContent] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Welcome to the Speech Generator! I can help you create personalized speeches for various occasions. To get started, please select the type of speech you need from the dropdown above.',
          timestamp: new Date(),
        },
      ]);
    }
  }, [activeTab, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeechTypeChange = (value: string) => {
    console.log("Selected speech type:", value);
    setSelectedSpeechType(value);
    setQuestionnaireAnswers({});
    setCurrentQuestion(0);
    
    const speechType = speechTypes.find(type => type.value === value)?.label;
    
    const defaultTitle = `${speechType} - ${new Date().toLocaleDateString()}`;
    setSpeechTitle(defaultTitle);
    
    setCurrentStep(3);
    setShowNameInput(true);
  };

  const handleNameSubmit = () => {
    setCurrentStep(4);
    setShowNameInput(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I'd like to create a ${
        speechTypes.find(type => type.value === selectedSpeechType)?.label
      } titled "${speechTitle}".`,
      timestamp: new Date(),
    };
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Great! I'll help you create a ${
        speechTypes.find(type => type.value === selectedSpeechType)?.label
      } titled "${speechTitle}". Would you like to answer a few questions from our SpeechHelp "wizard" to personalize your speech, or would you prefer a conversational approach? (If you'd like to use the wizard questionnaire, simply type "wizard" in the chat)`,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage, assistantMessage]);
  };

  const handleShowQuestionnaire = () => {
    setShowQuestionnaire(true);
    setIsQuestionnaire(true);
    
    setCurrentStep(5);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: "I'd like to fill out the detailed questionnaire.",
      timestamp: new Date(),
    };
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Perfect! Please fill out the questionnaire below to help me create a personalized ${
        speechTypes.find(type => type.value === selectedSpeechType)?.label
      } for you. The more details you provide, the better I can tailor the speech to your needs.`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setQuestionnaireAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleQuestionnaireSubmit = () => {
    setIsGeneratingSpeech(true);
    setShowQuestionnaire(false);
    setCurrentStep(5);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: "I've completed the questionnaire with all the details for my speech.",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const speech = generateSpeechFromQuestionnaire(questionnaireAnswers, selectedSpeechType);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've generated a speech based on your questionnaire responses. Here it is:",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setGeneratedSpeech(speech);
      setIsGeneratingSpeech(false);
      setActiveTab('result');
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
      
      toast({
        title: "Speech Generated!",
        description: "Your personalized speech is ready to view and download.",
      });
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    
    if (inputMessage.toLowerCase().trim() === "wizard") {
      handleShowQuestionnaire();
      return;
    }
    
    if (messages.length === 2 && messages[1].role === 'assistant' && 
        messages[1].content.includes('Would you like to answer a few questions')) {
      
      if (inputMessage.toLowerCase().includes('questionnaire') || 
          inputMessage.toLowerCase().includes('wizard')) {
        handleShowQuestionnaire();
        return;
      } else {
        setIsQuestionnaire(false);
        
        setTimeout(() => {
          const firstQuestion = speechQuestions[selectedSpeechType as keyof typeof speechQuestions]?.[0] || 
                              { question: "Tell me more about the speech you're planning to give." };
          
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: firstQuestion.question,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        }, 500);
        
        return;
      }
    }
    
    setIsTyping(true);
    
    setTimeout(() => {
      if (!isQuestionnaire) {
        const questions = speechQuestions[selectedSpeechType as keyof typeof speechQuestions] || [];
        const nextQuestion = currentQuestion < questions.length ? 
          questions[currentQuestion].question : 
          "Thank you for all that information! I think I have enough to create your speech. Would you like me to generate it now?";
        
        const newAssistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: nextQuestion,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newAssistantMessage]);
        setCurrentQuestion(prev => prev + 1);
        
        if (currentQuestion >= questions.length && inputMessage.toLowerCase().includes('yes')) {
          handleGenerateSpeech();
        }
      }
      
      setIsTyping(false);
    }, 1000);
  };

  const handleGenerateSpeech = () => {
    setIsGeneratingSpeech(true);
    
    setTimeout(() => {
      const speechContent = generateSpeechFromConversation(messages, selectedSpeechType);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've generated a speech based on our conversation. Here it is:",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setGeneratedSpeech(speechContent);
      setIsGeneratingSpeech(false);
      setActiveTab('result');
      
      setCurrentStep(5);
      
      const speechTypeLabel = speechTypes.find(type => type.value === selectedSpeechType)?.label || 'Custom Speech';
      setSpeechTitle(`${speechTypeLabel} - ${new Date().toLocaleDateString()}`);
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
      
      toast({
        title: "Speech Generated!",
        description: "Your personalized speech is ready to view and download.",
      });
    }, 3000);
  };

  const generateSpeechFromQuestionnaire = (answers: Record<string, any>, speechType: string) => {
    console.log("Generating speech with answers:", answers);
    
    switch (speechType) {
      case 'wedding':
        const role = answers.role || 'friend';
        const speakerRelationship = answers.relationship || 'close friend';
        const names = answers.names || '';
        const brideName = extractName(names, 'Bride') || 'the bride';
        const groomName = extractName(names, 'Groom') || 'the groom';
        const brideParents = extractName(names, "Bride's Parents") || "the bride's parents";
        const groomParents = extractName(names, "Groom's Parents") || "the groom's parents";
        
        const duration = answers.duration || '5min';
        const tone = answers.tone || 'heartwarming';
        const brideQualities = answers.bride_qualities || '';
        const groomQualities = answers.groom_qualities || '';
        const anecdote = answers.funny_anecdote || '';
        const memorableMoment = answers.memorable_moment || '';
        const messageTheme = answers.message_theme || '';
        const culturalReligious = answers.cultural_religious || '';
        const insideJokes = answers.inside_jokes || '';
        const additionalElements = answers.additional_elements || '';
        const avoidTopics = answers.avoid_topics || '';
        
        let opening = '';
        if (answers.opening_quote === 'yes' && answers.quote_text) {
          opening = `"${answers.quote_text}" `;
        } else if (answers.opening_quote === 'suggestion') {
          opening = `"Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day." `;
        }
        
        let closing = '';
        if (answers.toast_ending === 'yes' && answers.toast_text) {
          closing = `${answers.toast_text}`;
        } else if (answers.toast_ending === 'suggestion') {
          closing = `So let's raise our glasses to ${brideName} and ${groomName}. May your love story continue to unfold, chapter after beautiful chapter. To a lifetime of love, laughter, and happily ever after!`;
        }
        
        let speech = '';
        
        if (opening) {
          speech += `${opening}\n\n`;
        }
        
        speech += `Ladies and gentlemen, family and friends, I am honored to stand before you today as ${getRoleTitle(role)} to celebrate the union of ${brideName} and ${groomName}.\n\n`;
        speech += `My name is ${speakerRelationship}, and I've had the privilege of witnessing their beautiful journey together.\n\n`;
        
        if (anecdote) {
          speech += `${anecdote}\n\n`;
        }
        
        if (brideQualities) {
          speech += `What makes ${brideName} so special is ${brideQualities}. `;
        }
        
        if (groomQualities) {
          speech += `And ${groomName}, your ${groomQualities} complement each other perfectly.\n\n`;
        }
        
        if (memorableMoment) {
          speech += `One of my favorite memories with them is ${memorableMoment}.\n\n`;
        }
        
        if (messageTheme) {
          speech += `As I reflect on their relationship, I'm reminded of ${messageTheme}.\n\n`;
        }
        
        if (culturalReligious) {
          speech += `${culturalReligious}\n\n`;
        }
        
        if (insideJokes) {
          speech += `${insideJokes}\n\n`;
        }
        
        if (additionalElements) {
          speech += `${additionalElements}\n\n`;
        }
        
        if (closing) {
          speech += `${closing}`;
        }
        
        console.log("Generated speech:", speech);
        
        return speech;
      
      case 'birthday':
        const birthdayRelationship = answers.relationship || 'friend';
        const birthdayAge = answers.age || '';
        const birthdayTone = answers.tone || 'heartwarming';
        const birthdayQualities = answers.qualities || '';
        const birthdayMemories = answers.memories || '';
        const birthdayAchievements = answers.achievements || '';
        const birthdayInsideJokes = answers.inside_jokes || '';
        const birthdayWishes = answers.wishes || '';
        
        let birthdaySpeech = `Ladies and gentlemen, friends and family,\n\n`;
        birthdaySpeech += `It's my privilege to stand before you today as ${birthdayRelationship} to celebrate this special birthday.\n\n`;
        
        if (birthdayAge) {
          birthdaySpeech += `Turning ${birthdayAge} is a wonderful milestone, and I'm so happy we're all here to mark this occasion together.\n\n`;
        }
        
        if (birthdayQualities) {
          birthdaySpeech += `When I think about what makes this person so special, I think of ${birthdayQualities}.\n\n`;
        }
        
        if (birthdayMemories) {
          birthdaySpeech += `I cherish the memories we've shared, like ${birthdayMemories}.\n\n`;
        }
        
        if (birthdayAchievements) {
          birthdaySpeech += `I'm so proud of the accomplishments you've achieved, including ${birthdayAchievements}.\n\n`;
        }
        
        if (birthdayInsideJokes) {
          birthdaySpeech += `Of course, I couldn't give this speech without mentioning ${birthdayInsideJokes}.\n\n`;
        }
        
        if (birthdayWishes) {
          birthdaySpeech += `As we celebrate today, my wishes for you are ${birthdayWishes}.\n\n`;
        }
        
        birthdaySpeech += `Happy birthday, and may this year bring you all the joy and happiness you deserve!`;
        
        return birthdaySpeech;
      
      default:
        return "Ladies and gentlemen, distinguished guests...\n\nIt is my great pleasure to address you all today. This personalized speech would normally be generated based on all the detailed information you provided in the questionnaire, creating a meaningful and tailored message for your specific occasion.\n\nThe speech would include your personal anecdotes, the qualities you admire about the relevant people, and all the special moments you've shared. It would maintain the tone you selected and avoid any topics you mentioned.\n\nIn closing, thank you for the opportunity to be part of this special occasion. May this day be just the beginning of many more wonderful memories to come.";
    }
  };

  const getRoleTitle = (role: string): string => {
    switch(role) {
      case 'bride': return 'the bride';
      case 'groom': return 'the groom';
      case 'bestman': return 'the best man';
      case 'maidofhonor': return 'the maid of honor';
      case 'fatherofbride': return 'the father of the bride';
      case 'motherofbride': return 'the mother of the bride';
      case 'fatherofgroom': return 'the father of the groom';
      case 'motherofgroom': return 'the mother of the groom';
      case 'bridesmaid': return 'a bridesmaid';
      case 'groomsman': return 'a groomsman';
      default: return role;
    }
  };

  const extractName = (namesText: string, role: string) => {
    if (!namesText) return null;
    
    const regex = new RegExp(`${role}:\\s*([^,]+)`, 'i');
    const match = namesText.match(regex);
    return match ? match[1].trim() : null;
  };

  const generateSpeechFromConversation = (messages: Message[], speechType: string) => {
    switch (speechType) {
      case 'wedding':
        return "Ladies and gentlemen, family and friends, we are gathered here today to celebrate the union of two extraordinary people. It is my absolute pleasure to stand before you all and raise a toast to this beautiful couple.\n\nI've had the privilege of watching their love story unfold, and what a journey it has been. Through every high and low, they've stood by each other with unwavering support and genuine affection.\n\nWhat makes their relationship so special is not just the love they share, but the friendship that forms its foundation. They make each other laugh, they comfort each other in times of need, and most importantly, they bring out the best in one another.\n\nAs they begin this new chapter together, I want to wish them a lifetime filled with joy, adventure, and growth. May your home always be a place of peace, your relationship a source of strength, and your love a beacon of hope.\n\nPlease join me in raising your glasses to the happy couple. To a marriage filled with love, laughter, and happily ever after!";
      case 'bridesmaid':
        return "Hello everyone! For those who don't know me, I'm [Your Name], and I have the honor of being one of the bridesmaids today.\n\nI still remember the day when [Bride's Name] told me about meeting [Groom's Name]. There was something different in her voice, a spark that I hadn't heard before. And standing here today, seeing them together, it's clear that spark has only grown stronger.\n\n[Bride's Name], you've been my friend through thick and thin. Your kindness, your strength, and your ability to find joy in the smallest things are just a few of the qualities that make you so special. And [Groom's Name], thank you for making my friend so incredibly happy. The way you look at her, with such love and admiration, is everything she deserves and more.\n\nTo the newly married couple: May your love continue to grow with each passing day. May you always find reasons to laugh together, to dream together, and to celebrate the beautiful life you're building.\n\nLadies and gentlemen, please raise your glasses to [Bride's Name] and [Groom's Name]. May your marriage be as beautiful as your wedding day and as special as your love for each other. Cheers!";
      default:
        return "Distinguished guests, ladies and gentlemen,\n\nIt is my great pleasure to address you all today. As we gather here for this important occasion, I'm reminded of the power of human connection and shared experiences.\n\nIn a world that often moves too quickly, moments like these give us a chance to pause, to reflect, and to appreciate the journey that has brought us to this point. Whether we're celebrating achievements, marking milestones, or simply acknowledging the passage of time, these gatherings remind us of what truly matters.\n\nAs I look around the room, I see faces that represent different chapters of life's story - each with unique perspectives, experiences, and contributions. It is this diversity that enriches our community and strengthens our collective purpose.\n\nIn closing, I want to express my gratitude for the opportunity to share this moment with all of you. May we carry the spirit of today forward in all our future endeavors.\n\nThank you.";
    }
  };

  const handleDownloadSpeech = () => {
    if (!generatedSpeech && !isEditingGeneratedSpeech) return;
    
    const speechContentToDownload = isEditingGeneratedSpeech ? editedSpeechContent : generatedSpeech;
    
    const element = document.createElement("a");
    const file = new Blob([speechContentToDownload as string], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${speechTitle.trim() || 'speech'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Speech Downloaded",
      description: "Your speech has been downloaded to your device.",
    });
  };

  const handleSaveSpeech = async () => {
    if ((!generatedSpeech && !isEditingGeneratedSpeech) || !user) return;
    
    const contentToSave = isEditingGeneratedSpeech ? editedSpeechContent : generatedSpeech;
    
    try {
      await saveSpeech(
        speechTitle, 
        contentToSave as string,
        selectedSpeechType
      );
      
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account and will appear in your dashboard.",
      });
    } catch (error) {
      console.error('Error saving speech:', error);
      toast({
        title: "Error Saving Speech",
        description: "There was an error saving your speech. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewSpeech = () => {
    setCurrentStep(2);
    
    setSpeechTitle('');
    
    handleClearAll();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechTitle(e.target.value);
  };

  const handleClearAll = () => {
    setSelectedSpeechType('');
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Welcome to the Speech Generator! I can help you create personalized speeches for various occasions. To get started, please select the type of speech you need from the dropdown above.',
        timestamp: new Date(),
      },
    ]);
    setInputMessage('');
    setIsTyping(false);
    setIsGeneratingSpeech(false);
    setGeneratedSpeech(null);
    setCurrentQuestion(0);
    setIsQuestionnaire(false);
    setQuestionnaireAnswers({});
    setShowQuestionnaire(false);
    setActiveTab('chat');
    setIsEditingGeneratedSpeech(false);
    setEditedSpeechContent('');
    
    toast({
      title: "Speech Generator Reset",
      description: "All inputs have been cleared. You can start fresh!",
    });
  };

  const handleEditSpeech = () => {
    setIsEditingGeneratedSpeech(true);
    setEditedSpeechContent(generatedSpeech || '');
  };

  const handleFinishEditing = () => {
    setGeneratedSpeech(editedSpeechContent);
    setIsEditingGeneratedSpeech(false);
  };

  const handleCancelEditing = () => {
    setIsEditingGeneratedSpeech(false);
    setEditedSpeechContent('');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Speech Generator</h2>
            <p className="text-lg mb-6">Create personalized speeches for any occasion</p>
            <Button 
              onClick={handleCreateNewSpeech}
              size="lg"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <PlusIcon className="h-5 w-5" />
              Generate New Speech
            </Button>
          </div>
        );
      
      case 2:
        return (
          <div className="flex flex-col h-full p-8">
            <h2 className="text-2xl font-bold mb-4">Choose Your Speech Type</h2>
            <p className="text-lg mb-6">Select the type of speech you'd like to create</p>
            
            <div className="w-full max-w-md mb-6 relative z-10">
              <Select onValueChange={handleSpeechTypeChange} value={selectedSpeechType}>
                <SelectTrigger className="w-full bg-white cursor-pointer">
                  <SelectValue placeholder="Select a speech type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]">
                  {speechTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-gray-100">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="flex flex-col h-full p-8">
            <h2 className="text-2xl font-bold mb-4">Name Your Speech</h2>
            <p className="text-lg mb-6">Give your speech a memorable name that will help you identify it later</p>
            
            <div className="w-full max-w-md mb-6">
              <Input
                type="text"
                placeholder="Enter a title for your speech"
                value={speechTitle}
                onChange={handleTitleChange}
                className="mb-4"
              />
              <Button 
                onClick={handleNameSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <ArrowRightIcon className="h-4 w-4" />
                Continue to Next Step
              </Button>
            </div>
          </div>
        );
      
      case 4:
      case 5:
      default:
        return (
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <ListIcon className="h-4 w-4" />
                Assistant Chat
              </TabsTrigger>
              <TabsTrigger value="result" disabled={!generatedSpeech} className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4" />
                Generated Speech
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Speech Assistant</CardTitle>
                  <CardDescription>
                    Chat with the AI assistant to create your personalized speech
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-y-auto mb-4 pr-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 ${
                          message.role === 'assistant'
                            ? 'bg-muted p-3 rounded-lg'
                            : 'ml-auto max-w-[80%] bg-primary text-primary-foreground p-3 rounded-lg'
                        }`}
                      >
                        {message.content}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="bg-muted p-3 rounded-lg mb-4">
                        <span className="animate-pulse">Typing...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {showQuestionnaire && selectedSpeechType && (
                    <div className="mb-6 bg-slate-50 p-4 rounded-lg border">
                      <h3 className="font-semibold text-lg mb-4">
                        {speechTypes.find(type => type.value === selectedSpeechType)?.label} Questionnaire
                      </h3>
                      
                      <div className="space-y-6">
                        {speechQuestions[selectedSpeechType as keyof typeof speechQuestions]?.map((question, index) => {
                          if (
                            question.conditional &&
                            questionnaireAnswers[question.conditional.field] !== question.conditional.value
                          ) {
                            return null;
                          }
                          
                          return (
                            <div key={question.id} className="space-y-2">
                              <label className="font-medium text-sm">{index + 1}. {question.question}</label>
                              
                              {question.type === 'text' && (
                                <Input
                                  placeholder={question.placeholder}
                                  value={questionnaireAnswers[question.id] || ''}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                />
                              )}
                              
                              {question.type === 'longtext' && (
                                <Textarea
                                  placeholder={question.placeholder}
                                  value={questionnaireAnswers[question.id] || ''}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  rows={3}
                                />
                              )}
                              
                              {question.type === 'select' && (
                                <Select
                                  value={questionnaireAnswers[question.id] || ''}
                                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={question.placeholder} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {question.options?.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              
                              {question.type === 'radio' && (
                                <RadioGroup
                                  value={questionnaireAnswers[question.id] || ''}
                                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                                  className="flex flex-col space-y-1"
                                >
                                  {question.options?.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                                      <label htmlFor={`${question.id}-${option.value}`}>{option.label}</label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      <Button
                        onClick={handleQuestionnaireSubmit}
                        className="mt-6 w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isGeneratingSpeech ? (
                          <>
                            <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                            Generating Speech...
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="mr-2 h-4 w-4" />
                            Generate Speech
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      disabled={isGeneratingSpeech}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      disabled={!inputMessage.trim() || isGeneratingSpeech}
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                  
                  {isGeneratingSpeech && (
                    <Button disabled className="bg-purple-600">
                      <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                      Generating Speech...
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="result" className="mt-4">
              {generatedSpeech && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <CardTitle>Generated Speech</CardTitle>
                        <CardDescription className="mt-3">
                          <span className="text-purple-600 font-medium">Title: {speechTitle}</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadSpeech}
                          className="flex items-center"
                        >
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        
                        {!isEditingGeneratedSpeech && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditSpeech}
                            className="flex items-center"
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={handleSaveSpeech}
                          className="flex items-center bg-purple-600 hover:bg-purple-700"
                        >
                          <SaveIcon className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {isEditingGeneratedSpeech 
                        ? "Edit your speech below and click 'Apply Changes' when you're done."
                        : "Here's your personalized speech, ready to use!"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditingGeneratedSpeech ? (
                      <Textarea
                        value={editedSpeechContent}
                        onChange={(e) => setEditedSpeechContent(e.target.value)}
                        className="min-h-[400px] font-mono text-sm"
                      />
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-lg border whitespace-pre-line h-[400px] overflow-y-auto">
                        {generatedSpeech}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Speech Type: {speechTypes.find(type => type.value === selectedSpeechType)?.label}
                    </div>
                    {isEditingGeneratedSpeech ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEditing}
                          className="flex items-center"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleFinishEditing}
                          className="flex items-center"
                        >
                          Apply Changes
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateNewSpeech}
                        className="flex items-center"
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New Speech
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            colors={['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9']}
          />
          <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center animate-fade-in z-50 pointer-events-none">
            <div className="text-purple-600 mb-2">
              <SparklesIcon className="h-12 w-12 mx-auto mb-2" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-2">Congratulations!</h2>
            <p className="text-gray-700">Your speech has been successfully generated!</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-1">
        <DashboardSidebar />
        
        <div className="flex-1 px-4 md:px-8 pt-6 pb-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-4">Speech Lab</h1>
              <p className="text-muted-foreground">
                Create professional speeches tailored to your specific needs in minutes
              </p>
            </div>
            
            <SpeechStepIndicator currentStep={currentStep} />
            
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechLab;

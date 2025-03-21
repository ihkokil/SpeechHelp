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
  PlusIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
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
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [speechTitle, setSpeechTitle] = useState('');
  const [isNewSpeechDialogOpen, setIsNewSpeechDialogOpen] = useState(false);
  const [newSpeechTitle, setNewSpeechTitle] = useState('');

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
    setSelectedSpeechType(value);
    setQuestionnaireAnswers({});
    setCurrentQuestion(0);
    
    const speechType = speechTypes.find(type => type.value === value)?.label;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great! I'll help you create a ${speechType}. Would you like to answer a few questions from our SpeechHelp "wizard" to personalize your speech, or would you prefer a conversational approach?`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleShowQuestionnaire = () => {
    setShowQuestionnaire(true);
    setIsQuestionnaire(true);
    
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
      
      const speechTypeLabel = speechTypes.find(type => type.value === selectedSpeechType)?.label || 'Custom Speech';
      setSpeechTitle(`${speechTypeLabel} - ${new Date().toLocaleDateString()}`);
      
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
    
    if (messages.length === 2 && messages[1].role === 'assistant' && 
        messages[1].content.includes('Would you like to fill out a detailed questionnaire')) {
      
      if (inputMessage.toLowerCase().includes('questionnaire')) {
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
      
      const speechTypeLabel = speechTypes.find(type => type.value === selectedSpeechType)?.label || 'Custom Speech';
      setSpeechTitle(`${speechTypeLabel} - ${new Date().toLocaleDateString()}`);
      
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
    if (!generatedSpeech) return;
    
    const element = document.createElement("a");
    const file = new Blob([generatedSpeech], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedSpeechType}-speech.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Speech Downloaded",
      description: "Your speech has been downloaded to your device.",
    });
  };

  const handleSaveSpeech = () => {
    if (!generatedSpeech) return;
    setIsSaveDialogOpen(true);
  };

  const confirmSaveSpeech = async () => {
    if (!generatedSpeech || !user) return;
    
    try {
      await saveSpeech(
        speechTitle, 
        generatedSpeech,
        selectedSpeechType
      );
      
      setIsSaveDialogOpen(false);
      
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
    setSpeechTitle('');
    setNewSpeechTitle('');
    
    toast({
      title: "Speech Generator Reset",
      description: "All inputs have been cleared. You can start fresh!",
    });
  };

  const handleCreateNewSpeech = () => {
    setIsNewSpeechDialogOpen(true);
  };

  const handleStartNewSpeech = () => {
    if (!newSpeechTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your speech.",
        variant: "destructive"
      });
      return;
    }
    
    handleClearAll();
    
    setSpeechTitle(newSpeechTitle);
    
    setIsNewSpeechDialogOpen(false);
    
    toast({
      title: "New Speech Created",
      description: `Your speech "${newSpeechTitle}" has been created. Please select a speech type to begin.`,
    });
  };

  const renderQuestionnaire = () => {
    if (!selectedSpeechType || !showQuestionnaire) return null;
    
    const questions = speechQuestions[selectedSpeechType as keyof typeof speechQuestions];
    
    if (!questions) return (
      <div className="text-center py-4">
        <p>Detailed questionnaire not available for this speech type yet.</p>
      </div>
    );
    
    return (
      <div className="border rounded-md p-4 bg-white space-y-6">
        <h3 className="font-semibold text-lg mb-4">
          {speechTypes.find(type => type.value === selectedSpeechType)?.label} Questionnaire
        </h3>
        
        <div className="space-y-6">
          {questions.map((q) => {
            if (q.conditional && questionnaireAnswers[q.conditional.field] !== q.conditional.value) {
              return null;
            }
            
            return (
              <div key={q.id} className="space-y-2">
                <h4 className="font-medium">{q.question}</h4>
                
                {q.type === 'text' && (
                  <Input
                    placeholder={q.placeholder}
                    value={questionnaireAnswers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                )}
                
                {q.type === 'longtext' && (
                  <Textarea
                    placeholder={q.placeholder}
                    value={questionnaireAnswers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="min-h-20"
                  />
                )}
                
                {q.type === 'select' && q.options && (
                  <Select 
                    value={questionnaireAnswers[q.id] || ''} 
                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={q.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {q.type === 'radio' && q.options && (
                  <RadioGroup 
                    value={questionnaireAnswers[q.id] || ''} 
                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                  >
                    {q.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                        <FormLabel htmlFor={`${q.id}-${option.value}`}>{option.label}</FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {q.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={q.id} 
                      checked={questionnaireAnswers[q.id] || false}
                      onCheckedChange={(checked) => handleAnswerChange(q.id, checked)}
                    />
                    <label htmlFor={q.id} className="text-sm font-normal">
                      {q.placeholder}
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end mt-6">
          <ButtonCustom 
            onClick={handleQuestionnaireSubmit}
            disabled={isGeneratingSpeech}
          >
            {isGeneratingSpeech ? (
              <>
                <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                Generating Speech...
              </>
            ) : (
              <>
                Generate Speech
              </>
            )}
          </ButtonCustom>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="space-y-3">
                      <CardTitle>Speech Generator</CardTitle>
                      <CardDescription>
                        {speechTitle ? (
                          <span className="block pt-2 text-base text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-medium">
                            Current speech: {speechTitle}
                          </span>
                        ) : (
                          'Select a speech type and generate a personalized speech'
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <ButtonCustom 
                        onClick={handleCreateNewSpeech} 
                        variant="magenta" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Create A New Speech
                      </ButtonCustom>
                      <ButtonCustom 
                        onClick={handleClearAll} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Clear All
                      </ButtonCustom>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Select Speech Type</label>
                    <Select 
                      value={selectedSpeechType} 
                      onValueChange={handleSpeechTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select speech type" />
                      </SelectTrigger>
                      <SelectContent>
                        {speechTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Tabs defaultValue="chat" onValueChange={setActiveTab} value={activeTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger 
                        value="result" 
                        className={generatedSpeech ? "text-green-600 font-semibold" : ""}
                      >
                        Your Speech Is Ready
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsContent value="chat" className="space-y-4">
                      <div className="h-96 overflow-y-auto border rounded-md p-4 bg-slate-50">
                        {messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`mb-4 ${
                              message.role === 'user' 
                                ? 'flex justify-end' 
                                : 'flex justify-start'
                            }`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg px-4 py-2">
                              <p className="text-sm">Typing...</p>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      {showQuestionnaire && renderQuestionnaire()}
                      
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={isGeneratingSpeech || showQuestionnaire}
                        />
                        <ButtonCustom 
                          onClick={handleSendMessage}
                          disabled={isGeneratingSpeech || !inputMessage.trim() || showQuestionnaire}
                        >
                          <SendIcon className="w-4 h-4" />
                        </ButtonCustom>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="result">
                      <div className="space-y-4">
                        {generatedSpeech ? (
                          <>
                            <div className="border rounded-md p-4 bg-white h-96 overflow-y-auto whitespace-pre-line">
                              {generatedSpeech}
                            </div>
                            <div className="flex justify-end space-x-2">
                              <ButtonCustom 
                                variant="outline" 
                                onClick={handleClearAll}
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Start Over
                              </ButtonCustom>
                              <ButtonCustom 
                                variant="outline"
                                onClick={handleSaveSpeech}
                              >
                                <SaveIcon className="w-4 h-4 mr-2" />
                                Save
                              </ButtonCustom>
                              <ButtonCustom onClick={handleDownloadSpeech}>
                                <DownloadIcon className="w-4 h-4 mr-2" />
                                Download
                              </ButtonCustom>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-96 border rounded-md bg-slate-50">
                            <p className="text-gray-500">
                              {isGeneratingSpeech 
                                ? "Generating your speech..." 
                                : "Generated speech will appear here"}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Speech Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium">
                      <span>Preparation</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Practice your speech multiple times before the event.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Time yourself to ensure you're within the appropriate timeframe.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator className="my-4" />
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium">
                      <span>Delivery</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Speak clearly and at a moderate pace.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Make eye contact with different audience members.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Separator className="my-4" />
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium">
                      <span>Structure</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Start with a strong opening to grab attention.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Include personal stories and anecdotes to engage the audience.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        End with a heartfelt conclusion or toast.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {isSaveDialogOpen && (
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Speech</DialogTitle>
              <DialogDescription>
                Enter a title for your speech to save it to your account.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Speech Title"
              value={speechTitle}
              onChange={(e) => setSpeechTitle(e.target.value)}
            />
            <DialogFooter>
              <ButtonCustom variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                Cancel
              </ButtonCustom>
              <ButtonCustom onClick={confirmSaveSpeech}>
                Save
              </ButtonCustom>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {isNewSpeechDialogOpen && (
        <Dialog open={isNewSpeechDialogOpen} onOpenChange={setIsNewSpeechDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create A New Speech</DialogTitle>
              <DialogDescription>
                Please enter a title for your new speech.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Speech Title"
              value={newSpeechTitle}
              onChange={(e) => setNewSpeechTitle(e.target.value)}
              className="mt-2"
            />
            <DialogFooter className="mt-4">
              <ButtonCustom variant="outline" onClick={() => setIsNewSpeechDialogOpen(false)}>
                Cancel
              </ButtonCustom>
              <ButtonCustom onClick={handleStartNewSpeech}>
                Continue
              </ButtonCustom>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SpeechLab;


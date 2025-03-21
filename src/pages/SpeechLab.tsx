
import { useState, useRef, useEffect } from 'react';
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
  ChevronDownIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Message type definition for the chat
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Speech types
const speechTypes = [
  { value: 'wedding', label: 'Wedding Toast' },
  { value: 'birthday', label: 'Birthday Speech' },
  { value: 'graduation', label: 'Graduation Speech' },
  { value: 'bridesmaid', label: 'Bridesmaid Speech' },
  { value: 'bestman', label: 'Best Man Speech' },
  { value: 'retirement', label: 'Retirement Speech' },
  { value: 'introduction', label: 'Introduction Speech' },
  { value: 'farewell', label: 'Farewell Speech' },
  { value: 'award', label: 'Award Acceptance Speech' },
];

const SpeechLab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('practice');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedSpeechType, setSelectedSpeechType] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [generatedSpeech, setGeneratedSpeech] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial assistant message when chat tab is selected
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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle speech type selection
  const handleSpeechTypeChange = (value: string) => {
    setSelectedSpeechType(value);
    const speechType = speechTypes.find(type => type.value === value)?.label;
    
    // Add assistant message about the selected speech type
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great! I'll help you create a ${speechType}. Let me ask you some questions to personalize it.`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate assistant thinking and asking first question
    setIsTyping(true);
    setTimeout(() => {
      let question = '';
      
      // Different first questions based on speech type
      switch (value) {
        case 'wedding':
          question = "What's your relationship to the couple getting married?";
          break;
        case 'birthday':
          question = "How old is the person celebrating their birthday?";
          break;
        case 'bridesmaid':
          question = "How long have you known the bride?";
          break;
        case 'bestman':
          question = "What's your relationship with the groom?";
          break;
        default:
          question = "Who is the audience for this speech?";
      }
      
      const followUpMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: question,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, followUpMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    
    // Simulate assistant thinking
    setIsTyping(true);
    
    // Intelligent question flow logic
    setTimeout(() => {
      // Get the last 3 messages to create context
      const recentMessages = messages.slice(-3).map(m => m.content);
      let assistantResponse = '';
      
      // Check conversation state and message count to determine flow
      const messageCount = messages.length;
      
      if (messageCount < 4) {
        // Early in conversation - ask about occasion details
        assistantResponse = getNextQuestion(0, selectedSpeechType);
      } else if (messageCount < 7) {
        // Middle of conversation - ask about personal touches
        assistantResponse = getNextQuestion(1, selectedSpeechType);
      } else if (messageCount < 10) {
        // Later in conversation - ask about tone and style
        assistantResponse = getNextQuestion(2, selectedSpeechType);
      } else {
        // Final question before generation
        assistantResponse = "Thanks for all that information! I think I have enough to create your speech. Would you like me to generate it now?";
      }
      
      // Add assistant response
      const newAssistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setIsTyping(false);
      
      // Check if we should offer to generate the speech
      if (messageCount >= 10 && inputMessage.toLowerCase().includes('yes')) {
        handleGenerateSpeech();
      }
    }, 1500);
  };

  // Helper function to get next question based on conversation stage
  const getNextQuestion = (stage: number, speechType: string): string => {
    // Different questions based on speech type and stage
    const questions = {
      wedding: [
        "How long have the couple been together?",
        "Are there any memorable moments or stories you'd like to include?",
        "Would you prefer a humorous or sentimental tone for the speech?"
      ],
      birthday: [
        "What are some of the person's achievements or qualities you'd like to highlight?",
        "Any funny stories or memories you want to include?",
        "Should the speech be more playful or reflective?"
      ],
      bridesmaid: [
        "How did you meet the bride?",
        "What are some qualities you admire about the bride?",
        "Do you have any advice for the couple you'd like to include?"
      ],
      bestman: [
        "How did you meet the groom?",
        "Any funny or memorable stories about your friendship?",
        "What would you like to say about the couple's relationship?"
      ],
      default: [
        "What's the main message you want to convey in this speech?",
        "How long should the speech be approximately?",
        "Any specific points you definitely want to include or avoid?"
      ]
    };
    
    // Return appropriate question or fallback to default
    return questions[speechType as keyof typeof questions]?.[stage] || questions.default[stage];
  };

  // Handle generating speech
  const handleGenerateSpeech = () => {
    setIsGeneratingSpeech(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Example generated speech based on the selected type
      let speechContent = '';
      
      switch (selectedSpeechType) {
        case 'wedding':
          speechContent = "Ladies and gentlemen, family and friends, we are gathered here today to celebrate the union of two extraordinary people. It is my absolute pleasure to stand before you all and raise a toast to this beautiful couple.\n\nI've had the privilege of watching their love story unfold, and what a journey it has been. Through every high and low, they've stood by each other with unwavering support and genuine affection.\n\nWhat makes their relationship so special is not just the love they share, but the friendship that forms its foundation. They make each other laugh, they comfort each other in times of need, and most importantly, they bring out the best in one another.\n\nAs they begin this new chapter together, I want to wish them a lifetime filled with joy, adventure, and growth. May your home always be a place of peace, your relationship a source of strength, and your love a beacon of hope.\n\nPlease join me in raising your glasses to the happy couple. To a marriage filled with love, laughter, and happily ever after!";
          break;
        case 'bridesmaid':
          speechContent = "Hello everyone! For those who don't know me, I'm [Your Name], and I have the honor of being one of the bridesmaids today.\n\nI still remember the day when [Bride's Name] told me about meeting [Groom's Name]. There was something different in her voice, a spark that I hadn't heard before. And standing here today, seeing them together, it's clear that spark has only grown stronger.\n\n[Bride's Name], you've been my friend through thick and thin. Your kindness, your strength, and your ability to find joy in the smallest things are just a few of the qualities that make you so special. And [Groom's Name], thank you for making my friend so incredibly happy. The way you look at her, with such love and admiration, is everything she deserves and more.\n\nTo the newly married couple: May your love continue to grow with each passing day. May you always find reasons to laugh together, to dream together, and to celebrate the beautiful life you're building.\n\nLadies and gentlemen, please raise your glasses to [Bride's Name] and [Groom's Name]. May your marriage be as beautiful as your wedding day and as special as your love for each other. Cheers!";
          break;
        default:
          speechContent = "Distinguished guests, ladies and gentlemen,\n\nIt is my great pleasure to address you all today. As we gather here for this important occasion, I'm reminded of the power of human connection and shared experiences.\n\nIn a world that often moves too quickly, moments like these give us a chance to pause, to reflect, and to appreciate the journey that has brought us to this point. Whether we're celebrating achievements, marking milestones, or simply acknowledging the passage of time, these gatherings remind us of what truly matters.\n\nAs I look around the room, I see faces that represent different chapters of life's story - each with unique perspectives, experiences, and contributions. It is this diversity that enriches our community and strengthens our collective purpose.\n\nIn closing, I want to express my gratitude for the opportunity to share this moment with all of you. May we carry the spirit of today forward in all our future endeavors.\n\nThank you.";
      }
      
      // Add assistant message with the generated speech
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've generated a speech based on your inputs. Here it is:",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setGeneratedSpeech(speechContent);
      setIsGeneratingSpeech(false);
      
      // Success toast
      toast({
        title: "Speech Generated!",
        description: "Your personalized speech is ready to view and download.",
      });
      
    }, 3000);
  };

  // Handle download speech
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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Speech Lab</h1>
          
          <Tabs defaultValue="chat" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="chat">Speech Generator</TabsTrigger>
              <TabsTrigger value="practice">Practice Mode</TabsTrigger>
              <TabsTrigger value="analyze">Analysis Mode</TabsTrigger>
            </TabsList>
            
            {/* New Chat Interface Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>AI Speech Generator</CardTitle>
                  <CardDescription>
                    Create personalized speeches with our AI assistant
                  </CardDescription>
                  
                  {/* Speech Type Selector */}
                  <div className="mt-4">
                    <Select onValueChange={handleSpeechTypeChange} value={selectedSpeechType}>
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
                </CardHeader>
                
                <CardContent>
                  {/* Chat Messages */}
                  <div className="border rounded-md h-[400px] mb-4 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`mb-4 ${message.role === 'assistant' ? 'mr-12' : 'ml-12'}`}
                      >
                        <div 
                          className={`p-3 rounded-lg ${
                            message.role === 'assistant' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          }`}
                        >
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="mr-12 mb-4">
                        <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Reference for auto-scroll */}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Generated Speech Display */}
                  {generatedSpeech && (
                    <div className="border rounded-md p-4 mb-4 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-700">Generated Speech</h3>
                        <ButtonCustom 
                          size="sm" 
                          variant="outline" 
                          onClick={handleDownloadSpeech}
                        >
                          <DownloadIcon className="h-4 w-4 mr-2" /> Download
                        </ButtonCustom>
                      </div>
                      <Textarea 
                        value={generatedSpeech} 
                        readOnly 
                        className="min-h-[200px]" 
                      />
                    </div>
                  )}
                  
                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message here..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={!selectedSpeechType || isGeneratingSpeech}
                    />
                    <ButtonCustom
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || !selectedSpeechType || isGeneratingSpeech}
                    >
                      <SendIcon className="h-4 w-4" />
                    </ButtonCustom>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Practice Mode Tab */}
            <TabsContent value="practice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Your Speech</CardTitle>
                  <CardDescription>
                    Record yourself practicing a speech and get instant feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <MicIcon className="h-16 w-16 mx-auto text-pink-600" />
                    </div>
                    <p className="text-gray-700 mb-6">
                      Press the button below to start recording your speech practice session
                    </p>
                    <ButtonCustom 
                      variant="magenta" 
                      className="w-full md:w-auto"
                    >
                      Start Recording
                    </ButtonCustom>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Recent Practice Sessions</h3>
                    <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Practice Session #1</h4>
                        <p className="text-sm text-gray-500">Recorded 2 days ago - 3:45 minutes</p>
                      </div>
                      <div className="flex gap-2">
                        <ButtonCustom size="sm" variant="outline">
                          <PlayIcon className="h-4 w-4" />
                        </ButtonCustom>
                        <ButtonCustom size="sm" variant="outline">
                          <RefreshCwIcon className="h-4 w-4" />
                        </ButtonCustom>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analysis Mode Tab */}
            <TabsContent value="analyze" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Speech Analysis</CardTitle>
                  <CardDescription>
                    Upload a speech recording to get in-depth analysis and feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="text-gray-700 mb-6">
                      Drag and drop your speech recording here or click to browse files
                    </p>
                    <ButtonCustom variant="magenta" className="w-full md:w-auto">
                      Upload Recording
                    </ButtonCustom>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SpeechLab;

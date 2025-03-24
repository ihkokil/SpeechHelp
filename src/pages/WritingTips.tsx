
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tipsSections = [
  {
    id: "how-to-write",
    title: "How to Write a Great Speech",
    description: "Learn tips and tricks to make your speech stand out and connect with your audience.",
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Know Your Audience</h3>
        <p className="mb-4">Understanding who you're speaking to is the foundation of an effective speech. Research their knowledge level, interests, and expectations.</p>
        
        <h3 className="text-lg font-semibold mb-2">Start Strong</h3>
        <p className="mb-4">Grab attention in the first 30 seconds with a compelling story, surprising statistic, or thought-provoking question.</p>
        
        <h3 className="text-lg font-semibold mb-2">Use Clear, Simple Language</h3>
        <p className="mb-4">Avoid jargon and complex sentences. Aim for clarity and conversational tone that's easy to follow when heard.</p>
        
        <h3 className="text-lg font-semibold mb-2">Include Stories and Examples</h3>
        <p className="mb-4">Concrete examples and personal stories make abstract concepts relatable and memorable.</p>
        
        <h3 className="text-lg font-semibold mb-2">Practice Delivery</h3>
        <p className="mb-4">A great speech on paper needs great delivery. Practice timing, emphasis, and natural pauses to enhance your message.</p>
      </>
    ),
  },
  {
    id: "speech-structure",
    title: "Speech Structure Essentials",
    description: "Understand the key elements of a great speech and organize your ideas effectively.",
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">The Power of Three</h3>
        <p className="mb-4">Organize content into three main points to help audience retention and create a satisfying rhythm.</p>
        
        <h3 className="text-lg font-semibold mb-2">Compelling Introduction</h3>
        <p className="mb-4">State your purpose clearly, establish credibility, and preview main points to orient your audience.</p>
        
        <h3 className="text-lg font-semibold mb-2">Strong Body Content</h3>
        <p className="mb-4">Each main point should have supporting evidence, examples, and transitions that guide listeners from one idea to the next.</p>
        
        <h3 className="text-lg font-semibold mb-2">Effective Conclusion</h3>
        <p className="mb-4">Summarize key points, restate your message in a memorable way, and include a clear call to action.</p>
        
        <h3 className="text-lg font-semibold mb-2">Logical Flow</h3>
        <p className="mb-4">Use signposts and transitions to help your audience follow along and understand how ideas connect.</p>
      </>
    ),
  },
  {
    id: "writers-block-1",
    title: "Overcoming Writer's Block",
    description: "Find techniques to keep the creative flow going and break through writer's block.",
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Free Writing</h3>
        <p className="mb-4">Set a timer for 10 minutes and write continuously without judging or editing. Focus on quantity over quality to generate ideas.</p>
        
        <h3 className="text-lg font-semibold mb-2">Change Your Environment</h3>
        <p className="mb-4">A new location can spark fresh thinking. Try writing in a cafe, park, or different room to break mental patterns.</p>
        
        <h3 className="text-lg font-semibold mb-2">Talk It Out</h3>
        <p className="mb-4">Record yourself explaining your speech ideas as if speaking to a friend. Transcribe the best parts for your draft.</p>
        
        <h3 className="text-lg font-semibold mb-2">Start in the Middle</h3>
        <p className="mb-4">If the introduction is causing a block, begin with a section you're clearer about and circle back later.</p>
        
        <h3 className="text-lg font-semibold mb-2">Take Structured Breaks</h3>
        <p className="mb-4">Step away for 20-30 minutes to refresh your mind, but set a specific time to return to your writing.</p>
      </>
    ),
  },
  {
    id: "engaging-audience",
    title: "Engaging Your Audience",
    description: "Learn techniques to capture and maintain your audience's attention throughout your speech.",
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Ask Rhetorical Questions</h3>
        <p className="mb-4">Engage listeners by prompting them to think about your topic from their personal perspective.</p>
        
        <h3 className="text-lg font-semibold mb-2">Use Multimedia Wisely</h3>
        <p className="mb-4">Visual aids should enhance your message, not distract from it. Keep slides simple and relevant.</p>
        
        <h3 className="text-lg font-semibold mb-2">Incorporate Audience Participation</h3>
        <p className="mb-4">When appropriate, include brief exercises, polls, or moments that invite direct involvement.</p>
        
        <h3 className="text-lg font-semibold mb-2">Vary Your Delivery</h3>
        <p className="mb-4">Change your pace, volume, and tone to emphasize key points and prevent monotony.</p>
        
        <h3 className="text-lg font-semibold mb-2">Use Purposeful Movement</h3>
        <p className="mb-4">Strategic movement on stage can reinforce your message and maintain visual interest.</p>
      </>
    ),
  },
  {
    id: "speech-editing",
    title: "Polishing Your Speech",
    description: "Techniques for editing and refining your speech to make it more impactful and professional.",
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Read Aloud</h3>
        <p className="mb-4">Reading your speech aloud helps identify awkward phrasing, tongue twisters, and pacing issues.</p>
        
        <h3 className="text-lg font-semibold mb-2">Cut Unnecessary Words</h3>
        <p className="mb-4">Aim to reduce your word count by 10-15% in editing. Remove redundancies and simplify complex sentences.</p>
        
        <h3 className="text-lg font-semibold mb-2">Get Feedback</h3>
        <p className="mb-4">Ask trusted colleagues or friends to review your speech and provide specific, constructive feedback.</p>
        
        <h3 className="text-lg font-semibold mb-2">Check for Balance</h3>
        <p className="mb-4">Ensure no section dominates disproportionately. Each key point should receive appropriate emphasis.</p>
        
        <h3 className="text-lg font-semibold mb-2">Review for Clarity</h3>
        <p className="mb-4">Every sentence should serve your overall message. If a listener asks "so what?", you need to make your point clearer.</p>
      </>
    ),
  },
];

const WritingTips = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleClose = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <motion.div 
        className="flex-1 relative bg-gray-50"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="h-full overflow-auto pb-16">
          <div className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Speech Writing Tips</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Resources</h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Accordion type="single" collapsible className="divide-y">
                {tipsSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <div className="border-b border-gray-200">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                          <p className="text-gray-600 mt-1">{section.description}</p>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="px-6 py-4 bg-gray-50">
                      <div className="prose max-w-none">
                        {section.content}
                      </div>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                        Read Article
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="p-6 text-center">
                <button className="text-purple-600 font-medium flex items-center mx-auto hover:text-purple-700 transition-colors">
                  <span className="mr-2">Load more</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="10" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WritingTips;

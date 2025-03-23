
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { ArrowRight, Check, Heart, GraduationCap, Cake, Briefcase, Mic, Flame, Flower, Speaker, Users, Hand, CalendarDays, BookOpen, Megaphone, Music, Armchair, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/translations';
import Translate from '@/components/Translate';

interface Step1Props {
  selectedSpeechType: string;
  setSelectedSpeechType: (type: string) => void;
  nextStep: () => void;
}

const Step1SelectOccasion: React.FC<Step1Props> = ({
  selectedSpeechType,
  setSelectedSpeechType,
  nextStep
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const speechTypes = [
    { 
      id: 'wedding', 
      label: "WEDDING SPEECH",
      description: 'Best Man, Maid of Honor, Father/Mother of the Bride, Groom, Bride',
      image: "/lovable-uploads/33c67c99-8bf4-4acf-8736-21af0686d079.png",
      icon: <Heart className="h-4 w-4" /> 
    },
    { 
      id: 'graduation', 
      label: "GRADUATION SPEECH",
      description: 'Commencement Address, Valedictorian Speech',
      image: "/lovable-uploads/9be03b29-2155-4883-8cab-d839e223604b.png",
      icon: <GraduationCap className="h-4 w-4" />
    },
    { 
      id: 'birthday', 
      label: "BIRTHDAY/ANNIVERSARY SPEECH",
      description: 'Special Occasion Celebrations',
      image: "/lovable-uploads/8a6c2e93-6843-4eb9-8b07-e8456c653de8.png",
      icon: <Cake className="h-4 w-4" />
    },
    { 
      id: 'business', 
      label: "BUSINESS SPEECH",
      description: 'Sales Pitch, Team Meeting, Corporate Training, Product Launch',
      image: "/lovable-uploads/77293a90-2a43-4957-8542-0613049ec390.png",
      icon: <Briefcase className="h-4 w-4" />
    },
    { 
      id: 'tedtalk', 
      label: "TED TALK",
      description: 'Inspirational and Educational Talks',
      image: "/lovable-uploads/e4a82c35-24f4-4a85-bfa6-cdf784a2aeea.png",
      icon: <Mic className="h-4 w-4" />
    },
    { 
      id: 'motivational', 
      label: "MOTIVATIONAL SPEECH",
      description: 'Inspiring and Uplifting Messages',
      image: "/lovable-uploads/fa0501ec-e268-4b60-8823-33cccfc3f9c9.png",
      icon: <Flame className="h-4 w-4" />
    },
    { 
      id: 'funeral', 
      label: "FUNERAL/COMMEMORATIVE SPEECH",
      description: 'Eulogy, Funeral Speech',
      image: "/lovable-uploads/6b579e66-022a-4509-a23a-be31636b6aa7.png",
      icon: <Flower className="h-4 w-4" />
    },
    { 
      id: 'keynote', 
      label: "KEYNOTE ADDRESS",
      description: 'Conference and Event Keynotes',
      image: "/lovable-uploads/003145b7-6fd4-4884-aff4-22d532ef961f.png",
      icon: <Speaker className="h-4 w-4" />
    },
    { 
      id: 'social', 
      label: "SOCIAL SPEECH",
      description: 'After-Dinner Speech, Toast, Roast',
      image: "/lovable-uploads/792f3ee8-f60a-42c3-8537-923c72ec3992.png",
      icon: <Users className="h-4 w-4" />
    },
    { 
      id: 'farewell', 
      label: "FAREWELL SPEECH",
      description: 'Goodbye Messages and Tributes',
      image: "/lovable-uploads/c0a526b7-d971-41ab-afd7-3345ffe18a83.png",
      icon: <Hand className="h-4 w-4" />
    },
    // Adding the 5 missing speech types with descriptions
    { 
      id: 'informative', 
      label: "INFORMATIVE SPEECH",
      description: 'Informative Speech, Demonstrative Speech',
      image: "/lovable-uploads/aeaae355-f442-4199-9e24-7e5be18d5085.png",
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      id: 'persuasive', 
      label: "PERSUASIVE SPEECH",
      description: 'Persuasive Speech, Political Campaign Speech',
      image: "/lovable-uploads/2bc35e53-2bc5-4af1-9a59-637cecc0e333.png",
      icon: <Megaphone className="h-4 w-4" />
    },
    { 
      id: 'entertaining', 
      label: "ENTERTAINING SPEECH",
      description: 'Humorous and Engaging Presentations',
      image: "/lovable-uploads/eb584538-b84a-4ada-82a3-3a65ba072531.png",
      icon: <Music className="h-4 w-4" />
    },
    { 
      id: 'retirement', 
      label: "RETIREMENT SPEECH",
      description: 'Career Celebration and Reflections',
      image: "/lovable-uploads/2759cdfb-30f5-48e6-bbcc-7076095f6195.png",
      icon: <Armchair className="h-4 w-4" />
    },
    { 
      id: 'award', 
      label: "AWARD CEREMONY SPEECH",
      description: 'Award Presentation Speech, Award Acceptance Speech',
      image: "/lovable-uploads/0ccb56bd-8358-4d39-bd27-1a676faf9ba6.png",
      icon: <Award className="h-4 w-4" />
    },
    { 
      id: 'other', 
      label: "OTHER SPEECH/SPECIAL EVENT",
      description: 'For Any Unique Occasion',
      image: "/lovable-uploads/02964ef1-c71e-43a1-bad8-ccb04d9c5080.png",
      icon: <CalendarDays className="h-4 w-4" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle><Translate text="speechLab.occasionTitle" /></CardTitle>
        <CardDescription><Translate text="speechLab.occasionDesc" /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {speechTypes.map((type) => (
            <div 
              key={type.id}
              onClick={() => setSelectedSpeechType(type.id)}
              className={`group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 h-48 ${
                selectedSpeechType === type.id ? 'ring-4 ring-pink-500 ring-offset-2' : 'hover:shadow-lg'
              }`}
            >
              <img 
                src={type.image} 
                alt={type.label} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70"></div>
              <div className={`absolute top-3 right-3 rounded-full p-1.5 text-white ${
                selectedSpeechType === type.id ? 'bg-pink-600' : 'bg-purple-600'
              }`}>
                {type.icon}
              </div>
              {selectedSpeechType === type.id && (
                <div className="absolute top-3 left-3 bg-pink-600 rounded-full p-1.5 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-3">
                <h3 className="text-white text-sm font-medium">{type.label}</h3>
                {type.description && (
                  <p className="text-white/70 text-xs mt-1">{type.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <ButtonCustom onClick={nextStep} variant="magenta" disabled={!selectedSpeechType}>
          <Translate text="speechLab.nextButton" />
          <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonCustom>
      </CardFooter>
    </Card>
  );
};

export default Step1SelectOccasion;

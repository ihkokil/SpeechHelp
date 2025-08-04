
// Helper functions for speech type display

export const getSpeechTypeLabel = (type: string): string => {
  switch (type) {
    case 'presentation': return 'Presentation';
    case 'meeting': return 'Meeting';
    case 'interview': return 'Interview';
    case 'speech': return 'Speech';
    case 'wedding': return 'Wedding';
    case 'birthday': return 'Birthday';
    case 'graduation': return 'Graduation';
    case 'retirement': return 'Retirement';
    case 'award': return 'Award';
    case 'funeral': return 'Funeral';
    case 'social': return 'Social';
    case 'business': return 'Business';
    case 'entertaining': return 'Entertaining';
    case 'persuasive': return 'Persuasive';
    case 'motivational': return 'Motivational';
    case 'informative': return 'Informative';
    case 'tedtalk': return 'TED Talk';  // Updated from 'Tedtalk' to 'TED Talk'
    case 'keynote': return 'Keynote';
    case 'upcoming': return 'Upcoming';
    case 'farewell': return 'Farewell';
    case 'other': return 'Other';
    default: return type.charAt(0).toUpperCase() + type.slice(1);  // Capitalize first letter for any other types
  };
};

export const getTypeColor = (type: string): string => {
  // Base classes with consistent min-width - explicitly remove hover effects
  const baseClasses = 'min-w-[100px] text-center inline-flex justify-center hover:bg-current hover:text-current pointer-events-none';
  
  switch (type) {
    case 'presentation': return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'meeting': return `${baseClasses} bg-green-100 text-green-700`;
    case 'interview': return `${baseClasses} bg-purple-100 text-purple-700`;
    case 'speech': return `${baseClasses} bg-amber-100 text-amber-700`;
    case 'wedding': return `${baseClasses} bg-pink-100 text-pink-700`;
    case 'birthday': return `${baseClasses} bg-yellow-100 text-yellow-700`;
    case 'graduation': return `${baseClasses} bg-indigo-100 text-indigo-700`;
    case 'retirement': return `${baseClasses} bg-orange-100 text-orange-700`;
    case 'award': return `${baseClasses} bg-emerald-100 text-emerald-700`;
    case 'funeral': return `${baseClasses} bg-slate-100 text-slate-700`;
    case 'social': return `${baseClasses} bg-rose-100 text-rose-700`;
    case 'business': return `${baseClasses} bg-sky-100 text-sky-700`;
    case 'entertaining': return `${baseClasses} bg-violet-100 text-violet-700`;
    case 'persuasive': return `${baseClasses} bg-teal-100 text-teal-700`;
    case 'motivational': return `${baseClasses} bg-lime-100 text-lime-700`;
    case 'informative': return `${baseClasses} bg-cyan-100 text-cyan-700`;
    case 'tedtalk': return `${baseClasses} bg-red-100 text-red-700`;
    case 'keynote': return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'farewell': return `${baseClasses} bg-amber-100 text-amber-700`;
    case 'upcoming': return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'other': return `${baseClasses} bg-gray-100 text-gray-700`;
    default: return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};


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
    case 'tedtalk': return 'TED Talk';
    case 'keynote': return 'Keynote';
    case 'upcoming': return 'Upcoming';
    default: return 'Other';
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'presentation': return 'bg-blue-100 text-blue-700';
    case 'meeting': return 'bg-green-100 text-green-700';
    case 'interview': return 'bg-purple-100 text-purple-700';
    case 'speech': return 'bg-amber-100 text-amber-700';
    case 'wedding': return 'bg-pink-100 text-pink-700';
    case 'birthday': return 'bg-yellow-100 text-yellow-700';
    case 'graduation': return 'bg-indigo-100 text-indigo-700';
    case 'retirement': return 'bg-orange-100 text-orange-700';
    case 'award': return 'bg-emerald-100 text-emerald-700';
    case 'funeral': return 'bg-slate-100 text-slate-700';
    case 'social': return 'bg-rose-100 text-rose-700';
    case 'business': return 'bg-sky-100 text-sky-700';
    case 'entertaining': return 'bg-violet-100 text-violet-700';
    case 'persuasive': return 'bg-teal-100 text-teal-700';
    case 'motivational': return 'bg-lime-100 text-lime-700';
    case 'informative': return 'bg-cyan-100 text-cyan-700';
    case 'tedtalk': return 'bg-red-100 text-red-700';
    case 'keynote': return 'bg-blue-100 text-blue-700';
    case 'upcoming': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

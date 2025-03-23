
export const generateSpeechContent = (
  selectedSpeechType: string,
  formData: Record<string, string>,
  speechTypes: { id: string; label: string }[]
): { content: string; title?: string } => {
  const speechType = speechTypes.find(type => type.id === selectedSpeechType)?.label || '';
  const speaker = formData["Who are you in relation to the wedding?"] || 
                formData["Your role in the event?"] || 
                formData["Your name and relationship to the celebrant?"] ||
                formData["Your name, title, and company?"] ||
                "the speaker";
  
  const name = formData["What is your name?"] || "";
  const relationship = formData["What is your relationship to the couple?"] || 
                      formData["Your relationship to the retiree?"] || 
                      formData["Your relationship to the celebrant?"] || "";
  
  const introduction = name ? 
    `Good evening, my name is ${name}${relationship ? `, ${relationship}` : ""}.` : 
    "Good evening, everyone.";
  
  let speech = `${introduction}\n\n`;
  
  switch (selectedSpeechType) {
    case 'wedding':
      speech += `I am honored to stand before you today as ${speaker} to celebrate the union of this wonderful couple.\n\n`;
      if (formData["Share a memorable story about the couple."]) {
        speech += `I'd like to share a special memory: ${formData["Share a memorable story about the couple."]}\n\n`;
      }
      if (formData["Qualities you admire about the bride/groom."]) {
        speech += `What I admire most about them is ${formData["Qualities you admire about the bride/groom."]}\n\n`;
      }
      speech += "I wish you both a lifetime of love, joy, and happiness. Congratulations!\n\n";
      if (formData["End with a toast?"]) {
        speech += `So let's raise our glasses: ${formData["End with a toast?"]}\n`;
      } else {
        speech += "So let's raise our glasses to the newlyweds! To love, laughter, and happily ever after!";
      }
      break;
      
    case 'graduation':
      speech += `It's a privilege to address you today at this significant milestone.\n\n`;
      if (formData["Key message or theme?"]) {
        speech += `Today, I want to focus on ${formData["Key message or theme?"]}\n\n`;
      }
      if (formData["Share a personal story or experience."]) {
        speech += `${formData["Share a personal story or experience."]}\n\n`;
      }
      speech += "As you move forward from here, remember that this is not the end, but the beginning of a new chapter.\n\n";
      if (formData["Is there a call to action or advice?"]) {
        speech += `My advice to you is: ${formData["Is there a call to action or advice?"]}\n\n`;
      }
      speech += "Congratulations, graduates! The world awaits your contributions.";
      break;
      
    default:
      speech += `I'm delighted to speak to you today.\n\n`;
      
      const storyKey = Object.keys(formData).find(key => key.toLowerCase().includes("story") || key.toLowerCase().includes("experience"));
      if (storyKey && formData[storyKey]) {
        speech += `${formData[storyKey]}\n\n`;
      }
      
      const qualitiesKey = Object.keys(formData).find(key => key.toLowerCase().includes("qualities") || key.toLowerCase().includes("achievements"));
      if (qualitiesKey && formData[qualitiesKey]) {
        speech += `${formData[qualitiesKey]}\n\n`;
      }
      
      speech += "Thank you for your attention and time today.";
  }
  
  return { content: speech };
};

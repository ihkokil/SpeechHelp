
export const createPlaceholderSpeech = (title: string, speechDetails: Record<string, string> = {}) => {
  const detailsArray = Object.entries(speechDetails || {});
  
  if (detailsArray.length === 0) {
    return "This is your generated speech. You can edit it here to customize it to your needs.";
  }
  
  let speech = `# ${title}\n\n`;
  speech += "## Your Speech Details\n\n";
  
  detailsArray.forEach(([question, answer]) => {
    if (answer && answer.trim()) {
      speech += `**${question}**\n${answer}\n\n`;
    }
  });
  
  speech += "\n---\n\nEdit this speech to your liking before saving.";
  return speech;
};

export const downloadSpeech = (content: string, title: string, toast: any) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.trim() || 'speech'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  toast({
    title: "Download Started",
    description: "Your speech is being downloaded as a text file.",
  });
};

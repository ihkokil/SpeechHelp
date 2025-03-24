
// Types for questionnaire items
export interface QuestionnaireItem {
  question: string;
  type: 'text' | 'textarea' | 'radio';
  options?: string[];
  placeholder?: string;
}

// Map of speech types to their respective questionnaires
export const speechQuestionnaires: Record<string, QuestionnaireItem[]> = {
  wedding: [
    { 
      question: "Who are you in relation to the wedding?", 
      type: "radio", 
      options: ["Best Man", "Maid of Honor", "Father of the Bride", "Mother of the Bride", "Groom", "Bride", "Other"] 
    },
    { 
      question: "What is your name?", 
      type: "text", 
      placeholder: "E.g., John Smith" 
    },
    { 
      question: "What is your relationship to the couple?", 
      type: "text", 
      placeholder: "E.g., Bride's Brother, Groom's Childhood Friend" 
    },
    { 
      question: "How long should the speech be?", 
      type: "text", 
      placeholder: "E.g., 3-5 minutes" 
    },
    { 
      question: "Preferred tone of the speech?", 
      type: "radio", 
      options: ["Humorous", "Sentimental", "Formal", "Casual", "Mix of humor and sentiment"] 
    },
    { 
      question: "Share a memorable story about the couple.", 
      type: "textarea", 
      placeholder: "Describe a meaningful or funny experience..." 
    },
    { 
      question: "Qualities you admire about the bride/groom.", 
      type: "textarea", 
      placeholder: "E.g., kindness, humor, dedication..." 
    },
    { 
      question: "Is there a theme or message you want to convey?", 
      type: "textarea", 
      placeholder: "E.g., growth together, overcoming challenges..." 
    },
    { 
      question: "Include cultural or religious references?", 
      type: "textarea", 
      placeholder: "Specify if applicable, or leave blank" 
    },
    { 
      question: "Any inside jokes or personal anecdotes?", 
      type: "textarea", 
      placeholder: "Share any memorable moments or stories..." 
    },
    { 
      question: "End with a toast?", 
      type: "textarea", 
      placeholder: "Provide details or we'll suggest one" 
    },
    { 
      question: "Anything else to include or avoid?", 
      type: "textarea", 
      placeholder: "Any specific mentions or topics to avoid..." 
    }
  ],
  graduation: [
    { 
      question: "Who are you addressing?", 
      type: "text", 
      placeholder: "E.g., Graduates, Faculty, Parents" 
    },
    { 
      question: "Your role in the event?", 
      type: "radio", 
      options: ["Valedictorian", "Guest Speaker", "Faculty Member", "Administrator", "Other"] 
    },
    { 
      question: "Your name and title/position?", 
      type: "text", 
      placeholder: "E.g., Dr. Jane Smith, Department Chair" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 5-7 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Inspirational", "Reflective", "Challenging", "Celebratory", "Formal"] 
    },
    { 
      question: "Key message or theme?", 
      type: "textarea", 
      placeholder: "E.g., embracing change, perseverance..." 
    },
    { 
      question: "Share a personal story or experience.", 
      type: "textarea", 
      placeholder: "Describe a relevant experience..." 
    },
    { 
      question: "Include a famous quote or saying?", 
      type: "textarea", 
      placeholder: "Specify or we'll suggest one" 
    },
    { 
      question: "Specific achievements or milestones to mention?", 
      type: "textarea", 
      placeholder: "E.g., class achievements, special awards..." 
    },
    { 
      question: "Is there a call to action or advice?", 
      type: "textarea", 
      placeholder: "What do you want graduates to do or remember?" 
    },
    { 
      question: "Closing remarks or statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  birthday: [
    { 
      question: "Who is the celebration for?", 
      type: "text", 
      placeholder: "E.g., Friend, Parent, Child" 
    },
    { 
      question: "Your name and relationship to the celebrant?", 
      type: "text", 
      placeholder: "E.g., Sarah, Sister of the birthday person" 
    },
    { 
      question: "Which birthday or anniversary is being celebrated?", 
      type: "text", 
      placeholder: "E.g., 40th Birthday, 25th Anniversary" 
    },
    { 
      question: "Speech length preference?", 
      type: "text", 
      placeholder: "E.g., 2-3 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Lighthearted", "Heartfelt", "Humorous", "Nostalgic", "Celebratory"] 
    },
    { 
      question: "Share a memorable moment with the celebrant.", 
      type: "textarea", 
      placeholder: "Describe a meaningful experience..." 
    },
    { 
      question: "Qualities or achievements to highlight?", 
      type: "textarea", 
      placeholder: "What makes this person special?" 
    },
    { 
      question: "Include a humorous or sentimental story?", 
      type: "textarea", 
      placeholder: "Share a specific story or memory..." 
    },
    { 
      question: "Any specific wishes or toast to include?", 
      type: "textarea", 
      placeholder: "What wishes do you have for them?" 
    },
    { 
      question: "Anything to avoid mentioning?", 
      type: "textarea", 
      placeholder: "Any sensitive topics or issues?" 
    }
  ],
  business: [
    { 
      question: "Purpose of the speech?", 
      type: "radio", 
      options: ["Product Launch", "Team Meeting", "Corporate Training", "Sales Pitch", "Company Announcement"] 
    },
    { 
      question: "Your name, title, and company?", 
      type: "text", 
      placeholder: "E.g., John Davis, Marketing Director at XYZ Corp" 
    },
    { 
      question: "Audience type and size?", 
      type: "text", 
      placeholder: "E.g., 50 clients, Executive team of 8" 
    },
    { 
      question: "Desired speech length?", 
      type: "text", 
      placeholder: "E.g., 10 minutes" 
    },
    { 
      question: "Speech tone?", 
      type: "radio", 
      options: ["Motivational", "Informative", "Persuasive", "Professional", "Conversational"] 
    },
    { 
      question: "Key message or objective?", 
      type: "textarea", 
      placeholder: "What's the main point you want to convey?" 
    },
    { 
      question: "Include industry-specific terms or data?", 
      type: "textarea", 
      placeholder: "Any technical information to include?" 
    },
    { 
      question: "Any success stories or case studies to mention?", 
      type: "textarea", 
      placeholder: "Share relevant examples..." 
    },
    { 
      question: "Is there a call to action?", 
      type: "textarea", 
      placeholder: "What do you want your audience to do?" 
    },
    { 
      question: "Closing remarks?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  tedtalk: [
    { 
      question: "Your name and relevant background?", 
      type: "text", 
      placeholder: "E.g., Dr. Sarah Jones, Marine Biologist" 
    },
    { 
      question: "What is the main idea or topic?", 
      type: "textarea", 
      placeholder: "Summarize your talk's focus..." 
    },
    { 
      question: "Audience type and size?", 
      type: "text", 
      placeholder: "E.g., General public, 300 attendees" 
    },
    { 
      question: "Desired length of the talk?", 
      type: "text", 
      placeholder: "E.g., 15 minutes" 
    },
    { 
      question: "Tone of the talk?", 
      type: "radio", 
      options: ["Engaging", "Thought-Provoking", "Storytelling", "Educational", "Conversational"] 
    },
    { 
      question: "Share a personal story or experience.", 
      type: "textarea", 
      placeholder: "Describe a relevant experience..." 
    },
    { 
      question: "Include relevant data or research?", 
      type: "textarea", 
      placeholder: "Any statistics or findings to share?" 
    },
    { 
      question: "Key message or takeaway?", 
      type: "textarea", 
      placeholder: "What should the audience remember?" 
    },
    { 
      question: "Any visual aids to reference?", 
      type: "textarea", 
      placeholder: "Describe slides or props if applicable" 
    },
    { 
      question: "Ending or closing statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  motivational: [
    { 
      question: "Your name and why you're speaking?", 
      type: "text", 
      placeholder: "E.g., Michael Chen, Entrepreneur and Coach" 
    },
    { 
      question: "Who is the audience?", 
      type: "text", 
      placeholder: "E.g., Students, Athletes, Sales Team" 
    },
    { 
      question: "Speech duration preference?", 
      type: "text", 
      placeholder: "E.g., 20 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Energizing", "Encouraging", "Powerful", "Inspirational", "Empowering"] 
    },
    { 
      question: "Share an inspiring story or example.", 
      type: "textarea", 
      placeholder: "Describe a motivational experience..." 
    },
    { 
      question: "Key message or theme?", 
      type: "textarea", 
      placeholder: "E.g., overcoming obstacles, finding purpose..." 
    },
    { 
      question: "Include motivational quotes or anecdotes?", 
      type: "textarea", 
      placeholder: "Any specific quotes or stories to include?" 
    },
    { 
      question: "Any challenges or obstacles to address?", 
      type: "textarea", 
      placeholder: "What difficulties might the audience face?" 
    },
    { 
      question: "Call to action or advice?", 
      type: "textarea", 
      placeholder: "What do you want the audience to do?" 
    },
    { 
      question: "Closing remarks?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  funeral: [
    { 
      question: "Your name and relationship to the deceased?", 
      type: "text", 
      placeholder: "E.g., James Wilson, Nephew" 
    },
    { 
      question: "Who is the speech for?", 
      type: "text", 
      placeholder: "Name and relation of the deceased" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 5 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Reflective", "Respectful", "Celebratory of Life", "Solemn", "Hopeful"] 
    },
    { 
      question: "Share a cherished memory or story.", 
      type: "textarea", 
      placeholder: "Describe a meaningful experience..." 
    },
    { 
      question: "Qualities or achievements to highlight.", 
      type: "textarea", 
      placeholder: "What made this person special?" 
    },
    { 
      question: "Include specific cultural or religious elements?", 
      type: "textarea", 
      placeholder: "Any traditions or prayers to include?" 
    },
    { 
      question: "Any messages or prayers to convey?", 
      type: "textarea", 
      placeholder: "Special words, quotes, or readings?" 
    },
    { 
      question: "Closing words or sentiments?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  keynote: [
    { 
      question: "Your name, title, and organization?", 
      type: "text", 
      placeholder: "E.g., Dr. Robert Lee, CEO of Future Tech" 
    },
    { 
      question: "What is the event or conference?", 
      type: "text", 
      placeholder: "E.g., Annual Industry Summit, Tech Conference" 
    },
    { 
      question: "Audience type and size?", 
      type: "text", 
      placeholder: "E.g., 500 industry professionals" 
    },
    { 
      question: "Desired length of the address?", 
      type: "text", 
      placeholder: "E.g., 30 minutes" 
    },
    { 
      question: "Tone of the address?", 
      type: "radio", 
      options: ["Inspirational", "Educational", "Visionary", "Strategic", "Authoritative"] 
    },
    { 
      question: "Main topic or theme?", 
      type: "textarea", 
      placeholder: "What's the central focus of your address?" 
    },
    { 
      question: "Include industry trends or insights?", 
      type: "textarea", 
      placeholder: "Any specific developments to highlight?" 
    },
    { 
      question: "Key message or takeaway?", 
      type: "textarea", 
      placeholder: "What should the audience remember?" 
    },
    { 
      question: "Any specific challenges or opportunities to address?", 
      type: "textarea", 
      placeholder: "What issues are important to discuss?" 
    },
    { 
      question: "Closing statement or call to action?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  social: [
    { 
      question: "Your name and relation to the event?", 
      type: "text", 
      placeholder: "E.g., Lisa Johnson, Host of the Dinner" 
    },
    { 
      question: "Who is the audience?", 
      type: "text", 
      placeholder: "E.g., Dinner Guests, Friends at a Gathering" 
    },
    { 
      question: "Speech type?", 
      type: "radio", 
      options: ["Toast", "Roast", "Welcome Address", "Thank You Speech", "Casual Remarks"] 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 2 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Humorous", "Lighthearted", "Warm", "Appreciative", "Playful"] 
    },
    { 
      question: "Share a funny or memorable story.", 
      type: "textarea", 
      placeholder: "Describe an amusing or relevant moment..." 
    },
    { 
      question: "Any specific anecdotes or jokes to include?", 
      type: "textarea", 
      placeholder: "Share any entertaining moments..." 
    },
    { 
      question: "Is there a message or theme?", 
      type: "textarea", 
      placeholder: "Any central point to convey?" 
    },
    { 
      question: "Closing remarks or toast?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  farewell: [
    { 
      question: "Your name and position?", 
      type: "text", 
      placeholder: "E.g., Emma Davis, Team Leader" 
    },
    { 
      question: "Who is the audience?", 
      type: "text", 
      placeholder: "E.g., Colleagues, Classmates, Friends" 
    },
    { 
      question: "Your role or relationship to the audience?", 
      type: "text", 
      placeholder: "E.g., Departing Manager, Graduating Student" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 5 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Nostalgic", "Grateful", "Hopeful", "Reflective", "Upbeat"] 
    },
    { 
      question: "Share a meaningful experience or memory.", 
      type: "textarea", 
      placeholder: "Describe a significant moment..." 
    },
    { 
      question: "Qualities or achievements to highlight?", 
      type: "textarea", 
      placeholder: "What would you like to recognize?" 
    },
    { 
      question: "Any specific thank yous or acknowledgments?", 
      type: "textarea", 
      placeholder: "Who would you like to mention?" 
    },
    { 
      question: "Is there a message or theme?", 
      type: "textarea", 
      placeholder: "Any central point to convey?" 
    },
    { 
      question: "Closing words or farewell statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  informative: [
    { 
      question: "Your name and credentials?", 
      type: "text", 
      placeholder: "E.g., Professor Alex Wang, PhD in Economics" 
    },
    { 
      question: "What is the topic or subject?", 
      type: "textarea", 
      placeholder: "What will you be explaining or teaching about?" 
    },
    { 
      question: "Audience type and size?", 
      type: "text", 
      placeholder: "E.g., 100 college students, Community group" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 15 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Educational", "Engaging", "Clear", "Authoritative", "Conversational"] 
    },
    { 
      question: "Include specific data or research?", 
      type: "textarea", 
      placeholder: "Any statistics or findings to share?" 
    },
    { 
      question: "Key message or takeaway?", 
      type: "textarea", 
      placeholder: "What should the audience learn?" 
    },
    { 
      question: "Any visuals or demonstrations to reference?", 
      type: "textarea", 
      placeholder: "Describe any visual aids if applicable" 
    },
    { 
      question: "Closing summary or statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  persuasive: [
    { 
      question: "Your name and relevant background?", 
      type: "text", 
      placeholder: "E.g., Maria Garcia, Environmental Activist" 
    },
    { 
      question: "What is the topic or issue?", 
      type: "textarea", 
      placeholder: "What are you advocating for or against?" 
    },
    { 
      question: "Audience type and size?", 
      type: "text", 
      placeholder: "E.g., City Council, Voter Group of 200" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 10 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Convincing", "Passionate", "Logical", "Urgent", "Balanced"] 
    },
    { 
      question: "Main argument or point of view?", 
      type: "textarea", 
      placeholder: "What position are you taking?" 
    },
    { 
      question: "Include data or evidence to support your argument?", 
      type: "textarea", 
      placeholder: "Any facts or research to include?" 
    },
    { 
      question: "Any counterarguments to address?", 
      type: "textarea", 
      placeholder: "What opposing views will you respond to?" 
    },
    { 
      question: "Is there a call to action?", 
      type: "textarea", 
      placeholder: "What do you want your audience to do?" 
    },
    { 
      question: "Closing persuasive statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  entertaining: [
    { 
      question: "Your name and role at the event?", 
      type: "text", 
      placeholder: "E.g., Sam Brown, Guest Speaker" 
    },
    { 
      question: "Who is the audience?", 
      type: "text", 
      placeholder: "E.g., Party Guests, Event Attendees" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 5 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Fun", "Amusing", "Witty", "Lighthearted", "Engaging"] 
    },
    { 
      question: "Share a funny or engaging story.", 
      type: "textarea", 
      placeholder: "Describe an entertaining experience..." 
    },
    { 
      question: "Any specific jokes or anecdotes to include?", 
      type: "textarea", 
      placeholder: "Share any humorous content..." 
    },
    { 
      question: "Is there a theme or message?", 
      type: "textarea", 
      placeholder: "Any central point amid the entertainment?" 
    },
    { 
      question: "Closing remarks or humorous ending?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  retirement: [
    { 
      question: "Your name and relationship to the event?", 
      type: "text", 
      placeholder: "E.g., David Miller, Colleague of 15 years" 
    },
    { 
      question: "Who is retiring?", 
      type: "text", 
      placeholder: "Name and position of retiree" 
    },
    { 
      question: "Your relationship to the retiree?", 
      type: "text", 
      placeholder: "E.g., Supervisor, Colleague, Friend" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 5 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Grateful", "Reflective", "Celebratory", "Humorous", "Admiring"] 
    },
    { 
      question: "Share a memorable experience or story.", 
      type: "textarea", 
      placeholder: "Describe a significant moment..." 
    },
    { 
      question: "Qualities or achievements to highlight?", 
      type: "textarea", 
      placeholder: "What contributions or strengths to recognize?" 
    },
    { 
      question: "Any specific thank yous or acknowledgments?", 
      type: "textarea", 
      placeholder: "Who or what should be acknowledged?" 
    },
    { 
      question: "Is there a message or theme?", 
      type: "textarea", 
      placeholder: "Any central point to convey?" 
    },
    { 
      question: "Closing words or farewell statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  award: [
    { 
      question: "Your name and role in the ceremony?", 
      type: "text", 
      placeholder: "E.g., Jennifer Kim, Award Committee Chair" 
    },
    { 
      question: "What is the award?", 
      type: "text", 
      placeholder: "E.g., Employee of the Year, Achievement Award" 
    },
    { 
      question: "Are you presenting or accepting the award?", 
      type: "radio", 
      options: ["Presenting the award", "Accepting the award"] 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 3 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Celebratory", "Gracious", "Formal", "Appreciative", "Inspiring"] 
    },
    { 
      question: "Key achievements or qualifications to highlight?", 
      type: "textarea", 
      placeholder: "What merits or contributions to mention?" 
    },
    { 
      question: "Any specific thank yous or acknowledgments?", 
      type: "textarea", 
      placeholder: "Who would you like to recognize?" 
    },
    { 
      question: "Is there a message or theme?", 
      type: "textarea", 
      placeholder: "Any central point to convey?" 
    },
    { 
      question: "Closing remarks or acceptance statement?", 
      type: "textarea", 
      placeholder: "How would you like to conclude?" 
    }
  ],
  other: [
    { 
      question: "Your name and role at the event?", 
      type: "text", 
      placeholder: "E.g., Taylor Wilson, Host" 
    },
    { 
      question: "What is the event or occasion?", 
      type: "text", 
      placeholder: "Describe the specific occasion" 
    },
    { 
      question: "Who is the audience?", 
      type: "text", 
      placeholder: "E.g., Family Members, Community Group" 
    },
    { 
      question: "Desired length of the speech?", 
      type: "text", 
      placeholder: "E.g., 5 minutes" 
    },
    { 
      question: "Tone of the speech?", 
      type: "radio", 
      options: ["Formal", "Casual", "Enthusiastic", "Serious", "Mixed"] 
    },
    { 
      question: "Main topic or message?", 
      type: "textarea", 
      placeholder: "What's the primary focus?" 
    },
    { 
      question: "Include specific stories or anecdotes?", 
      type: "textarea", 
      placeholder: "Any relevant experiences to share?" 
    },
    { 
      question: "Is there a theme or takeaway?", 
      type: "textarea", 
      placeholder: "What should the audience remember?" 
    },
    { 
      question: "Closing remarks or conclusion?", 
      type: "textarea", 
      placeholder: "How would you like to end your speech?" 
    }
  ]
};

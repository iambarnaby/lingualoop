export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  usedInStories: string[];
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  vocabUsed: string[];
  createdAt: string;
}

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GeneratedStory {
  title: string;
  content: string;
  vocabUsed: string[];
}

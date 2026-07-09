'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { VocabWord, Story, Phrase, ChatMessage } from '@/types';

interface LanguageData {
  vocabWords: VocabWord[];
  stories: Story[];
  phrases: Phrase[];
  chatMessages: ChatMessage[];
}

const emptyLangData = (): LanguageData => ({
  vocabWords: [],
  stories: [],
  phrases: [],
  chatMessages: [],
});

interface LinguaStore {
  // Per-language backing store
  languageData: Record<string, LanguageData>;

  // Active language's flat data (components read these)
  vocabWords: VocabWord[];
  stories: Story[];
  phrases: Phrase[];
  chatMessages: ChatMessage[];

  addVocabWord: (word: string, translation: string) => void;
  removeVocabWord: (id: string) => void;

  addStory: (title: string, content: string, vocabUsed: string[]) => void;
  removeStory: (id: string) => void;

  addPhrase: (phrase: string, translation: string, category: string) => void;
  removePhrase: (id: string) => void;

  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;

  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useStore = create<LinguaStore>()(
  persist(
    (set) => ({
      languageData: {},
      vocabWords: [],
      stories: [],
      phrases: [],
      chatMessages: [],
      targetLanguage: '',
      theme: 'light',
      _hasHydrated: false,

      setHasHydrated: (v) =>
        set((s) => {
          if (v && s.targetLanguage) {
            // On hydration, sync flat data (authoritative) back into languageData
            return {
              _hasHydrated: true,
              languageData: {
                ...s.languageData,
                [s.targetLanguage]: {
                  vocabWords: s.vocabWords,
                  stories: s.stories,
                  phrases: s.phrases,
                  chatMessages: s.chatMessages,
                },
              },
            };
          }
          return { _hasHydrated: v };
        }),

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      setTargetLanguage: (lang) =>
        set((s) => {
          const updatedData = { ...s.languageData };

          // Save current flat data into outgoing language slot
          if (s.targetLanguage) {
            updatedData[s.targetLanguage] = {
              vocabWords: s.vocabWords,
              stories: s.stories,
              phrases: s.phrases,
              chatMessages: s.chatMessages,
            };
          }

          // Load incoming language data
          const incoming = updatedData[lang] || emptyLangData();

          return {
            targetLanguage: lang,
            languageData: updatedData,
            vocabWords: incoming.vocabWords,
            stories: incoming.stories,
            phrases: incoming.phrases,
            chatMessages: incoming.chatMessages,
          };
        }),

      addVocabWord: (word, translation) =>
        set((s) => ({
          vocabWords: [
            ...s.vocabWords,
            { id: nanoid(), word, translation, usedInStories: [], createdAt: new Date().toISOString() },
          ],
        })),

      removeVocabWord: (id) =>
        set((s) => ({ vocabWords: s.vocabWords.filter((w) => w.id !== id) })),

      addStory: (title, content, vocabUsed) => {
        const storyId = nanoid();
        set((s) => ({
          stories: [
            { id: storyId, title, content, vocabUsed, createdAt: new Date().toISOString() },
            ...s.stories,
          ],
          vocabWords: s.vocabWords.map((w) =>
            vocabUsed.includes(w.id)
              ? { ...w, usedInStories: [...new Set([...w.usedInStories, storyId])] }
              : w
          ),
        }));
      },

      removeStory: (id) =>
        set((s) => ({ stories: s.stories.filter((st) => st.id !== id) })),

      addPhrase: (phrase, translation, category) =>
        set((s) => ({
          phrases: [...s.phrases, { id: nanoid(), phrase, translation, category }],
        })),

      removePhrase: (id) =>
        set((s) => ({ phrases: s.phrases.filter((p) => p.id !== id) })),

      addChatMessage: (role, content) =>
        set((s) => ({
          chatMessages: [
            ...s.chatMessages,
            { id: nanoid(), role, content, timestamp: new Date().toISOString() },
          ],
        })),

      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: 'lingualoop-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

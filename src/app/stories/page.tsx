'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Trash2, Calendar, Hash } from 'lucide-react';

export default function StoriesPage() {
  const { stories, vocabWords, removeStory, _hasHydrated } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!_hasHydrated) {
    return <div className="p-8 text-text-muted pulse-gentle">Loading...</div>;
  }

  const getVocabForStory = (vocabIds: string[]) =>
    vocabWords.filter((w) => vocabIds.includes(w.id));

  return (
    <div className="p-8 lg:p-12 max-w-5xl page-enter">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Stories</h1>
        <p className="text-text-secondary">
          {stories.length === 0
            ? 'Your saved TPRS stories will appear here.'
            : `${stories.length} ${stories.length === 1 ? 'story' : 'stories'} in your library`}
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <BookOpen size={40} className="text-text-muted mx-auto mb-4 opacity-40" />
          <p className="text-text-secondary font-medium mb-1">No stories saved</p>
          <p className="text-text-muted text-sm">
            Generate stories from your vocabulary to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((story, i) => {
            const storyVocab = getVocabForStory(story.vocabUsed);
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-card border border-border rounded-2xl overflow-hidden card-glow cursor-pointer"
                onClick={() => setExpandedId(story.id)}
              >
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold mb-2">{story.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-3 font-reading leading-relaxed">
                    {story.content}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Hash size={12} />
                      {story.vocabUsed.length} words
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {storyVocab.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {storyVocab.slice(0, 6).map((w) => (
                        <span
                          key={w.id}
                          className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-md"
                        >
                          {w.word}
                        </span>
                      ))}
                      {storyVocab.length > 6 && (
                        <span className="text-text-muted text-xs py-0.5">
                          +{storyVocab.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Expanded Story Modal */}
      <AnimatePresence>
        {expandedId && (() => {
          const story = stories.find((s) => s.id === expandedId);
          if (!story) return null;
          const storyVocab = getVocabForStory(story.vocabUsed);
          return (
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setExpandedId(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold truncate">{story.title}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        removeStory(story.id);
                        setExpandedId(null);
                      }}
                      className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      title="Delete story"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-reading text-text-primary leading-relaxed text-lg whitespace-pre-wrap">
                    {story.content}
                  </p>
                  {storyVocab.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-3">
                        Vocabulary in this story
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {storyVocab.map((w) => (
                          <span
                            key={w.id}
                            className="bg-accent/10 text-accent text-sm px-3 py-1 rounded-lg"
                          >
                            {w.word} — {w.translation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Trash2,
  BookOpen,
  Layers,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import Link from 'next/link';

export default function VocabPage() {
  const { vocabWords, addVocabWord, removeVocabWord, _hasHydrated } = useStore();
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');

  if (!_hasHydrated) {
    return <div className="p-8 text-text-muted pulse-gentle">Loading...</div>;
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) return;
    addVocabWord(word.trim(), translation.trim());
    setWord('');
    setTranslation('');
  };

  const usedCount = vocabWords.filter((w) => w.usedInStories.length > 0).length;
  const unusedCount = vocabWords.length - usedCount;
  const learnedWords = vocabWords.filter((w) => w.usedInStories.length > 0);

  const filtered = vocabWords
    .filter((w) => {
      if (filter === 'used') return w.usedInStories.length > 0;
      if (filter === 'unused') return w.usedInStories.length === 0;
      return true;
    })
    .filter(
      (w) =>
        !search ||
        w.word.toLowerCase().includes(search.toLowerCase()) ||
        w.translation.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-8 lg:p-12 max-w-4xl page-enter">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Vocabulary</h1>
          <p className="text-text-secondary">
            Track the words you want to learn through stories.
          </p>
        </div>
        {learnedWords.length > 0 && (
          <Link
            href="/flashcards"
            className="flex items-center gap-2 bg-secondary/10 text-secondary font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-secondary/20 transition-colors shrink-0"
          >
            <Layers size={15} />
            Flashcards ({learnedWords.length})
          </Link>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card border border-border rounded-xl px-5 py-4">
          <p className="text-2xl font-bold font-display">{vocabWords.length}</p>
          <p className="text-text-muted text-xs mt-0.5">Total Words</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-5 py-4">
          <p className="text-2xl font-bold font-display text-success">{usedCount}</p>
          <p className="text-text-muted text-xs mt-0.5">In Stories</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-5 py-4">
          <p className="text-2xl font-bold font-display text-secondary">{unusedCount}</p>
          <p className="text-text-muted text-xs mt-0.5">Not Yet Used</p>
        </div>
      </div>

      {/* Add Word Form */}
      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-5 mb-6">
        <p className="text-text-secondary text-sm font-medium mb-3">Add a new word</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Word or phrase"
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation"
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <button
            type="submit"
            disabled={!word.trim() || !translation.trim()}
            className="bg-accent text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </form>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vocabulary..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <div className="flex bg-card border border-border rounded-xl overflow-hidden">
          {(['all', 'used', 'unused'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Word List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <BookOpen size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-text-secondary text-sm">
            {vocabWords.length === 0
              ? 'Add your first word above to get started.'
              : 'No words match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((w) => {
              const used = w.usedInStories.length > 0;
              return (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-xl px-5 py-3.5 flex items-center justify-between group card-glow"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {used ? (
                      <CheckCircle2 size={16} className="text-success shrink-0" />
                    ) : (
                      <Circle size={16} className="text-text-muted shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="font-medium">{w.word}</span>
                      <span className="text-text-muted mx-2">&mdash;</span>
                      <span className="text-text-secondary">{w.translation}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {used ? (
                      <span className="text-xs text-success bg-success/10 px-2.5 py-1 rounded-lg">
                        {w.usedInStories.length} {w.usedInStories.length === 1 ? 'story' : 'stories'}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted bg-elevated px-2.5 py-1 rounded-lg">
                        unused
                      </span>
                    )}
                    <button
                      onClick={() => removeVocabWord(w.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

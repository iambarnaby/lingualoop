'use client';

import { useState, useMemo, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle, Layers } from 'lucide-react';
import Link from 'next/link';

export default function FlashcardsPage() {
  const { vocabWords, _hasHydrated } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const learnedWords = useMemo(
    () => vocabWords.filter((w) => w.usedInStories.length > 0),
    [vocabWords]
  );

  const shuffled = useMemo(() => {
    const arr = [...learnedWords];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learnedWords, shuffleKey]);

  const current = shuffled[currentIndex];

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, shuffled.length - 1)), 150);
  }, [shuffled.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => Math.max(i - 1, 0)), 150);
  }, []);

  const reshuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    setShuffleKey((k) => k + 1);
  };

  if (!_hasHydrated) {
    return <div className="p-8 text-text-muted pulse-gentle">Loading...</div>;
  }

  if (learnedWords.length === 0) {
    return (
      <div className="p-8 lg:p-12 max-w-3xl page-enter">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Flashcards</h1>
        <p className="text-text-secondary mb-8">
          Review vocabulary that you&apos;ve encountered in stories.
        </p>
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Layers size={40} className="text-text-muted mx-auto mb-4 opacity-40" />
          <p className="text-text-secondary font-medium mb-1">No cards available</p>
          <p className="text-text-muted text-sm mb-5">
            Flashcards appear once vocabulary has been used in at least one story.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-accent text-deep font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-colors"
          >
            Generate a Story
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / shuffled.length) * 100;

  return (
    <div className="p-8 lg:p-12 max-w-3xl page-enter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Flashcards</h1>
          <p className="text-text-secondary">
            {shuffled.length} {shuffled.length === 1 ? 'card' : 'cards'} from your stories
          </p>
        </div>
        <button
          onClick={reshuffle}
          className="flex items-center gap-2 bg-card border border-border text-text-secondary font-medium text-sm px-4 py-2.5 rounded-xl hover:border-border-light hover:text-text-primary transition-colors"
        >
          <Shuffle size={14} />
          Shuffle
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>Card {currentIndex + 1} of {shuffled.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="w-[420px] h-[280px] cursor-pointer perspective-[1000px]"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`flashcard-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flashcard-front absolute inset-0 bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-8">
                  <p className="text-text-muted text-xs tracking-widest uppercase mb-4">
                    Word
                  </p>
                  <p className="font-display text-3xl font-bold text-center">
                    {current?.word}
                  </p>
                  <p className="text-text-muted text-xs mt-6">tap to reveal</p>
                </div>
                {/* Back */}
                <div className="flashcard-back absolute inset-0 bg-elevated border border-accent/20 rounded-2xl flex flex-col items-center justify-center p-8">
                  <p className="text-accent text-xs tracking-widest uppercase mb-4">
                    Translation
                  </p>
                  <p className="font-display text-3xl font-bold text-center text-accent">
                    {current?.translation}
                  </p>
                  <p className="text-text-muted text-sm mt-4 font-reading">
                    {current?.word}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary hover:border-border-light hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary hover:border-border-light hover:text-text-primary transition-all"
          title="Flip card"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === shuffled.length - 1}
          className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary hover:border-border-light hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Save,
  RefreshCw,
  X,
  Loader2,
  CheckCircle2,
  Circle,
  Wand2,
} from 'lucide-react';

export default function GeneratePage() {
  const { vocabWords, addStory, _hasHydrated } = useStore();
  const [generating, setGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedVocabIds, setGeneratedVocabIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const unusedWords = useMemo(
    () => vocabWords.filter((w) => w.usedInStories.length === 0),
    [vocabWords]
  );

  const toggleWord = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === unusedWords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(unusedWords.map((w) => w.id)));
    }
  };

  const generate = async () => {
    const wordsToUse = unusedWords.filter((w) => selectedIds.has(w.id));
    if (wordsToUse.length === 0) return;

    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: wordsToUse.map((w) => ({ id: w.id, word: w.word, translation: w.translation })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate story');
      }

      const data = await res.json();
      setGeneratedTitle(data.title);
      setGeneratedContent(data.content);
      setGeneratedVocabIds(wordsToUse.map((w) => w.id));
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    addStory(generatedTitle, generatedContent, generatedVocabIds);
    setShowResult(false);
    setGeneratedTitle('');
    setGeneratedContent('');
    setGeneratedVocabIds([]);
    setSelectedIds(new Set());
  };

  const handleRegenerate = () => {
    setShowResult(false);
    generate();
  };

  const handleDiscard = () => {
    setShowResult(false);
    setGeneratedTitle('');
    setGeneratedContent('');
    setGeneratedVocabIds([]);
  };

  if (!_hasHydrated) {
    return <div className="p-8 text-text-muted pulse-gentle">Loading...</div>;
  }

  return (
    <div className="p-8 lg:p-12 max-w-4xl page-enter">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Generate Story</h1>
        <p className="text-text-secondary">
          Create a TPRS story using your unused vocabulary words.
        </p>
      </div>

      {unusedWords.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Sparkles size={40} className="text-text-muted mx-auto mb-4 opacity-40" />
          <p className="text-text-secondary font-medium mb-1">All words are in stories</p>
          <p className="text-text-muted text-sm">
            Add more vocabulary to generate new stories.
          </p>
        </div>
      ) : (
        <>
          {/* Word Selection */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-secondary text-sm font-medium">
                Select words to include ({selectedIds.size} of {unusedWords.length})
              </p>
              <button
                onClick={selectAll}
                className="text-accent text-xs hover:text-accent-hover transition-colors"
              >
                {selectedIds.size === unusedWords.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {unusedWords.map((w) => {
                const selected = selectedIds.has(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWord(w.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all border ${
                      selected
                        ? 'bg-accent/10 border-accent/30 text-accent'
                        : 'bg-surface border-border text-text-secondary hover:border-border-light'
                    }`}
                  >
                    {selected ? <CheckCircle2 size={14} /> : <Circle size={14} className="opacity-40" />}
                    <span>{w.word}</span>
                    <span className="text-text-muted text-xs">({w.translation})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={selectedIds.size === 0 || generating}
            className="w-full bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating story...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Generate Story with {selectedIds.size} {selectedIds.size === 1 ? 'word' : 'words'}
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-danger/10 border border-danger/20 text-danger rounded-xl px-5 py-3 text-sm">
              {error}
            </div>
          )}
        </>
      )}

      {/* Generated Story Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={handleDiscard}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg shadow-black/[0.03] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  <span className="text-text-muted text-sm">Generated Story</span>
                </div>
                <button
                  onClick={handleDiscard}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                <h2 className="font-display text-2xl font-bold mb-4">{generatedTitle}</h2>
                <p className="font-reading text-text-primary leading-relaxed text-lg whitespace-pre-wrap">
                  {generatedContent}
                </p>

                {/* Vocab used */}
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-3">
                    Vocabulary included
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {generatedVocabIds.map((id) => {
                      const w = vocabWords.find((v) => v.id === id);
                      if (!w) return null;
                      return (
                        <span key={id} className="bg-accent/10 text-accent text-sm px-3 py-1 rounded-lg">
                          {w.word} — {w.translation}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-border px-6 py-4 flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Save size={15} />
                  Save Story
                </button>
                <button
                  onClick={handleRegenerate}
                  className="flex-1 bg-card border border-border text-text-secondary font-semibold py-3 rounded-xl hover:border-border-light hover:text-text-primary transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw size={15} />
                  Regenerate
                </button>
                <button
                  onClick={handleDiscard}
                  className="px-5 bg-card border border-border text-text-muted font-semibold py-3 rounded-xl hover:border-border-light hover:text-text-primary transition-colors text-sm"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

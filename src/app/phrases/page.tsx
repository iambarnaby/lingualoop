'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, MessageCircle, Tag } from 'lucide-react';

export default function PhrasesPage() {
  const { phrases, addPhrase, removePhrase, _hasHydrated } = useStore();
  const [phrase, setPhrase] = useState('');
  const [translation, setTranslation] = useState('');
  const [category, setCategory] = useState('General');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(phrases.map((p) => p.category))].sort(),
    [phrases]
  );

  const filtered = useMemo(
    () =>
      phrases
        .filter(
          (p) =>
            (!activeCategory || p.category === activeCategory) &&
            (!search ||
              p.phrase.toLowerCase().includes(search.toLowerCase()) ||
              p.translation.toLowerCase().includes(search.toLowerCase()))
        ),
    [phrases, activeCategory, search]
  );

  const grouped = useMemo(() => {
    const groups: Record<string, typeof phrases> = {};
    for (const p of filtered) {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    }
    return groups;
  }, [filtered]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phrase.trim() || !translation.trim()) return;
    addPhrase(phrase.trim(), translation.trim(), category.trim() || 'General');
    setPhrase('');
    setTranslation('');
  };

  if (!_hasHydrated) {
    return <div className="p-8 text-text-muted pulse-gentle">Loading...</div>;
  }

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-4xl page-enter">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Phrase Library</h1>
        <p className="text-text-secondary">
          Your collection of common phrases for conversation practice.
        </p>
      </div>

      {/* Add Phrase Form */}
      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-5 mb-6">
        <p className="text-text-secondary text-sm font-medium mb-3">Add a new phrase</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Phrase in target language"
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Translation"
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-40 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
          <button
            type="submit"
            disabled={!phrase.trim() || !translation.trim()}
            className="bg-accent text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </form>

      {/* Search & Category Filter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phrases..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !activeCategory
                ? 'bg-accent/10 text-accent'
                : 'bg-card text-text-muted hover:text-text-secondary'
            }`}
          >
            All ({phrases.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-accent/10 text-accent'
                  : 'bg-card text-text-muted hover:text-text-secondary'
              }`}
            >
              <Tag size={10} />
              {cat} ({phrases.filter((p) => p.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* Phrase List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <MessageCircle size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-text-secondary text-sm">
            {phrases.length === 0
              ? 'Add your first phrase above, or they\'ll appear here when you provide your phrase list.'
              : 'No phrases match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-2 px-1">
                {cat}
              </p>
              <div className="space-y-1.5">
                <AnimatePresence mode="popLayout">
                  {items.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-card border border-border rounded-xl px-5 py-3.5 flex items-center justify-between group card-glow"
                    >
                      <div>
                        <span className="font-medium">{p.phrase}</span>
                        <span className="text-text-muted mx-2">&mdash;</span>
                        <span className="text-text-secondary">{p.translation}</span>
                      </div>
                      <button
                        onClick={() => removePhrase(p.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

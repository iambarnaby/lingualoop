'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  LayoutList,
  Sparkles,
  Bot,
  ArrowRight,
  Layers,
} from 'lucide-react';

export default function Dashboard() {
  const { stories, vocabWords, _hasHydrated } = useStore();

  if (!_hasHydrated) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-text-muted pulse-gentle">Loading...</div>
      </div>
    );
  }

  const wordsInStories = vocabWords.filter((w) => w.usedInStories.length > 0).length;
  const unusedWords = vocabWords.length - wordsInStories;

  const stats = [
    { label: 'Total Vocabulary', value: vocabWords.length, icon: LayoutList, accent: 'text-accent' },
    { label: 'Used in Stories', value: wordsInStories, icon: BookOpen, accent: 'text-success' },
    { label: 'Unused Words', value: unusedWords, icon: Sparkles, accent: 'text-secondary' },
    { label: 'Saved Stories', value: stories.length, icon: Layers, accent: 'text-accent' },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-6xl page-enter">
      {/* Hero */}
      <div className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-5xl font-bold mb-3 tracking-tight"
        >
          Welcome to <span className="gradient-text">LinguaLoop</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-lg max-w-xl"
        >
          Build fluency through comprehensible stories. Add vocabulary, generate
          TPRS stories, and practice phrases through conversation.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.45 }}
              className="bg-card border border-border rounded-2xl p-6 card-glow"
            >
              <Icon size={20} className={`${stat.accent} mb-4 opacity-80`} />
              <p className="text-4xl font-bold font-display tracking-tight">{stat.value}</p>
              <p className="text-text-muted text-sm mt-1.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Link
          href="/generate"
          className="group bg-card border border-border rounded-2xl p-6 card-glow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Sparkles size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold">Generate Story</h3>
              <p className="text-text-muted text-xs mt-0.5">AI-powered TPRS</p>
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
          />
        </Link>

        <Link
          href="/flashcards"
          className="group bg-card border border-border rounded-2xl p-6 card-glow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Layers size={18} className="text-secondary" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold">Flashcards</h3>
              <p className="text-text-muted text-xs mt-0.5">Review learned vocab</p>
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
          />
        </Link>

        <Link
          href="/chat"
          className="group bg-card border border-border rounded-2xl p-6 card-glow flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Bot size={18} className="text-success" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold">Practice Chat</h3>
              <p className="text-text-muted text-xs mt-0.5">Converse with AI</p>
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all"
          />
        </Link>
      </div>

      {/* Recent Stories */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Recent Stories</h2>
          {stories.length > 0 && (
            <Link href="/stories" className="text-accent text-sm hover:text-accent-hover transition-colors">
              View all &rarr;
            </Link>
          )}
        </div>

        {stories.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <BookOpen size={36} className="text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary font-medium mb-1">No stories yet</p>
            <p className="text-text-muted text-sm mb-5">
              Add vocabulary words, then generate your first TPRS story.
            </p>
            <Link
              href="/vocab"
              className="inline-flex items-center gap-2 bg-accent text-deep font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-colors"
            >
              <LayoutList size={14} />
              Add Vocabulary
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stories.slice(0, 5).map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
              >
                <Link
                  href="/stories"
                  className="block bg-card border border-border rounded-xl p-5 card-glow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold truncate">{story.title}</h3>
                      <p className="text-text-muted text-sm mt-1 line-clamp-2 font-reading">
                        {story.content}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-lg">
                        {story.vocabUsed.length} words
                      </span>
                      <p className="text-text-muted text-xs mt-1.5">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

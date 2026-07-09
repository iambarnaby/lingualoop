'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  LayoutList,
  Layers,
  Sparkles,
  MessageCircle,
  Bot,
  RotateCcw,
} from 'lucide-react';

const tprsLinks = [
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/vocab', label: 'Vocabulary', icon: LayoutList },
  { href: '/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/generate', label: 'Generate', icon: Sparkles },
];

const phraseLinks = [
  { href: '/phrases', label: 'Phrase Library', icon: MessageCircle },
  { href: '/chat', label: 'Practice Chat', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col z-50">
      {/* Logo */}
      <Link href="/" className="block px-6 pt-7 pb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          <span className="gradient-text logo-glow">Lingua</span>
          <span className="text-text-primary">Loop</span>
        </h1>
        <p className="text-text-muted text-xs mt-1 tracking-widest uppercase">
          Story-driven fluency
        </p>
      </Link>

      <div className="h-px bg-border mx-5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        {/* TPRS Section */}
        <div>
          <p className="text-text-muted text-[10px] font-semibold tracking-[0.2em] uppercase px-3 mb-2">
            TPRS
          </p>
          <ul className="space-y-0.5">
            {tprsLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'text-accent bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-card'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={18}
                      className={`relative z-10 ${active ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'}`}
                    />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Phrases Section */}
        <div>
          <p className="text-text-muted text-[10px] font-semibold tracking-[0.2em] uppercase px-3 mb-2">
            Phrases
          </p>
          <ul className="space-y-0.5">
            {phraseLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'text-accent bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-card'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={18}
                      className={`relative z-10 ${active ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'}`}
                    />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 px-2 text-text-muted text-xs">
          <RotateCcw size={12} />
          <span>Learn through repetition</span>
        </div>
      </div>
    </aside>
  );
}

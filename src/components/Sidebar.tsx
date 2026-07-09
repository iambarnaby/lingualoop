'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  LayoutList,
  Layers,
  Sparkles,
  MessageCircle,
  Bot,
  Sun,
  Moon,
  X,
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useStore();

  const renderLinks = (links: typeof tprsLinks) =>
    links.map((link) => {
      const active = pathname === link.href;
      const Icon = link.icon;
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onClose}
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
    });

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-[260px] glass-heavy flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 md:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <Link href="/" onClick={onClose} className="block px-6 pt-7 pb-6">
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
          <div>
            <p className="text-text-muted text-[10px] font-semibold tracking-[0.2em] uppercase px-3 mb-2">
              TPRS
            </p>
            <ul className="space-y-0.5">{renderLinks(tprsLinks)}</ul>
          </div>

          <div>
            <p className="text-text-muted text-[10px] font-semibold tracking-[0.2em] uppercase px-3 mb-2">
              Phrases
            </p>
            <ul className="space-y-0.5">{renderLinks(phraseLinks)}</ul>
          </div>
        </nav>

        {/* Footer — theme toggle */}
        <div className="p-4 border-t border-border">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Tool, ToolCategory } from '@/types/tool';
import { Card } from '@/components/ui/Card';
import { ArrowUpRight } from 'lucide-react';
import { getToolIcon } from '@/config/icons';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

export interface ToolCardProps {
  /** Tool data to display */
  tool: Tool;
  /** Current locale for URL generation */
  locale: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Localized content */
  localizedContent?: { title: string; description: string };
}

const categoryTranslationKeys: Record<ToolCategory, string> = {
  'edit-annotate': 'editAnnotate',
  'convert-to-pdf': 'convertToPdf',
  'convert-from-pdf': 'convertFromPdf',
  'organize-manage': 'organizeManage',
  'optimize-repair': 'optimizeRepair',
  'secure-pdf': 'securePdf',
};

/**
 * ToolCard component displays a single PDF tool with icon, name, and description.
 * Includes hover effects and links to the tool page.
 */
export function ToolCard({ tool, locale, className = '', localizedContent }: ToolCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const toolUrl = `/${locale}/tools/${tool.slug}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    // Bridged transition delay before changing routes
    setTimeout(() => {
      router.push(toolUrl);
      setTimeout(() => setIsNavigating(false), 300);
    }, 650);
  };

  // Get a human-readable name from the tool ID
  // Use localized title if available, otherwise fallback to formatting the ID
  const toolName = localizedContent?.title || tool.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Generate a description from features
  // Use localized description (metaDescription) if available
  const description = localizedContent?.description || tool.features
    .slice(0, 3)
    .map(f => f.replace(/-/g, ' '))
    .join(', ');

  const IconComponent = getToolIcon(tool.icon);

  const categoryName = t(`home.categories.${categoryTranslationKeys[tool.category]}`);

  return (
    <Link
      href={toolUrl}
      onClick={handleClick}
      className={`block h-full group relative focus:outline-none transition-colors duration-300 overflow-hidden ${className} bg-transparent`}
      data-testid="tool-card"
    >
      <motion.div
        className="h-full relative bg-[hsl(var(--color-background))] hover:bg-[hsl(var(--color-border))] transition-colors"
        animate={{ scale: isNavigating ? 0.95 : 1, filter: isNavigating ? 'blur(4px)' : 'blur(0px)' }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary))/0.03] to-[hsl(var(--color-primary))/0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--color-primary))/0.7] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-[100%] group-hover:translate-x-0" />

        <div className="p-6 md:p-8 h-full flex flex-col relative z-10 transition-colors group-hover:bg-[hsl(var(--color-muted))/0.2] border-r border-b">
          <div className="absolute top-0 right-0 p-3 z-10">
            <FavoriteButton toolId={tool.id} size="sm" />
          </div>
          <div className="absolute top-0 right-10 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-4 h-4 text-[hsl(var(--color-primary))]" />
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-6">
              {/* Tool Icon */}
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-start group-hover:scale-105 transition-transform duration-300 origin-left"
                data-testid="tool-card-icon"
                aria-hidden="true"
              >
                <IconComponent className="w-7 h-7 text-[hsl(var(--color-primary))]" data-icon={tool.icon} />
              </div>
            </div>

            {/* Tool Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-base font-bold font-sans text-white truncate mb-2 group-hover:text-[hsl(var(--color-primary))] transition-colors"
                data-testid="tool-card-name"
              >
                {toolName}
              </h3>
              <p
                className="text-sm text-[#888c96] line-clamp-2 leading-relaxed"
                data-testid="tool-card-description"
              >
                {description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[hsl(var(--color-border))] flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-[hsl(var(--color-muted-foreground))]">
              <span>
                {categoryName}
              </span>
              <span className="text-[hsl(var(--color-primary))] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                {t('common.buttons.next') || 'OPEN'} →
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cinematic Transition Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center pt-[136px] overflow-hidden">
          {/* Background Fade to Obsidian target background */}
          <motion.div
            className="absolute inset-0 bg-[hsl(var(--color-background))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Exact Replica of Target Header Icon for visual bridge */}
          <motion.div
            className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary))/0.1] to-transparent shadow-inner"
            initial={{ y: 80, scale: 0.6, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <IconComponent className="w-8 h-8 text-[hsl(var(--color-primary))]" />
          </motion.div>
        </div>
      )}
    </Link>
  );
}

export default ToolCard;

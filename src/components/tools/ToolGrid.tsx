'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Tool, ToolCategory, CATEGORY_INFO } from '@/types/tool';
import { ToolCard } from './ToolCard';
import { motion, type Variants } from 'framer-motion';

export interface ToolGridProps {
  /** Array of tools to display */
  tools: Tool[];
  /** Current locale for URL generation */
  locale: string;
  /** Optional category filter */
  category?: ToolCategory;
  /** Optional search query to filter tools */
  searchQuery?: string;
  /** Whether to show category headers */
  showCategoryHeaders?: boolean;
  /** Optional additional CSS classes */
  className?: string;
  /** localized tool content */
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

/**
 * ToolGrid component displays a responsive grid of tool cards.
 * Supports filtering by category and responsive layout (1-4 columns).
 * 
 * Requirements: 6.1 - Organize tools into 7 categories
 * Requirements: 6.4 - Responsive grid layout adapting to screen sizes
 */
export function ToolGrid({
  tools,
  locale,
  category,
  searchQuery,
  showCategoryHeaders = false,
  className = '',
  localizedToolContent,
}: ToolGridProps) {
  const t = useTranslations();

  const categoryTranslationKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  // Filter tools by category if specified
  const filteredTools = useMemo(() => {
    let result = tools;

    if (category) {
      result = result.filter(tool => tool.category === category);
    }

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(tool => {
        // Search in localized content if available
        if (localizedToolContent && localizedToolContent[tool.id]) {
          const { title, description } = localizedToolContent[tool.id];
          if (title.toLowerCase().includes(query) || description.toLowerCase().includes(query)) {
            return true;
          }
        }

        const toolName = tool.id.replace(/-/g, ' ').toLowerCase();
        const features = tool.features.map(f => f.replace(/-/g, ' ').toLowerCase()).join(' ');
        return toolName.includes(query) || features.includes(query);
      });
    }

    return result;
  }, [tools, category, searchQuery, localizedToolContent]);

  // Group tools by category if showing headers
  const groupedTools = useMemo(() => {
    if (!showCategoryHeaders) {
      return null;
    }

    const groups: Record<ToolCategory, Tool[]> = {
      'edit-annotate': [],
      'convert-to-pdf': [],
      'convert-from-pdf': [],
      'organize-manage': [],
      'optimize-repair': [],
      'secure-pdf': [],
    };

    for (const tool of filteredTools) {
      groups[tool.category].push(tool);
    }

    return groups;
  }, [filteredTools, showCategoryHeaders]);

  if (filteredTools.length === 0) {
    return (
      <div
        className={`text-center py-12 ${className}`}
        data-testid="tool-grid-empty"
      >
        <p className="text-[hsl(var(--color-muted-foreground))]">
          No tools found
        </p>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 60, damping: 12 }
    }
  };

  // Render grouped by category
  if (showCategoryHeaders && groupedTools) {
    return (
      <div className={`space-y-8 ${className}`} data-testid="tool-grid">
        {Object.entries(groupedTools).map(([cat, categoryTools]) => {
          if (categoryTools.length === 0) return null;

          const categoryInfo = CATEGORY_INFO[cat as ToolCategory];
          const categoryName = t(`home.categories.${categoryTranslationKeys[cat as ToolCategory]}`);

          return (
            <section key={cat} data-testid={`tool-grid-category-${cat}`}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">
                  {categoryName}
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  {categoryInfo.description}
                </p>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-[hsl(var(--color-border))] border border-[hsl(var(--color-border))] overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {categoryTools.map(tool => (
                  <motion.div key={tool.id} variants={itemVariants} className="bg-[hsl(var(--color-background))]">
                    <ToolCard
                      tool={tool}
                      locale={locale}
                      localizedContent={localizedToolContent?.[tool.id]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}
      </div>
    );
  }

  // Render flat grid
  return (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-transparent border-r border-b border-[hsl(var(--color-border))] overflow-hidden border-t border-l ${className}`}
      data-testid="tool-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {filteredTools.map(tool => (
        <motion.div key={tool.id} variants={itemVariants} className="bg-[hsl(var(--color-background))]">
          <ToolCard
            tool={tool}
            locale={locale}
            localizedContent={localizedToolContent?.[tool.id]}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ToolGrid;

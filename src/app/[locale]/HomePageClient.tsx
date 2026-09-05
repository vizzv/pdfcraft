'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Zap, Wrench, Lock, Sparkles, Edit, FileImage, FolderOpen, Settings, ShieldCheck, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Highlights } from '@/components/home/Highlights';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAllTools, getToolsByCategory, getPopularTools } from '@/config/tools';
import { type Locale } from '@/lib/i18n/config';
import { CATEGORY_INFO, type ToolCategory } from '@/types/tool';

interface HomePageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

// ... (previous imports)

// ... (props interface)

// ... (previous imports)

// ... (props interface)

export default function HomePageClient({ locale, localizedToolContent }: HomePageClientProps) {
  const t = useTranslations();
  const allTools = getAllTools();
  const popularTools = getPopularTools();



  // Category icons mapping
  const categoryIcons: Record<ToolCategory, typeof Edit> = {
    'edit-annotate': Edit,
    'convert-to-pdf': FileImage,
    'convert-from-pdf': FileImage,
    'organize-manage': FolderOpen,
    'optimize-repair': Settings,
    'secure-pdf': ShieldCheck,
  };

  const categoryTranslationKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  // Category sections to display
  const categoryOrder: ToolCategory[] = [
    'edit-annotate',
    'convert-to-pdf',
    'convert-from-pdf',
    'organize-manage',
    'optimize-repair',
    'secure-pdf',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main id="main-content" className="flex-1 relative" tabIndex={-1}>
        {/* Hero Section */}
        <Hero locale={locale} />

        {/* Features / Highlights Section */}
        <Highlights />

        {/* ASCII Typographic Section Divider */}
        <div className="w-full border-b border-[hsl(var(--color-border))] py-3 overflow-hidden bg-[#0a0c10]">
          <div className="animate-marquee-reverse whitespace-nowrap flex gap-4 text-[10px] font-mono tracking-[0.3em] text-[hsl(var(--color-muted-foreground))]/40 select-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i}>£ $ / / / $ £ £ £   ◆   £ $ / / / $ £ £ £</span>
            ))}
          </div>
        </div>

        {/* Popular Tools Section */}
        <section className="py-24 bg-[hsl(var(--color-background))]" aria-labelledby="popular-tools-heading">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl px-8 border-l-2 border-[hsl(var(--color-accent-blue))]">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-sm border border-[hsl(var(--color-border))] font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--color-muted-foreground))] bg-[hsl(var(--color-muted))/0.5]">
                  [ {t('home.popularTools.badge')} ]
                </div>
                <h2 id="popular-tools-heading" className="text-4xl md:text-5xl font-serif text-[hsl(var(--color-foreground))] mb-4">
                  {t('home.popularTools.title')}
                </h2>
                <p className="text-[hsl(var(--color-muted-foreground))] text-lg font-sans">
                  {t('home.popularTools.description')}
                </p>
              </div>
            </div>
            <ToolGrid
              tools={popularTools}
              locale={locale}
              localizedToolContent={localizedToolContent}
            />
          </div>
        </section>

        <section className="py-16" aria-labelledby="featured-tools-heading">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div className="max-w-2xl">
                <h2 id="featured-tools-heading" className="text-2xl font-bold text-[hsl(var(--color-foreground))] mb-2">
                  {t(`home.categories.${categoryTranslationKeys['organize-manage']}`)}
                </h2>
                <p className="text-[hsl(var(--color-muted-foreground))] text-base">
                  {t(`home.categoriesDescription.${categoryTranslationKeys['organize-manage']}`)}
                </p>
              </div>
              <Link href={`/${locale}/tools`}>
                <Button variant="outline" size="sm" className="group">
                  {t('common.navigation.tools')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            <ToolGrid
              tools={getToolsByCategory('organize-manage').slice(0, 8)}
              locale={locale}
              localizedToolContent={localizedToolContent}
            />
          </div>
        </section>

        {/* Tool Categories Section */}
        <section className="py-24 border-t border-[hsl(var(--color-border))]" aria-labelledby="categories-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-sm border border-[hsl(var(--color-border))] font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--color-muted-foreground))] bg-[hsl(var(--color-muted))/0.5]">
                [ ECOSYSTEM ]
              </div>
              <h2 id="categories-heading" className="text-3xl md:text-5xl font-serif text-[hsl(var(--color-foreground))] mb-4">
                {t('home.categoriesSection.title')}
              </h2>
              <p className="text-[hsl(var(--color-muted-foreground))] max-w-xl mx-auto text-lg">
                {t('home.categoriesSection.description', { count: allTools.length })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-transparent border border-[hsl(var(--color-border))] overflow-hidden">
              {categoryOrder.map((category) => {
                const categoryTools = getToolsByCategory(category);
                const Icon = categoryIcons[category];
                const categoryName = t(`home.categories.${categoryTranslationKeys[category]}`);
                const categoryDescription = t(`home.categoriesDescription.${categoryTranslationKeys[category]}`);

                return (
                  <div className='border-r border-b border-[hsl(var(--color-border))] '>
                    <Link
                      key={category}
                      href={`/${locale}/tools?category=${category}`}
                      className="group relative block bg-[hsl(var(--color-background))] hover:bg-[hsl(var(--color-border))] transition-colors p-6 h-full "
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary))/0.03] to-[hsl(var(--color-accent-blue))/0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="flex flex-col h-full relative z-10">
                        <div className="mb-6">
                          <div className="w-10 h-10 flex items-center justify-start group-hover:scale-105 transition-transform duration-300 origin-left text-[hsl(var(--color-primary))]">
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold font-sans text-base text-white mb-2 group-hover:text-[hsl(var(--color-primary))] transition-colors">
                            {categoryName}
                          </h3>
                          <p className="text-sm text-[#888c96] line-clamp-2 leading-relaxed">
                            {categoryDescription}
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[hsl(var(--color-border))] flex justify-between items-center text-[10px] uppercase font-mono tracking-wider text-[hsl(var(--color-muted-foreground))]">
                          <span>{categoryTools.length} MODULES</span>
                          <span className="text-[hsl(var(--color-primary))] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">OPEN →</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer locale={locale} />
    </div>
  );
}

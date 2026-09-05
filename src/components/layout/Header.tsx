'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Menu, X, Command, Github } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { RecentFilesDropdown } from '@/components/common/RecentFilesDropdown';
import { searchTools, SearchResult } from '@/lib/utils/search';
import { getToolContent } from '@/config/tool-content';
import { getAllTools } from '@/config/tools';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

export interface HeaderProps {
  locale: Locale;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ locale, showSearch = true }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [localizedTools, setLocalizedTools] = useState<Record<string, { title: string; description: string }>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load localized tool content on mount
  useEffect(() => {
    const allTools = getAllTools();
    const contentMap: Record<string, { title: string; description: string }> = {};

    allTools.forEach(tool => {
      const content = getToolContent(locale, tool.id);
      if (content) {
        contentMap[tool.id] = {
          title: content.title,
          description: content.metaDescription
        };
      }
    });

    setLocalizedTools(contentMap);
  }, [locale]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery, localizedTools); // Pass localized content
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchQuery, localizedTools]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigateToTool(searchResults[selectedIndex].tool.slug);
      } else if (searchResults.length > 0) {
        navigateToTool(searchResults[0].tool.slug);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchResults, selectedIndex]);

  const navigateToTool = useCallback((slug: string) => {
    router.push(`/${locale}/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [locale, router]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Get tool icon based on category
  const getToolIcon = (category: string) => {
    const icons: Record<string, string> = {
      'edit-annotate': '✏️',
      'convert-to-pdf': '📄',
      'convert-from-pdf': '🖼️',
      'organize-manage': '📁',
      'optimize-repair': '🔧',
      'secure-pdf': '🔒',
    };
    return icons[category] || '📄';
  };

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home') },
    { href: `/${locale}/tools`, label: t('navigation.tools') },
    // { href: `/${locale}/workflow`, label: t('navigation.workflow') || 'Workflow' },
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/faq`, label: t('navigation.faq') },
  ];

  return (
    <header
      className={`fixed z-50 transition-all duration-500 w-full px-4 ${scrolled ? 'top-4' : 'top-0 px-0'}`}
      role="banner"
    >
      <div
        className={`w-full mx-auto transition-[max-width] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? 'max-w-6xl' : 'max-w-full'
          }`}
      >        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled
        ? 'h-14 px-6 rounded-full bg-[hsl(var(--color-background))/0.6] backdrop-blur-xl border border-[hsl(var(--color-border))/0.4] shadow-lg shadow-black/20'
        : 'h-24 px-4 bg-transparent border-transparent'}`}>

          {/* Logo and Brand */}
          <div className="flex flex-1 items-center gap-2">
            <Link
              href={`/${locale}`}
              className="group flex items-center gap-2.5 font-sans font-bold text-[hsl(var(--color-foreground))] hover:text-white transition-colors"
              aria-label={`${t('brand')} - ${t('navigation.home')}`}
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--color-primary))] shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-transform group-hover:scale-105">
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xl tracking-tight uppercase" data-testid="brand-name">
                {t('brand')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation with Mega-Menu Support */}
          <nav
            className={`hidden md:flex items-center gap-2 ${isSearchOpen ? 'opacity-0 translate-y-[-10px] pointer-events-none' : 'opacity-100 translate-y-0'} transition-all`}
            role="navigation"
            aria-label="Main navigation"
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {navItems.map((item) => {
              // Strip trailing slashes so /en/ and /en both match
              const cleanPath = pathname.replace(/\/$/, '') || '/';
              const cleanHref = item.href.replace(/\/$/, '') || '/';
              const isActive = cleanHref === `/${locale}`
                ? cleanPath === cleanHref
                : cleanPath.startsWith(cleanHref);

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                >
                  {/* Active / hover pill */}
                  {(activeDropdown === item.label || isActive) && (
                    <div className={`absolute inset-0 rounded-full w-full h-full -z-10 ${isActive ? 'bg-[hsl(var(--color-accent-green))/0.12]' : 'bg-[#282f3a]/80'
                      }`} />
                  )}

                  <Link
                    href={item.href}
                    className={`px-4 py-2 block text-[11px] font-mono tracking-widest font-semibold transition-colors rounded-full z-10 
                    ${isActive
                        ? 'text-[hsl(var(--color-accent-green))]'
                        : activeDropdown === item.label
                          ? 'text-white'
                          : 'text-[hsl(var(--color-muted-foreground))] hover:text-white'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                    {/* {isActive && (
                      <span className="block mx-auto mt-0.5 w-1 h-1 rounded-full bg-[hsl(var(--color-accent-green))]" />
                    )} */}
                  </Link>

                  {/* Dropdown Panel (Simulating Mega-Menu) */}
                  {activeDropdown === item.label && item.label === t('navigation.tools') && (
                    <div className="absolute top-full -left-20 pt-6 cursor-default">
                      <div className="w-[450px] rounded-2xl bg-[#0a0c10]/95 backdrop-blur-3xl border border-[hsl(var(--color-border))] shadow-2xl overflow-hidden shadow-black p-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">

                        <div className="col-span-2 px-3 py-2 mb-2 pb-3 border-b border-[hsl(var(--color-border))]">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[hsl(var(--color-accent-blue))]">PDF Workflows</span>
                        </div>

                        <Link href={`/${locale}/tools/merge`} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-[#12151c] transition-colors">
                          <div className="p-2 rounded-lg bg-[hsl(var(--color-accent-blue))/0.1] text-[hsl(var(--color-accent-blue))] group-hover:scale-110 transition-transform">
                            <Command size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-sans font-medium text-white mb-0.5">Merge PDFs</h4>
                            <p className="text-xs font-sans text-muted-foreground">Combine multiple docs into one.</p>
                          </div>
                        </Link>

                        <Link href={`/${locale}/tools/compress`} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-[#12151c] transition-colors">
                          <div className="p-2 rounded-lg bg-[hsl(var(--color-accent-gold))/0.1] text-[hsl(var(--color-accent-gold))] group-hover:scale-110 transition-transform">
                            <Search size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-sans font-medium text-white mb-0.5">Compress</h4>
                            <p className="text-xs font-sans text-muted-foreground">Reduce file size losslessly.</p>
                          </div>
                        </Link>

                        <div className="col-span-2 mt-2">
                          <Link href={`/${locale}/tools`} className="block w-full text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-widest text-white transition-colors">
                            View all 24 tools →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex flex-1 items-center justify-end gap-1 md:gap-3">
            {/* Search */}
            {showSearch && (
              <div className="relative" ref={searchContainerRef}>
                {isSearchOpen ? (
                  <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-[22px] md:top-1/2 md:-translate-y-1/2 z-50 md:origin-right animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--color-primary))]" />
                      <input
                        ref={searchInputRef}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('search.placeholder') || 'Search tools...'}
                        className="w-full pl-10 pr-10 py-2.5 text-sm font-mono rounded-xl border border-[hsl(var(--color-primary))] bg-[hsl(var(--color-background))] text-white shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--color-primary))]"
                        aria-label="Search tools"
                        autoComplete="off"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSearchToggle}
                        aria-label="Close search"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      >
                        <X className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" aria-hidden="true" />
                      </Button>

                      {/* Search Results Dropdown */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[60vh] overflow-y-auto">
                          <ul className="py-2" role="listbox">
                            {searchResults.map((result, index) => {
                              const localized = localizedTools[result.tool.id];
                              const toolName = localized?.title || result.tool.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                              const toolDescription = localized?.description || result.tool.features.slice(0, 3).join(' • ');

                              return (
                                <li key={result.tool.id}>
                                  <button
                                    onClick={() => navigateToTool(result.tool.slug)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`
                                      w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors
                                      ${index === selectedIndex
                                        ? 'bg-[hsl(var(--color-primary))/0.1] text-white'
                                        : 'hover:bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))]'
                                      }
                                    `}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                  >
                                    <span className="text-xl filter grayscale group-hover:grayscale-0">{getToolIcon(result.tool.category)}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm truncate">
                                        {toolName}
                                      </div>
                                      <div className="text-xs text-[hsl(var(--color-muted-foreground))] truncate">
                                        {toolDescription}
                                      </div>
                                    </div>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchToggle}
                    aria-label="Open search"
                    className="relative text-[hsl(var(--color-muted-foreground))] hover:text-white hover:bg-[hsl(var(--color-muted))/0.5] rounded-full h-8 px-3"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span className="ml-2 hidden lg:inline-block text-[10px] uppercase font-mono tracking-widest opacity-80">CMD+K</span>
                  </Button>
                )}
              </div>
            )}

            {/* GitHub Repository Link */}

            {/* Language Selector */}
            <LanguageSelector currentLocale={locale} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Call to action Pill */}
            <div className="hidden lg:block ml-2">
              <Link href={`/${locale}/tools`}>
                <button className="px-4 w-[125px] py-2 flex-shrink-0! rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-hover))] transition-all shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={handleMobileMenuToggle}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden mt-4 py-4 rounded-2xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-2 p-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium uppercase tracking-wider text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))] hover:text-white rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {/* <li>
                <a
                  href="https://github.com/Oxy PdfTool/Oxy Pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium uppercase tracking-wider text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))] hover:text-white rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                  GitHub
                </a>
              </li> */}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

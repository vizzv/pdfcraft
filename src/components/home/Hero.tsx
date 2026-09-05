'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Lock, Terminal, FileJson, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, type Variants } from 'framer-motion';
import { getAllTools } from '@/config';

interface HeroProps {
    locale: string;
}

export function Hero({ locale }: HeroProps) {
    const t = useTranslations();
    const allTools = getAllTools();
    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { type: 'spring', stiffness: 80, damping: 20 }
        },
    };

    // Abstract Terminal float animation
    const floatVariants: Variants = {
        animate: {
            y: [-10, 10, -10],
            transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isTablet = typeof window !== "undefined" && window.innerWidth < 1024;

    return (
        <section
            className="relative min-h-[80vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-dot-matrix bg-[hsl(var(--color-background))]"
            aria-labelledby="hero-title"
        >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[hsl(var(--color-accent-blue))/0.08] rounded-full filter blur-[120px] opacity-70" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[hsl(var(--color-primary))/0.05] rounded-full filter blur-[150px] opacity-70" />
            </div>

            <div className="container mx-auto px-4 relative z-10 w-full">
                <motion.div variants={itemVariants} className="mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[hsl(var(--color-accent-green))] border border-[hsl(var(--color-accent-green))/0.3] px-3 py-1 bg-[hsl(var(--color-accent-green))/0.1] rounded-full">
                        {t('common.tagline') || 'OxyPDF Is Here'}
                    </span>
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Left Column (40% Asymmetric Split): Typography */}
                    <motion.div
                        className="lg:col-span-5 xl:col-span-7 max-w-2xl"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Eyebrow Label */}

                        {/* Serif Hero Title */}
                        <motion.h2
                            id="hero-title"
                            variants={itemVariants}
                            className="text-4xl md:text-4xl lg:text-6xl font-serif text-[hsl(var(--color-foreground))] leading-[1.1] mb-6 "
                        >
                            The PDF tookit that <br className="hidden md:block" />
                            <span className="font-light italic text-[hsl(var(--color-muted-foreground))]">respects your privacy.</span>
                        </motion.h2>

                        {/* Body Copy */}
                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-[hsl(var(--color-muted-foreground))] mb-10 max-w-xl font-sans"
                        >
                            {t('home.hero.subtitle')}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                        >
                            <Link href={`/${locale}/tools`}>
                                <Button size="lg" className="h-12 px-8 text-sm uppercase tracking-widest font-semibold rounded-full bg-[hsl(var(--color-accent-green))/0.3] border border-transparent hover:border-[hsl(var(--color-accent-green))]! hover:text-[hsl(var(--color-accent-green))] hover:bg-transparent text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(16,183,127,0.30)] hover:shadow-none group cursor-pointer">
                                    {t('home.hero.cta')}
                                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Column (60% Asymmetric Split): Elegant Document Visualization */}
                    <motion.div
                        className="lg:col-span-7 xl:col-span-4 relative w-full h-[450px] lg:h-[550px] hidden md:flex items-center justify-center lg:justify-end"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <motion.div
                            className="relative z-10 w-full max-w-[460px] h-[400px] flex items-center justify-center overflow-visible perspective-[1200px]"
                        >
                            {/* Left Panel Card — Tools Count */}
                            <motion.div
                                className="absolute left-[5%] lg:left-[5%] xl:-left-[5%] w-[180px] h-[260px] rounded-xl bg-white/[0.02] border border-[hsl(var(--color-accent-pink))]/40! backdrop-blur-md shadow-2xl flex flex-col p-5 z-10 transform-gpu bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 bg-[#0a0c10]!"
                                initial={{ rotateZ: -10, rotateY: 20, x: 0, opacity: 0 }}
                                animate={{ rotateZ: -25, rotateY: 10, x: isMobile ? -20 : isTablet ? -40 : -60, opacity: 0.8 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            >
                                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--color-accent-pink))/0.15] flex items-center justify-center text-[hsl(var(--color-accent-pink))] mb-4 shadow-[0_0_20px_hsl(var(--color-accent-pink))/0.2]">
                                    <FileJson size={20} />
                                </div>
                                <h4 className="text-white font-medium text-sm mb-1">Local Processing</h4>
                                <p className="text-[10px] text-white/50 leading-tight">WebAssembly powered.</p>

                                <div className="mt-auto pt-4 border-t border-white/10">
                                    <div className="text-3xl font-bold text-[hsl(var(--color-accent-pink))] leading-none">{allTools.length}+</div>
                                    <div className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-1">{t('home.stats.pdfTools')}</div>
                                </div>
                            </motion.div>

                            {/* Right Panel Card — 100% Free */}
                            <motion.div
                                className="absolute right-[5%] xl:-right-[5%] w-[180px] h-[260px] rounded-xl border border-[hsl(var(--color-accent-gold))]/40! backdrop-blur-md shadow-2xl flex flex-col p-5 z-20 transform-gpu bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 bg-[#0a0c10]!"
                                initial={{ rotateZ: 10, rotateY: -20, x: 0, opacity: 0 }}
                                animate={{ rotateZ: 25, rotateY: -10, x: 60, opacity: 0.8 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                            >
                                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--color-accent-gold))/0.15] flex items-center justify-center text-[hsl(var(--color-accent-gold))] mb-4 ml-auto shadow-[0_0_20px_hsl(var(--color-accent-gold))/0.2]">
                                    <Zap size={20} />
                                </div>
                                <h4 className="text-white font-medium text-sm mb-1">Instant Speed</h4>
                                <p className="text-[10px] text-[hsl(var(--color-accent-gold))]/60 leading-tight">No queuing required.</p>

                                <div className="mt-auto pt-4 border-t border-[hsl(var(--color-accent-gold))/0.15] text-right">
                                    <div className="text-3xl font-bold text-[hsl(var(--color-accent-gold))] leading-none">100%</div>
                                    <div className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-1">{t('home.stats.freeToUse')}</div>
                                </div>
                            </motion.div>

                            {/* Center Primary Card */}
                            <motion.div
                                className="absolute z-30 w-[240px] h-[340px] rounded-2xl bg-[#0a0c10] border border-[hsl(var(--color-accent-green))]/20! backdrop-blur-3xl shadow-[0_30px_80px_hsl(var(--color-accent-green))/0.2] flex flex-col p-8 transform-gpu"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--color-accent-green))/0.1] border border-[hsl(var(--color-accent-green))/0.4] flex items-center justify-center text-[hsl(var(--color-accent-green))] mb-6 shadow-[0_0_30px_hsl(var(--color-accent-green))/0.3]">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-white font-serif text-2xl mb-2">Secure</h3>
                                <p className="text-[10px] text-[hsl(var(--color-muted-foreground))] font-mono uppercase tracking-widest mb-auto">100% Private - Files never leave your device</p>

                                {/* Big stat
                                <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
                                    <div className="text-5xl font-bold text-[hsl(var(--color-accent-green))] leading-none">0</div>
                                    <div className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-2">{t('home.stats.filesUploaded')}</div>
                                </div> */}

                                {/* Status Indicator */}
                                <div className="flex items-center gap-2 pt-4 border-t border-[hsl(var(--color-accent-green))/0.15]">
                                    <div className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                                    <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-widest">Always Private</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ASCII Typographic Section Divider */}
            <div className="absolute bottom-0 left-0 w-full border-t border-[hsl(var(--color-border))] py-3 overflow-hidden bg-[#0a0c10]">
                <div className="animate-marquee whitespace-nowrap flex gap-4 text-[10px] font-mono tracking-[0.3em] text-[hsl(var(--color-muted-foreground))]/40 select-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <span key={i}>/ / / / ◆ ◆ ◆ / / / / [ PDF ENGINE ] ◆ ◆ ◆ / / / /</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

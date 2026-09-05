'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, ServerOff, Code2 } from 'lucide-react';

export function Highlights() {
    const t = useTranslations();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // We have 4 steps
    const steps = [
        {
            id: '01',
            title: 'LOCAL PROCESSING',
            icon: ServerOff,
            color: 'hsl(var(--color-accent-blue))',
            description: 'Your files never leave your device. All PDF manipulation is done instantly inside your web browser.'
        },
        {
            id: '02',
            title: 'LIGHTNING FAST',
            icon: Zap,
            color: 'hsl(var(--color-accent-gold))',
            description: 'No upload speeds, no queuing. Harness the power of your own hardware for instant document processing.'
        },
        {
            id: '03',
            title: 'NO CLOUD STORAGE',
            icon: ShieldCheck,
            color: 'hsl(var(--color-accent-green))',
            description: 'Unlike other PDF tools, we never store your confidential files on a centralized server. Everything is ephemeral and safe.'
        },
        {
            id: '04',
            title: 'UNRESTRICTED ACCESS',
            icon: Code2,
            color: 'hsl(var(--color-accent-pink))',
            description: 'No per-document limits, no waiting queues. Use the tools completely free without restrictions forever.'
        }
    ];

    // Listen to scroll to update the active step
    useEffect(() => {
        return scrollYProgress.onChange((latest) => {
            if (latest < 0.25) setActiveIndex(0);
            else if (latest < 0.5) setActiveIndex(1);
            else if (latest < 0.75) setActiveIndex(2);
            else setActiveIndex(3);
        });
    }, [scrollYProgress]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-[hsl(var(--color-background))]" aria-label="Platform Architecture">
            {/* Sticky Container */}
            <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden border-t border-b border-[hsl(var(--color-border))]">
                {/* Background dot matrix */}
                <div className="absolute inset-0 bg-dot-matrix opacity-30 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px] max-h-[800px]">

                        {/* Left Side: Timeline / Steps */}
                        <div className="lg:col-span-7 flex flex-col justify-center pr-8 lg:border-r border-[hsl(var(--color-border))]">
                            <h2 className="text-3xl md:text-4xl font-serif text-[hsl(var(--color-foreground))] mb-12">
                                Architecture built for <br />
                                <span className="font-light italic text-[hsl(var(--color-muted-foreground))]">privacy & scale</span>
                            </h2>

                            <div className="flex flex-col gap-8 relative">
                                {/* Vertical Progress Line */}
                                <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-[hsl(var(--color-muted))]" />

                                <motion.div
                                    className="absolute left-[11px] top-2 w-[2px] bg-gradient-to-b from-[hsl(var(--color-accent-blue))] via-[hsl(var(--color-accent-gold))] to-[hsl(var(--color-accent-pink))] origin-top"
                                    style={{ scaleY: scrollYProgress }}
                                />

                                {steps.map((step, idx) => (
                                    <div
                                        key={step.id}
                                        className={`relative flex items-start gap-6 transition-all duration-500 ${activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-30'}`}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full flex-shrink-0 z-10 border-[4px] border-[hsl(var(--color-background))]"
                                            style={{ backgroundColor: step.color }}
                                        />
                                        <div>
                                            <div
                                                className="text-[11px] font-mono tracking-widest font-bold mb-1 transition-colors duration-300"
                                                style={{ color: activeIndex === idx ? step.color : 'hsl(var(--color-muted-foreground))' }}
                                            >
                                                {step.id} {step.title}
                                            </div>
                                            <p className="text-sm font-sans text-[hsl(var(--color-muted-foreground))] leading-relaxed max-w-sm">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: 3D / Code Visualization Stack */}
                        <div className="lg:col-span-5 relative flex items-center justify-center hidden md:flex">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    className="absolute inset-0 flex items-center justify-center p-20 origin-bottom"
                                    initial={false}
                                    animate={{
                                        opacity: activeIndex === idx ? 1 : 0,
                                        y: activeIndex === idx ? 0 : activeIndex > idx ? -40 : 40,
                                        scale: activeIndex === idx ? 1 : 0.9,
                                        zIndex: activeIndex === idx ? 10 : 0
                                    }}
                                    transition={{ duration: 0.5, type: 'spring', bounce: 0 }}
                                >
                                    {/* Glowing Backlight */}
                                    <div
                                        className="absolute w-[400px] h-[400px] rounded-full filter blur-[100px] opacity-20 pointer-events-none"
                                        style={{ backgroundColor: step.color }}
                                    />

                                    {/* Abstract Visualizer Container (Replacing Code Block) */}
                                    <div className="relative w-full max-w-sm aspect-square rounded-full border border-[hsl(var(--color-border))] bg-[#0a0c10]/95 backdrop-blur-3xl shadow-2xl flex items-center justify-center overflow-hidden">

                                        {/* Dynamic Grid Background */}
                                        <div className="absolute inset-0 bg-dot-matrix opacity-20" />

                                        {/* Spinning Dashed Ring */}
                                        <motion.div
                                            className="absolute inset-[10%] rounded-full border border-dashed border-[hsl(var(--color-muted-foreground))/0.3]"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                                        />


                                        {/* Massive Responsive Icon */}
                                        <motion.div
                                            className="relative z-10 p-8 rounded-[2rem] bg-transparent shadow-2xl"
                                            style={{ color: step.color, boxShadow: `0 20px 40px ${step.color}22` }}
                                        >
                                            <step.icon size={80} strokeWidth={1} />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section >
    );
}

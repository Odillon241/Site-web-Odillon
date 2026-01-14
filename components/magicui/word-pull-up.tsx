"use client";

import { cn } from "@/lib/utils";
import { m, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface WordPullUpProps {
    text: string;
    className?: string;
    wrapperFramerProps?: Variants;
    framerProps?: Variants;
}

export function WordPullUp({
    text,
    className,
    wrapperFramerProps = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    },
    framerProps = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    },
}: WordPullUpProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-10px" });

    // Split by <br> or newlines if needed, but for now assuming simple text or handling br manually in parent if strictly needed. 
    // Actually, to handle the specific layout "Structurer pour réussir, <br> Innover pour durer", 
    // we might want this component to accept children or be used twice.
    // Let's make it simple: split by spaces.

    const words = text.split(" ");

    return (
        <m.h1
            ref={ref}
            variants={wrapperFramerProps}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className={cn(
                "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
                className,
            )}
        >
            {words.map((word, i) => (
                <m.span key={i} variants={framerProps} className="inline-block pr-[8px]">
                    {word === "" ? <span>&nbsp;</span> : word}
                </m.span>
            ))}
        </m.h1>
    );
}

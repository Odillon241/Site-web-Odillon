"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface FlipWordsProps {
    words: string[];
    duration?: number;
    className?: string;
}

export function FlipWords({
    words,
    duration = 3000,
    className,
}: FlipWordsProps) {
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const startAnimation = useCallback(() => {
        const word = words[words.indexOf(currentWord) + 1] || words[0];
        setCurrentWord(word);
        setIsAnimating(true);
    }, [currentWord, words]);

    useEffect(() => {
        if (!isAnimating) {
            const timeout = setTimeout(() => {
                startAnimation();
            }, duration);
            return () => clearTimeout(timeout);
        }
    }, [isAnimating, duration, startAnimation]);

    return (
        <AnimatePresence
            onExitComplete={() => {
                setIsAnimating(false);
            }}
        >
            <m.span
                initial={{
                    opacity: 0,
                    y: 10,
                    filter: "blur(8px)",
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                }}
                exit={{
                    opacity: 0,
                    y: -20,
                    filter: "blur(8px)",
                    position: "absolute",
                }}
                className={cn(
                    "inline-block relative text-left",
                    className
                )}
                key={currentWord}
            >
                {currentWord.split(" ").map((word, wordIndex) => (
                    <m.span
                        key={word + wordIndex}
                        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                            delay: wordIndex * 0.3,
                            duration: 0.3,
                        }}
                        className="inline-block whitespace-nowrap"
                    >
                        {word.split("").map((letter, letterIndex) => (
                            <m.span
                                key={word + letterIndex}
                                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                                    duration: 0.2,
                                }}
                                className="inline-block"
                            >
                                {letter}
                            </m.span>
                        ))}
                        <span className="inline-block">&nbsp;</span>
                    </m.span>
                ))}
            </m.span>
        </AnimatePresence>
    );
}

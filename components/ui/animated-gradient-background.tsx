"use client";

import { cn } from "@/lib/utils";
import { m } from "framer-motion";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export function AnimatedGradientBackground({
    className,
    children,
}: AnimatedGradientBackgroundProps) {
    return (
        <div className={cn("relative overflow-hidden", className)}>
            {/* Animated gradient orbs */}
            <m.div
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-odillon-teal/20 via-transparent to-transparent blur-3xl"
                animate={{
                    x: [0, 100, 50, 0],
                    y: [0, 50, 100, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <m.div
                className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-odillon-lime/10 via-transparent to-transparent blur-3xl"
                animate={{
                    x: [0, -50, -100, 0],
                    y: [0, -100, -50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <m.div
                className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-radial from-blue-500/5 via-transparent to-transparent blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

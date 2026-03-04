"use client"

import { Video } from "@/types/admin"
import { VideoPlayer } from "@/components/ui/video-player"
import { FadeIn } from "@/components/magicui/fade-in"

interface VideoSectionProps {
    video: Video | null
    className?: string
}

export function VideoSection({ video, className }: VideoSectionProps) {
    if (!video) return null

    return (
        <section className={`py-16 md:py-24 ${className}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mx-auto max-w-5xl relative">
                        {/* Gradient frame derriere */}
                        <div
                            className="absolute -inset-3 bg-gradient-to-br from-[#1A9B8E]/20 via-[#C4D82E]/10 to-[#1A9B8E]/5 rounded-lg blur-sm"
                            aria-hidden="true"
                        />

                        {/* Container video */}
                        <div className="relative rounded-lg overflow-hidden shadow-2xl border border-gray-200/80 ring-1 ring-black/5 bg-gray-900">
                            <VideoPlayer
                                url={video.url}
                                type={video.type}
                                thumbnail={video.thumbnail || undefined}
                                title={video.title}
                                className="w-full aspect-video"
                            />
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

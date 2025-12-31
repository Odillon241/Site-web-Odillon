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
                    <div className="mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black">
                        <VideoPlayer
                            url={video.url}
                            type={video.type}
                            thumbnail={video.thumbnail || undefined}
                            title={video.title}
                            className="w-full aspect-video"
                        />
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}

import { Hero } from "@/components/sections/hero"
import { HeroWithAurora } from "@/components/sections/hero-with-aurora"
import { HeroWithRetroGrid } from "@/components/sections/hero-with-retro-grid"
import { BackgroundsDemoClient } from "./client"

export default function BackgroundsDemo() {
  return (
    <BackgroundsDemoClient
      hero={<Hero />}
      aurora={<HeroWithAurora />}
      retro={<HeroWithRetroGrid />}
    />
  )
}


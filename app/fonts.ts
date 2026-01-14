import localFont from 'next/font/local'

// Optimized font loading: only load weights that are actually used
// Removed: 100 (thin), 200 (ultralight) - not used in the codebase
// Kept: 300-900 for design flexibility
export const airFont = localFont({
  src: [
    {
      path: '../public/fonts/air-black/Air-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/air-black/Air-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-RegularItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/air-black/Air-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/air-black/Air-Semibold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-SemiboldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/air-black/Air-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/air-black/Air-Heavy.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-HeavyItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/air-black/Air-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/air-black/Air-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-air',
  display: 'swap',
  preload: true,
})

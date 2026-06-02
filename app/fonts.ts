import localFont from 'next/font/local'
import { Libre_Baskerville } from 'next/font/google'

// Libre Baskerville for H1 headings
export const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

// Satoshi for main body and general UI
export const satoshiFont = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/Satoshi-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Bold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-BoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Black.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-BlackItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
})

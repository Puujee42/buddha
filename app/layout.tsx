// app/layout.tsx
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from './contexts/LanguageContext'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <ClerkProvider>
    <LanguageProvider>
      <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>
        {children}
      </body>
    </html>
    </LanguageProvider>
  </ClerkProvider>
  )
}
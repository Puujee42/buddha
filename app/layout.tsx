// app/layout.tsx
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from 'next-themes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

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
        <html lang="en" suppressHydrationWarning>
          <body className={`${playfair.variable} ${lato.variable} font-sans`}>
            <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false}>
              {children}
              <Footer />
            </ThemeProvider>
          </body>
        </html>
      </LanguageProvider>
    </ClerkProvider>
  )
}
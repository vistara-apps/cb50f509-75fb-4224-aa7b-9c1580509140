import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Base Mini App',
  description: 'Built with Zara',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="coinbase">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SolanaWalletProvider } from '@/components/SolanaWalletProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XDATA - Global Mobile Data Marketplace',
  description: 'Buy mobile data worldwide with Solana payments. Instant eSIM delivery powered by blockchain.',
  keywords: 'mobile data, eSIM, Solana, crypto payments, travel, connectivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          <div className="min-h-screen bg-black">
            {children}
          </div>
          <Toaster />
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
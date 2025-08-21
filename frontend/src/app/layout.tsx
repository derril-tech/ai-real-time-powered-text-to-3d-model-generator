import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VoxelVerve - AI-Powered Text-to-3D Model Generator',
  description: 'Real-time text-to-3D creation studio with progressive previews and game-ready outputs',
  keywords: '3D modeling, AI, text-to-3D, game assets, PBR textures',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-studio-surface text-white antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const font = Noto_Sans_Thai({ subsets: ['thai', 'latin'], weight: ['400','500','600','700'] })

export const metadata: Metadata = {
  title: 'POS System | ระบบขายหน้าร้าน',
  description: 'Stock POS System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={font.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

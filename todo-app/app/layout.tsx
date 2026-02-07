import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ToDo App',
  description: 'A modern, colorful ToDo application',
}

export default function RootLayout({ children } : {children:any}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "GreenScore Kenya | Fund Kenya's Green Future",
  description:
    'GreenScore Kenya helps funders discover, verify, score, and finance credible green projects across Kenya. Join the movement toward institutional climate stability.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}

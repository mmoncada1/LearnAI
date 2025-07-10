import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Learn Anything With AI | Personalized Learning Paths',
  description: 'Get AI-generated, personalized learning roadmaps for any skill or topic. Turn your learning goals into actionable steps with curated resources.',
  keywords: 'AI learning, personalized education, learning paths, skill development, online learning',
  authors: [{ name: 'Learn Anything AI' }],
  openGraph: {
    title: 'Learn Anything With AI',
    description: 'AI-powered personalized learning paths for any skill',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}

import './globals.css'
import React from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import ParticleBackground from '@/components/ParticleBackground'

export const metadata = {
  title: 'SkillMapAI | Personalized Learning Paths',
  description: 'Get AI-generated, personalized learning roadmaps for any skill or topic. Turn your learning goals into actionable steps with curated resources.',
  keywords: 'AI learning, personalized education, learning paths, skill development, online learning',
  authors: [{ name: 'SkillMapAI' }],
  openGraph: {
    title: 'SkillMapAI',
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
            {/* Particle background */}
            <ParticleBackground />
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
              <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

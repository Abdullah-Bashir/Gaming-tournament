import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { Providers } from "@/app/components/providers"
import SetThemeClass from "@/app/components/set-theme"

import AnimatedBackground from "@/app/components/animatedbackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "ChampionsArena",
  description: "Gaming become more easy",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnimatedBackground />
        <div id="neonGradient" />
        <SetThemeClass />
        <Providers>{children}</Providers>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}

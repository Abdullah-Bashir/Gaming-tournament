'use client'

import { useEffect } from 'react'

export default function SetThemeClass() {
    useEffect(() => {
        try {
            const theme = localStorage.getItem('theme') || 'system'
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const isDark = theme === 'dark' || (theme === 'system' && prefersDark)

            if (isDark) {
                document.documentElement.classList.add('dark')
                document.documentElement.style.colorScheme = 'dark'
            } else {
                document.documentElement.classList.remove('dark')
                document.documentElement.style.colorScheme = 'light'
            }
        } catch (e) {
            console.error('Theme preload failed:', e)
        }
    }, [])

    return null
}

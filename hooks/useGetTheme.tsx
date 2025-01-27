"use client"

import { useState, useEffect } from 'react'

export const useGetTheme = () => {
    const [theme, setTheme] = useState<string>('light')

    useEffect(() => {
        if (typeof document !== 'undefined') {
            // Initial theme check
            const isDark = document.documentElement.classList.contains('dark')
            setTheme(isDark ? 'dark' : 'light')

            // Create observer for class changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isDark = document.documentElement.classList.contains('dark')
                        setTheme(isDark ? 'dark' : 'light')
                    }
                })
            })

            // Start observing
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
            })

            // Cleanup
            return () => observer.disconnect()
        }
    }, [])

    return { theme }
}

export default useGetTheme
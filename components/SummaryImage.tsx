"use client"

import Image from "next/image"
import useGetTheme from "@/hooks/useGetTheme"
import { useEffect, useState } from "react"

interface SummaryImageProps {
    summary: {
        icon: string
        iconDark: string
    }
}

const SummaryImage = ({ summary }: SummaryImageProps) => {
    const { theme } = useGetTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Image
            src={theme === 'dark' ? summary.iconDark : summary.icon}
            width={100}
            height={100}
            alt="uploaded image"
            className="summary-type-icon"
        />
    )
}

export default SummaryImage
"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { MoonStar, Sun, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

const Theme = ({ mobile }: { mobile: boolean }) => {
    const [theme, setTheme] = useState(localStorage.theme || 'system');

    useEffect(() => {
        if (theme === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', theme);
        }

        document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        );
    }, [theme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className={cn("flex justify-center items-center h-[52px] bg-brand/10 rounded-full", mobile ? "w-full" : "w-[52px]")}>
                    {theme === 'light' && mobile && (
                        <div className="mobile-sign-out-button justify-center">
                            <Sun width={24} height={24} className='stroke-brand' />
                            {mobile && <p>Light</p>}
                        </div>
                    )}
                    {theme === 'light' && !mobile && <Sun width={24} height={24} className='stroke-brand' />}
                    {theme === 'dark' && mobile && (
                        <div className="mobile-sign-out-button justify-center">
                            <MoonStar width={24} height={24} className='stroke-brand' />
                            {mobile && <p>Dark</p>}
                        </div>
                    )}
                    {theme === 'dark' && !mobile && <MoonStar width={24} height={24} className='stroke-brand' />}
                    {theme === 'system' && mobile && (
                        <div className="mobile-sign-out-button justify-center">
                            <Monitor width={24} height={24} className='stroke-brand' />
                            {mobile && <p>System</p>}
                        </div>
                    )}
                    {theme === 'system' && !mobile && <Monitor width={24} height={24} className='stroke-brand' />}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className={cn("cursor-pointer", theme === "light" ? "text-brand" : "")} onClick={() => setTheme('light')}>
                    <Sun className={theme === "light" ? "stroke-brand" : ""} />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem className={cn("cursor-pointer", theme === "dark" ? "text-brand" : "")} onClick={() => setTheme('dark')}>
                    <MoonStar className={theme === "dark" ? "stroke-brand" : ""} />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem className={cn("cursor-pointer", theme === "system" ? "text-brand" : "")} onClick={() => setTheme('system')}>
                    <Monitor className={theme === "system" ? "stroke-brand" : ""} />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Theme
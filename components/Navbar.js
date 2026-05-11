"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
    // state variables for scroll style and current session
    const [scrolled, setScrolled] = useState(false)
    const [session, setSession] = useState(null)

    const router = useRouter()
    const pathname = usePathname()

    // listen to scroll so the header switches from transparent to mint blur
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        onScroll() // run once on mount
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // function to fetch the current logged-in user from the profile endpoint
    const fetchSession = async () => {
        try {
            const res = await fetch('/api/auth/profile', { cache: 'no-store' })
            const data = await res.json()
            setSession(data.loggedIn ? data.userData : null)
        } catch {
            setSession(null) // treat any error as logged out
        }
    }

    // refresh session info whenever the route changes (login, logout, etc.)
    useEffect(() => {
        fetchSession()
    }, [pathname])

    // function to log the user out
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setSession(null)
        router.push('/') // send the user back home after logout
        router.refresh() // refresh to drop any cached server data
    }

    // shared link styling helpers
    const baseLink = 'font-mono text-[10px] uppercase tracking-[0.25em] text-ink/80 hover:text-ink transition-colors'
    const activeLink = 'text-accent border-b border-accent pb-0.5'
    // helper to figure out if a nav item matches the current route
    const isActive = (href) => pathname === href || pathname?.startsWith(href + '/')

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-mint/85 backdrop-blur-md border-b border-ink/15 py-3'
                : 'bg-transparent py-7'
                }`}
        >
            <div className="max-w-[1600px] mx-auto px-8 flex items-center gap-8">

                {/* brand mark on the left */}
                <Link href="/" className="flex items-baseline gap-3 shrink-0">
                    <span className="font-serif text-[18px] tracking-tight">NeuraCortex</span>
                    <span className="font-mono text-[10px] text-ink-mute">CB-001</span>
                </Link>

                {/* main navigation tabs centered */}
                <nav className="flex-1 hidden md:flex items-center justify-center gap-10">
                    <Link href="/about" className={`${baseLink} ${isActive('/about') ? activeLink : ''}`}>About</Link>
                    <Link href="/research" className={`${baseLink} ${isActive('/research') ? activeLink : ''}`}>Research</Link>
                    <Link href="/events" className={`${baseLink} ${isActive('/events') ? activeLink : ''}`}>Events</Link>

                    {/* show bookings only when logged in */}
                    {session && (
                        <Link href="/bookings" className={`${baseLink} ${isActive('/bookings') ? activeLink : ''}`}>
                            Bookings
                        </Link>
                    )}

                    {/* show admin only for admins */}
                    {session?.role === 'admin' && (
                        <Link href="/admin" className={`${baseLink} ${isActive('/admin') ? activeLink : ''}`}>
                            Admin
                        </Link>
                    )}
                </nav>
                {/* auth area on the right */}
                <div className="flex items-center gap-5 shrink-0">
                    {session ? (
                        <>
                            <span className="font-mono text-[10px] text-ink-mute uppercase tracking-[0.22em] hidden md:inline">
                                {session.username} / {session.role}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-mint transition-colors"
                            >
                                Logout <span aria-hidden>→</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 border border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-mint transition-colors"
                        >
                            Log In <span aria-hidden>→</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

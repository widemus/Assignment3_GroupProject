"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Mono from '@/components/Mono'

export default function RegisterClient() {
    // state variables to control form inputs and feedback
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    // handles form submission and register api call
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("") // reset error on new submission
        setSubmitting(true)

        try {
            // send signup data to the register endpoint
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })
            const data = await res.json()

            // server logs the user in automatically on success
            if (res.ok) {
                router.push('/')
                router.refresh()
            } else {
                setError(data.message || "Registration failed.")
            }
        } catch (err) {
            console.error(err)
            setError("Could not reach the server.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="pt-40 pb-32 px-8 min-h-screen">
            <div className="max-w-md mx-auto">

                <Mono>CB / New observer</Mono>
                <h1 className="font-serif text-5xl mt-4 mb-12 leading-tight">Create account</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute block mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-ink/40 py-2 font-serif text-lg focus:outline-none focus:border-ink"
                        />
                    </div>

                    <div>
                        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute block mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-ink/40 py-2 font-serif text-lg focus:outline-none focus:border-ink"
                        />
                    </div>

                    <div>
                        <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute block mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-transparent border-b border-ink/40 py-2 font-serif text-lg focus:outline-none focus:border-ink"
                        />
                    </div>

                    {error && (
                        <p className="font-mono text-[11px] text-accent">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="font-mono text-[11px] uppercase tracking-[0.22em] bg-ink text-mint px-6 py-3 hover:bg-accent transition-colors disabled:opacity-50"
                    >
                        {submitting ? "Creating..." : "Create account →"}
                    </button>
                </form>

                <p className="mt-8 font-serif text-ink-soft">
                    Already registered?{" "}
                    <Link href="/auth/login" className="underline hover:text-accent">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

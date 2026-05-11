"use client"

import { useEffect, useState } from 'react'
import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'

export default function UsersClient() {
    // state variables for the user list and feedback
    const [users, setUsers] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    // state variables for the new user form
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("attendee")
    const [formError, setFormError] = useState("")

    // function to fetch all users from the admin endpoint
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/users', { cache: 'no-store' })
            const data = await res.json()
            if (res.ok) {
                setUsers(data.data || [])
            } else {
                setError(data.message || "Could not load users.")
            }
        } catch (err) {
            console.error(err)
            setError("Network error.")
        } finally {
            setLoading(false)
        }
    }

    // load users on first render
    useEffect(() => {
        fetchUsers()
    }, [])

    // handles new user creation
    const handleCreate = async (e) => {
        e.preventDefault()
        setFormError("") // reset error on new submission

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role }),
            })
            const data = await res.json()

            if (res.ok) {
                // clear form and refresh the table on success
                setUsername("")
                setEmail("")
                setPassword("")
                setRole("attendee")
                fetchUsers()
            } else {
                setFormError(data.message || "Could not create user.")
            }
        } catch (err) {
            console.error(err)
            setFormError("Network error.")
        }
    }

    // handles changing a user's role from the table
    const handleRoleChange = async (id, newRole) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            })
            if (res.ok) fetchUsers()
        } catch (err) {
            console.error(err)
        }
    }

    // handles deleting a user from the table
    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return // confirm before destroying

        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
            if (res.ok) fetchUsers()
        } catch (err) {
            console.error(err)
        }
    }

    // shared field styling
    const fieldCls = "w-full bg-transparent border-b border-ink/40 py-2 font-serif focus:outline-none focus:border-ink"
    const labelCls = "font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute block mb-2"

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1200px] mx-auto">

                <SectionLabel index={1} jp="利用者" en="Users" />

                <h1 className="font-serif text-5xl mb-12 leading-tight">
                    All accounts
                </h1>

                {/* show fetch error if any */}
                {error && (
                    <p className="font-mono text-[11px] text-accent mb-8">{error}</p>
                )}

                {/* new user form */}
                <form onSubmit={handleCreate} className="border border-ink/15 p-6 mb-12 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className={labelCls}>Username</label>
                        <input className={fieldCls} type="text" required value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input className={fieldCls} type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Password</label>
                        <input className={fieldCls} type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Role</label>
                        <select className={fieldCls} value={role} onChange={e => setRole(e.target.value)}>
                            <option value="attendee">attendee</option>
                            <option value="organiser">organiser</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>
                    <button type="submit" className="font-mono text-[11px] uppercase tracking-[0.22em] bg-ink text-mint px-4 py-3 hover:bg-accent">
                        + Add
                    </button>

                    {/* show form error below */}
                    {formError && (
                        <p className="md:col-span-5 font-mono text-[11px] text-accent">{formError}</p>
                    )}
                </form>

                {/* loading state */}
                {loading ? (
                    <p className="font-mono text-[11px] text-ink-mute">Loading...</p>
                ) : (
                    <div className="border-t border-ink/15">

                        {/* table header */}
                        <div className="grid grid-cols-12 gap-4 py-3 border-b border-ink/15">
                            <div className="col-span-1"><Mono>ID</Mono></div>
                            <div className="col-span-3"><Mono>Username</Mono></div>
                            <div className="col-span-4"><Mono>Email</Mono></div>
                            <div className="col-span-2"><Mono>Role</Mono></div>
                            <div className="col-span-2 text-right"><Mono>Actions</Mono></div>
                        </div>

                        {/* table rows */}
                        {users.map(u => (
                            <div key={u.id} className="grid grid-cols-12 gap-4 py-4 border-b border-ink/10 items-center">
                                <div className="col-span-1 font-mono text-[11px]">{u.id}</div>
                                <div className="col-span-3 font-serif">{u.username}</div>
                                <div className="col-span-4 font-mono text-[11px]">{u.email}</div>
                                <div className="col-span-2">
                                    <select
                                        className="bg-transparent border border-ink/30 px-2 py-1 font-mono text-[11px]"
                                        value={u.role}
                                        onChange={e => handleRoleChange(u.id, e.target.value)}
                                    >
                                        <option value="attendee">attendee</option>
                                        <option value="organiser">organiser</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                                <div className="col-span-2 text-right">
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

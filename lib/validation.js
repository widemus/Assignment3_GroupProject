export function validateRegister({ username, email, password }) {
    if (!username || !email || !password) {
        return { valid: false, error: 'All fields are required.' };
    }
    if (username.length < 3 || username.length > 50) {
        return { valid: false, error: 'Username must be 3–50 characters.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Invalid email address.' };
    }
    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters.' };
    }
    return { valid: true };
}


export function validateLogin({ email, password }) {
    if (!email || !password) {
        return { valid: false, error: 'Email and password are required.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Invalid email address.' };
    }
    return { valid: true };
}


export function validateEvent({ title, event_type, date_time, max_attendees }) {
    if (!title || !event_type || !date_time) {
        return { valid: false, error: 'Title, event type, and date are required.' };
    }
    if (!['webinar', 'excursion'].includes(event_type)) {
        return { valid: false, error: 'Event type must be webinar or excursion.' };
    }
    const eventDate = new Date(date_time);
    if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
        return { valid: false, error: 'Event date must be in the future.' };
    }
    if (max_attendees !== undefined) {
        const cap = parseInt(max_attendees);
        if (isNaN(cap) || cap < 1) {
            return { valid: false, error: 'Max attendees must be a positive number.' };
        }
    }
    return { valid: true };
}


export function validateRole(role) {
    if (!['admin', 'organiser', 'attendee'].includes(role)) {
        return { valid: false, error: 'Role must be admin, organiser, or attendee.' };
    }
    return { valid: true };
}
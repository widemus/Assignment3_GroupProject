// Validate registration input
export function validateRegister({ username, email, password }) {

    // Check required fields
    if (!username || !email || !password) {
        return { valid: false, error: 'All fields are required.' };
    }

    // Username length validation
    if (username.length < 3 || username.length > 50) {
        return { valid: false, error: 'Username must be 3–50 characters.' };
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Invalid email address.' };
    }

    // Password length validation
    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters.' };
    }

    return { valid: true };
}

// Validate login input
export function validateLogin({ email, password }) {

    // Check required fields
    if (!email || !password) {
        return { valid: false, error: 'Email and password are required.' };
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Invalid email address.' };
    }

    return { valid: true };
}

// Validate event creation input
export function validateEvent({ title, event_type, date_time, max_attendees }) {

    // Required fields
    if (!title || !event_type || !date_time) {
        return { valid: false, error: 'Title, event type, and date are required.' };
    }

    // Only allow specific event types
    if (!['webinar', 'excursion'].includes(event_type)) {
        return { valid: false, error: 'Event type must be webinar or excursion.' };
    }

    // Validate date
    const eventDate = new Date(date_time);

    // Must be valid and in the future
    if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
        return { valid: false, error: 'Event date must be in the future.' };
    }

    // Max attendees validation
    if (max_attendees !== undefined) {
        const cap = parseInt(max_attendees);

        if (isNaN(cap) || cap < 1) {
            return { valid: false, error: 'Max attendees must be a positive number.' };
        }
    }

    return { valid: true };
}

// Validate user role
export function validateRole(role) {

    // Only allow predefined roles
    if (!['admin', 'organiser', 'attendee'].includes(role)) {
        return { valid: false, error: 'Role must be admin, organiser, or attendee.' };
    }
    
    return { valid: true };
}
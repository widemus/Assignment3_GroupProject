-- NeuraCortex Database Schema & Seed Data

CREATE DATABASE IF NOT EXISTS neuracortex;
USE neuracortex;


-- TABLES

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;


-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'organiser', 'attendee') DEFAULT 'attendee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- EVENTS TABLE
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type ENUM('webinar', 'excursion') NOT NULL,
    date_time DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    location VARCHAR(255),
    max_attendees INT DEFAULT 50,
    organiser_id INT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key: if organiser is deleted - delete their events
    FOREIGN KEY (organiser_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('confirmed', 'cancelled', 'waitlisted') DEFAULT 'confirmed',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (event_id) 
        REFERENCES events(id) 
        ON DELETE CASCADE,
    
    FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,

    UNIQUE KEY unique_booking (event_id, user_id)
);

-- SEED DATA
-- INSERT USERS (predefined accounts)
INSERT INTO users (username, email, password_hash, role) VALUES

-- Admin account
('admin',      'admin@neuracortex.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),

-- Organisers
('dr_vasquez', 'vasquez@neuracortex.com',   '$2a$10$xVBh4e7GF2qNFJ8yJmQXV.kQCGKlLxEBVjCbH0BFuTNLLQMDf9E9W', 'organiser'),

('dr_chen',    'chen@neuracortex.com',      '$2a$10$3euPcmQFCiblsZeEu6Z7LuGzJpPYVlTJV7K9V0c5XuoaDyoF.oJfm', 'organiser'),


-- Attendees
('neuronaut1', 'user1@neuracortex.com',     '$2a$10$TwlbRGoH4v5lOxDa0Vu3lO5EHhiGKDREL82KRo.vwCimHr7PriGym', 'attendee'),

('neuronaut2', 'user2@neuracortex.com',     '$2a$10$c5sSBerJoSQ5gLKfI2Oi4.mvJGHiN0VJI/M48cP6g1m5i9ZdJHc.a', 'attendee'),

('neuronaut3', 'user3@neuracortex.com',     '$2a$10$YkFlFdFNi6LlVp7ZIi5DxetQzNPKFSg4d/hVZ9BJ5WNSSuJ9YhCaS', 'attendee');


--   admin@neuracortex.com / admin123
--   vasquez@neuracortex.com / organiser1pass
--   user1@neuracortex.com / attendee1pass


-- INSERT EVENTS
INSERT INTO events (title, description, event_type, date_time, duration_minutes, location, max_attendees, organiser_id, image_url) VALUES

-- NEURASYNC DEPLOYMENT WEBINAR
(
    'NEURASYNC™ V3.1 // Live Deployment Briefing',
    'Join our lead architects for a live walkthrough of the NeuraSYNC v3.1 cortical stack — covering latency benchmarks, substrate improvements, and enterprise integration pathways. Q&A included.',
    'webinar',
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    90,
    'https://meet.neuracortex.com/neurasync-v3',
    100,
    2,
    '/images/events/neurasync.jpg'
),

--BIOMATA ARCHITECTURE SESSION
(
    'Biomata Architecture — Cortical Mesh Overview',
    'A deep-dive technical session on the biomata layer: how biological neural tissue interfaces with silicon mesh substrates. Intended for engineers and researchers.',
    'webinar',
    DATE_ADD(NOW(), INTERVAL 14 DAY),
    120,
    'https://meet.neuracortex.com/biomata-arch',
    80,
    2,
    '/images/events/biomata.jpg'
),

-- SINGAPORE LAB EXCURSION
(
    'Lab Excursion // Facility Tour — Singapore Node',
    'An exclusive guided tour of our Singapore compute node. Observe live organoid cultures, substrate fabrication, and the cooling infrastructure that keeps our cortical arrays alive.',
    'excursion',
    DATE_ADD(NOW(), INTERVAL 21 DAY),
    240,
    '12 Science Park Drive, Singapore 118224',
    20,
    3,
    '/images/events/singapore.jpg'
),

-- ETHICS PANEL WEBINAR
(
    'Organoid Ethics Symposium // Panel Discussion',
    'A moderated discussion with bioethicists, engineers, and policy advisors on the ethical implications of organoid-based computing. Open to all stakeholders.',
    'webinar',
    DATE_ADD(NOW(), INTERVAL 10 DAY),
    180,
    'https://meet.neuracortex.com/ethics-panel',
    200,
    3,
    '/images/events/ethics.jpg'
),

-- DUBLIN WORKSHOP 
(
    'Substrate Fabrication Workshop — Dublin HQ',
    'Hands-on guided workshop in our Dublin facility. Learn how cortical substrates are grown, tested, and integrated into compute arrays. Limited spots available.',
    'excursion',
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    300,
    'NeuraCortex HQ, Grand Canal Dock, Dublin 2',
    12,
    2,
    '/images/events/dublin.jpg'
),

-- API DEVELOPER SESSION
(
    'NeuraSYNC API — Developer Integration Session',
    'For developers integrating with the NeuraSYNC API. We cover authentication, rate limits, data format, and how to interpret cortical output streams in your applications.',
    'webinar',
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    60,
    'https://meet.neuracortex.com/api-dev',
    150,
    3,
    '/images/events/api.jpg'
),

-- TOKYO NODE MAINTENANCE VISIT
(
    'Cortical Array Maintenance — Tokyo Node Visit',
    'A rare opportunity to visit our Tokyo compute node during scheduled maintenance. Observe real-time organoid health monitoring and substrate replacement procedures.',
    'excursion',
    DATE_ADD(NOW(), INTERVAL 45 DAY),
    360,
    '3-1 Marunouchi, Chiyoda, Tokyo 100-0005',
    8,
    2,
    '/images/events/tokyo.jpg'
),

-- QUARTERLY RESEARCH UPDATE
(
    'Quarterly Research Update — Q2 2026',
    'NeuraCortex research leads present findings from Q2 2026: new cortical efficiency records, peer-review publications, and roadmap for H2 2026 deployments.',
    'webinar',
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    90,
    'https://meet.neuracortex.com/q2-research',
    500,
    3,
    '/images/events/research.jpg'
);

-- INSERT BOOKINGS
INSERT INTO bookings (event_id, user_id, status) VALUES

-- Event 1 bookings
(1, 4, 'confirmed'),
(1, 5, 'confirmed'),
(1, 6, 'confirmed'),

-- Event 2 bookings
(2, 4, 'confirmed'),
(2, 6, 'waitlisted'),

-- Event 3 bookings
(3, 5, 'confirmed'),

-- Event 4 bookings
(4, 4, 'confirmed'),
(4, 5, 'confirmed'),

-- Event 5 bookings
(5, 6, 'confirmed'),

-- Event 6 bookings
(6, 4, 'confirmed'),
(6, 5, 'confirmed'),

-- Event 7 bookings
(7, 6, 'confirmed'),

-- Event 8 bookings
(8, 4, 'confirmed'),
(8, 5, 'cancelled');
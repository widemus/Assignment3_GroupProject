-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: neuracortex
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;

SET @@SESSION.SQL_LOG_BIN = 0;

--
-- GTID state at the beginning of the backup
--

SET
    @@GLOBAL.GTID_PURGED = /*!80000 '+'*/ 'cc8cfa28-2c23-11f1-9b49-07fcde60463f:1-65';

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `bookings` (
    `id` int NOT NULL AUTO_INCREMENT,
    `event_id` int NOT NULL,
    `user_id` int NOT NULL,
    `status` enum(
        'confirmed',
        'cancelled',
        'waitlisted'
    ) DEFAULT 'confirmed',
    `booked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_booking` (`event_id`, `user_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 26 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */
;
INSERT INTO
    `bookings`
VALUES (
        1,
        1,
        4,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        2,
        1,
        5,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        3,
        1,
        6,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        4,
        2,
        4,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        5,
        2,
        6,
        'waitlisted',
        '2026-05-11 07:26:10'
    ),
    (
        6,
        3,
        5,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        7,
        4,
        4,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        8,
        4,
        5,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        9,
        5,
        6,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        10,
        6,
        4,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        11,
        6,
        5,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        12,
        7,
        6,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        13,
        8,
        4,
        'confirmed',
        '2026-05-11 07:26:10'
    ),
    (
        14,
        8,
        5,
        'cancelled',
        '2026-05-11 07:26:10'
    ),
    (
        17,
        8,
        2,
        'confirmed',
        '2026-05-12 13:38:29'
    ),
    (
        18,
        7,
        9,
        'confirmed',
        '2026-05-12 14:19:51'
    ),
    (
        19,
        7,
        10,
        'confirmed',
        '2026-05-12 14:20:16'
    ),
    (
        20,
        7,
        11,
        'confirmed',
        '2026-05-12 14:21:51'
    ),
    (
        21,
        7,
        12,
        'confirmed',
        '2026-05-12 14:22:46'
    ),
    (
        22,
        7,
        13,
        'confirmed',
        '2026-05-12 14:23:50'
    ),
    (
        23,
        7,
        14,
        'confirmed',
        '2026-05-12 14:24:30'
    ),
    (
        24,
        7,
        15,
        'confirmed',
        '2026-05-12 14:25:24'
    ),
    (
        25,
        7,
        16,
        'waitlisted',
        '2026-05-12 14:26:08'
    );
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `events` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(200) NOT NULL,
    `description` text,
    `event_type` enum('webinar', 'excursion') NOT NULL,
    `date_time` datetime NOT NULL,
    `duration_minutes` int DEFAULT '60',
    `location` varchar(255) DEFAULT NULL,
    `max_attendees` int DEFAULT '50',
    `organiser_id` int NOT NULL,
    `image_url` varchar(500) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `organiser_id` (`organiser_id`),
    CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organiser_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */
;
INSERT INTO
    `events`
VALUES (
        1,
        'NEURASYNCâ„¢ V3.1 // Live Deployment Briefing',
        'Join our lead architects for a live walkthrough of the NeuraSYNC v3.1 cortical stack â€” covering latency benchmarks, substrate improvements, and enterprise integration pathways. Q&A included.',
        'webinar',
        '2026-05-18 08:26:10',
        90,
        'https://meet.neuracortex.com/neurasync-v3',
        100,
        2,
        '/images/events/neurasync.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        2,
        'Biomata Architecture â€” Cortical Mesh Overview',
        'A deep-dive technical session on the biomata layer: how biological neural tissue interfaces with silicon mesh substrates. Intended for engineers and researchers.',
        'webinar',
        '2026-05-25 08:26:10',
        120,
        'https://meet.neuracortex.com/biomata-arch',
        80,
        2,
        '/images/events/biomata.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        3,
        'Lab Excursion // Facility Tour â€” Singapore Node',
        'An exclusive guided tour of our Singapore compute node. Observe live organoid cultures, substrate fabrication, and the cooling infrastructure that keeps our cortical arrays alive.',
        'excursion',
        '2026-06-01 08:26:10',
        240,
        '12 Science Park Drive, Singapore 118224',
        20,
        3,
        '/images/events/singapore.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        4,
        'Organoid Ethics Symposium // Panel Discussion',
        'A moderated discussion with bioethicists, engineers, and policy advisors on the ethical implications of organoid-based computing. Open to all stakeholders.',
        'webinar',
        '2026-05-21 08:26:10',
        180,
        'https://meet.neuracortex.com/ethics-panel',
        200,
        3,
        '/images/events/ethics.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        5,
        'Substrate Fabrication Workshop â€” Dublin HQ',
        'Hands-on guided workshop in our Dublin facility. Learn how cortical substrates are grown, tested, and integrated into compute arrays. Limited spots available.',
        'excursion',
        '2026-06-10 08:26:10',
        300,
        'NeuraCortex HQ, Grand Canal Dock, Dublin 2',
        12,
        2,
        '/images/events/dublin.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        6,
        'NeuraSYNC API â€” Developer Integration Session',
        'For developers integrating with the NeuraSYNC API. We cover authentication, rate limits, data format, and how to interpret cortical output streams in your applications.',
        'webinar',
        '2026-05-16 08:26:10',
        60,
        'https://meet.neuracortex.com/api-dev',
        150,
        3,
        '/images/events/api.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        7,
        'Cortical Array Maintenance â€” Tokyo Node Visit',
        'A rare opportunity to visit our Tokyo compute node during scheduled maintenance. Observe real-time organoid health monitoring and substrate replacement procedures.',
        'excursion',
        '2026-06-25 08:26:10',
        360,
        '3-1 Marunouchi, Chiyoda, Tokyo 100-0005',
        8,
        2,
        '/images/events/tokyo.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        8,
        'Quarterly Research Update â€” Q2 2026',
        'NeuraCortex research leads present findings from Q2 2026: new cortical efficiency records, peer-review publications, and roadmap for H2 2026 deployments.',
        'webinar',
        '2026-05-14 08:26:10',
        90,
        'https://meet.neuracortex.com/q2-research',
        500,
        3,
        '/images/events/research.jpg',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    );
/*!40000 ALTER TABLE `events` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `role` enum(
        'admin',
        'organiser',
        'attendee'
    ) DEFAULT 'attendee',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */
;
INSERT INTO
    `users`
VALUES (
        1,
        'admin',
        'admin@neuracortex.com',
        '$2b$10$Eh2bvWyxlEPhljGYMiHXDuKVQalaCLqUnO6IHrpTpmNyNzY4bLQsK',
        'admin',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        2,
        'dr_vasquez',
        'vasquez@neuracortex.com',
        '$2b$10$oLINS25DVME9phnHF2lgReb505Uz0XkV0qUpQbDmAqQDtLSPclM2y',
        'organiser',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        3,
        'dr_chen',
        'chen@neuracortex.com',
        '$2b$10$MaJFwqn4KNR2vAft0O09Ru8LdAdFWMAP7gWrOmjCxszTVpU26MHea',
        'organiser',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        4,
        'neuronaut1',
        'user1@neuracortex.com',
        '$2b$10$jbKw9j.2yHAb9XWfw0HdU.OvVpbDjSStP14jG5RtgJUX15NIcb3tG',
        'attendee',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        5,
        'neuronaut2',
        'user2@neuracortex.com',
        '$2b$10$H3W2jcKESiv4shej5LQwSuiVTrNWdTMGA4.HmsD06YnZj9Yw0lxJy',
        'attendee',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        6,
        'neuronaut3',
        'user3@neuracortex.com',
        '$2b$10$a3hCWMLZwuANb9P3Rw92pOEI/JvtuHAcfiGnPXvUBjBJ2vAyYx65q',
        'attendee',
        '2026-05-11 07:26:10',
        '2026-05-11 07:26:10'
    ),
    (
        9,
        'anton',
        'zagrajanton@gmail.com',
        '$2b$12$zSOrMDN7CBbI4gtvlTORpu.WiU8wmZiu.cnBSLN7xALfbC2xDnBUG',
        'attendee',
        '2026-05-12 14:19:35',
        '2026-05-12 14:19:35'
    ),
    (
        10,
        'widem',
        'widem123z@gmail.com',
        '$2b$12$AheoDIy3TKfnI3VzmrbTheT2w7gbf2ylCszLIjDW8K2Acu3tOr0Tq',
        'attendee',
        '2026-05-12 14:20:09',
        '2026-05-12 14:20:09'
    ),
    (
        11,
        'kefirq',
        'antonzahrai13@gmail.com',
        '$2b$12$E7qn2mbv.pskrbIIoA98x.W9yOeXH4nvLNlvtbUbS8V.85EuXyhqi',
        'attendee',
        '2026-05-12 14:21:42',
        '2026-05-12 14:21:42'
    ),
    (
        12,
        'arcana',
        'arcana438@gmail.com',
        '$2b$12$kCCWglkYAmKyEt5TP86n1.vOEa7OQNWBJMIgppzvd7fPyI5.WKj5O',
        'attendee',
        '2026-05-12 14:22:32',
        '2026-05-12 14:22:32'
    ),
    (
        13,
        'qwiple-',
        '1o1ch1ch3k@gmail.com',
        '$2b$12$OzuG1GuNmaK2WERNkkz4kuybMyR9wEdNzV451GF7j4DGa8tYB5gS6',
        'attendee',
        '2026-05-12 14:23:37',
        '2026-05-12 14:23:37'
    ),
    (
        14,
        'karolina',
        'karolinafaramonova@gmail.com',
        '$2b$12$KYr6tnbk/II/r9JhLIC.3umillwaq4T6qOYjvXB6KSwbNfBcwBqPm',
        'attendee',
        '2026-05-12 14:24:21',
        '2026-05-12 14:24:21'
    ),
    (
        15,
        'v12',
        'cockfiktor@gmail.com',
        '$2b$12$Cx1HbaG9HeGpqfgPU7Gq1eYsgfMaRah4VzQxpTDub1sNe7sE8BQ5G',
        'attendee',
        '2026-05-12 14:25:12',
        '2026-05-12 14:25:12'
    ),
    (
        16,
        'tot',
        'tot581140@gmail.com',
        '$2b$12$uKnH.JN3o0ht60pzKJI6TeNnEPtSU0gImA2eSg2FNQCzeJHAhXRVa',
        'attendee',
        '2026-05-12 14:25:51',
        '2026-05-12 14:25:51'
    );
/*!40000 ALTER TABLE `users` ENABLE KEYS */
;
UNLOCK TABLES;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2026-05-12 16:22:26
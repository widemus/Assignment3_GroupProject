-- MySQL dump 10.13  Distrib 8.0.44, for macos26.2 (arm64)
--
-- Host: localhost    Database: neuracortex
-- ------------------------------------------------------
-- Server version	8.4.8

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('confirmed','cancelled','waitlisted') DEFAULT 'confirmed',
  `booked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_booking` (`event_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,4,'confirmed','2026-05-06 10:29:35'),(2,1,5,'confirmed','2026-05-06 10:29:35'),(3,1,6,'confirmed','2026-05-06 10:29:35'),(4,2,4,'confirmed','2026-05-06 10:29:35'),(5,2,6,'waitlisted','2026-05-06 10:29:35'),(6,3,5,'confirmed','2026-05-06 10:29:35'),(7,4,4,'confirmed','2026-05-06 10:29:35'),(8,4,5,'confirmed','2026-05-06 10:29:35'),(9,5,6,'confirmed','2026-05-06 10:29:35'),(10,6,4,'confirmed','2026-05-06 10:29:35'),(11,6,5,'confirmed','2026-05-06 10:29:35'),(12,7,6,'confirmed','2026-05-06 10:29:35'),(13,8,4,'confirmed','2026-05-06 10:29:35'),(14,8,5,'cancelled','2026-05-06 10:29:35');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text,
  `event_type` enum('webinar','excursion') NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'NEURASYNC™ V3.1 // Live Deployment Briefing','Join our lead architects for a live walkthrough of the NeuraSYNC v3.1 cortical stack — covering latency benchmarks, substrate improvements, and enterprise integration pathways. Q&A included.','webinar','2026-05-13 11:29:35',90,'https://meet.neuracortex.com/neurasync-v3',100,2,'/images/events/neurasync.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(2,'Biomata Architecture — Cortical Mesh Overview','A deep-dive technical session on the biomata layer: how biological neural tissue interfaces with silicon mesh substrates. Intended for engineers and researchers.','webinar','2026-05-20 11:29:35',120,'https://meet.neuracortex.com/biomata-arch',80,2,'/images/events/biomata.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(3,'Lab Excursion // Facility Tour — Singapore Node','An exclusive guided tour of our Singapore compute node. Observe live organoid cultures, substrate fabrication, and the cooling infrastructure that keeps our cortical arrays alive.','excursion','2026-05-27 11:29:35',240,'12 Science Park Drive, Singapore 118224',20,3,'/images/events/singapore.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(4,'Organoid Ethics Symposium // Panel Discussion','A moderated discussion with bioethicists, engineers, and policy advisors on the ethical implications of organoid-based computing. Open to all stakeholders.','webinar','2026-05-16 11:29:35',180,'https://meet.neuracortex.com/ethics-panel',200,3,'/images/events/ethics.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(5,'Substrate Fabrication Workshop — Dublin HQ','Hands-on guided workshop in our Dublin facility. Learn how cortical substrates are grown, tested, and integrated into compute arrays. Limited spots available.','excursion','2026-06-05 11:29:35',300,'NeuraCortex HQ, Grand Canal Dock, Dublin 2',12,2,'/images/events/dublin.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(6,'NeuraSYNC API — Developer Integration Session','For developers integrating with the NeuraSYNC API. We cover authentication, rate limits, data format, and how to interpret cortical output streams in your applications.','webinar','2026-05-11 11:29:35',60,'https://meet.neuracortex.com/api-dev',150,3,'/images/events/api.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(7,'Cortical Array Maintenance — Tokyo Node Visit','A rare opportunity to visit our Tokyo compute node during scheduled maintenance. Observe real-time organoid health monitoring and substrate replacement procedures.','excursion','2026-06-20 11:29:35',360,'3-1 Marunouchi, Chiyoda, Tokyo 100-0005',8,2,'/images/events/tokyo.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35'),(8,'Quarterly Research Update — Q2 2026','NeuraCortex research leads present findings from Q2 2026: new cortical efficiency records, peer-review publications, and roadmap for H2 2026 deployments.','webinar','2026-05-09 11:29:35',90,'https://meet.neuracortex.com/q2-research',500,3,'/images/events/research.jpg','2026-05-06 10:29:35','2026-05-06 10:29:35');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','organiser','attendee') DEFAULT 'attendee',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@neuracortex.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin','2026-05-06 10:29:35','2026-05-06 10:29:35'),(2,'dr_vasquez','vasquez@neuracortex.com','$2a$10$xVBh4e7GF2qNFJ8yJmQXV.kQCGKlLxEBVjCbH0BFuTNLLQMDf9E9W','organiser','2026-05-06 10:29:35','2026-05-06 10:29:35'),(3,'dr_chen','chen@neuracortex.com','$2a$10$3euPcmQFCiblsZeEu6Z7LuGzJpPYVlTJV7K9V0c5XuoaDyoF.oJfm','organiser','2026-05-06 10:29:35','2026-05-06 10:29:35'),(4,'neuronaut1','user1@neuracortex.com','$2a$10$TwlbRGoH4v5lOxDa0Vu3lO5EHhiGKDREL82KRo.vwCimHr7PriGym','attendee','2026-05-06 10:29:35','2026-05-06 10:29:35'),(5,'neuronaut2','user2@neuracortex.com','$2a$10$c5sSBerJoSQ5gLKfI2Oi4.mvJGHiN0VJI/M48cP6g1m5i9ZdJHc.a','attendee','2026-05-06 10:29:35','2026-05-06 10:29:35'),(6,'neuronaut3','user3@neuracortex.com','$2a$10$YkFlFdFNi6LlVp7ZIi5DxetQzNPKFSg4d/hVZ9BJ5WNSSuJ9YhCaS','attendee','2026-05-06 10:29:35','2026-05-06 10:29:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-11  9:25:50

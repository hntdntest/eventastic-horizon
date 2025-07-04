-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: 127.0.0.1    Database: eventomorrow_dev
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `startTime` varchar(255) NOT NULL,
  `endTime` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `speakerIds` text,
  `eventDayId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4cfa6561a3127b224e5c3ff2c1e` (`eventDayId`),
  CONSTRAINT `FK_4cfa6561a3127b224e5c3ff2c1e` FOREIGN KEY (`eventDayId`) REFERENCES `event_days` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES ('08a8c772-b892-4724-bed7-1f10f5f7293b','cbcv','cvbcvb','10:00','11:00','workshop','cvb','speaker-1750752577127,speaker-1750752569535','686f38b8-9bf7-40f1-a29d-37a9e1c10b75'),('1a883e11-c1d1-44cc-ac2d-edca3f7b8039','dfgdfg','dfgdfgfg','09:00','10:00','workshop','dfgdfg','speaker-1750842420434','5a8b1205-4c76-46cc-9624-173a0dc2de63'),('1bff4840-9aa0-4500-b29f-447039868da8','dfgdfg','dfgdfg','09:00','10:00','workshop','dfgdfg','speaker-1750842426150','e14def5b-eb87-46a9-9e74-b2e66f0d90be'),('437a62fe-ba89-4d6f-8662-db00554fe6d1','sdfsdf','sdfsdf','09:00','10:00','meeting','sdfsdf','speaker-1750756884202','29f02d1c-82d4-448f-b6a5-a28fa0278c0f'),('779d187c-b1f4-4229-94f3-07c3638bc979','sdfsdf','sdfsdf','09:00','10:00','workshop','sdfsdf','speaker-1750756879253','8d646acc-5f3a-4c80-9162-56177d0e35c8'),('b3517d52-0c6b-4075-ba40-eaa43d030c43','dfgdfg','dfgdfgfg','09:00','10:00','workshop','dfgdfg','speaker-1750842420434','7f3bd25c-f4e2-4e5b-a190-be62a531f9f0'),('b7f13f5d-b12d-4b1c-81a9-39c1ae154081','dfgdfgfg','dfgdfg','09:00','10:00','meeting','dfgdfg','speaker-1750842431840,speaker-1750842426150','8a407315-2930-4fa6-b6ff-239f3309a66b'),('c85a05e4-04b7-4ccc-bdef-fc345daf0a5b','cvbc','cvbcvb','09:00','10:00','meeting','cvbc','speaker-1750752557703','2350df64-a3af-4a0b-8c9c-37ed2a80e65b'),('d1439dc2-3f83-4ded-9c0a-782b51f7f752','dfgdfgfg','dfgdfg','09:00','10:00','meeting','dfgdfg','speaker-1750842431840,speaker-1750842426150','cd21bf85-46bd-4d03-835c-081662e9eee4'),('d9970d42-feb0-4e88-a25c-29a9f5f16aec','dfgdfg','dfgdfg','09:00','10:00','workshop','dfgdfg','speaker-1750842426150','8169cbfa-3abf-48c8-a1fa-44ff7b7ac0c8'),('e07df3aa-0175-458f-b34b-11f2908a5da1','cbcv','cvbc','09:00','10:00','workshop','cvb','speaker-1750752557703,speaker-1750752569535','686f38b8-9bf7-40f1-a29d-37a9e1c10b75');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;

--
-- Table structure for table `booths`
--

DROP TABLE IF EXISTS `booths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booths` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `coverImageUrl` varchar(255) DEFAULT NULL,
  `eventId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c563a14f5bec5f4219c428d34a4` (`eventId`),
  CONSTRAINT `FK_c563a14f5bec5f4219c428d34a4` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booths`
--

/*!40000 ALTER TABLE `booths` DISABLE KEYS */;
INSERT INTO `booths` VALUES ('1ffb6d6f-3e15-4dc7-a862-c20312627657','cvggdfg','ewrwewr','sdfsdfsdf','sdfsdf','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','e3daa319-ef1b-478a-9700-17d5fecc92db'),('36ec103e-be03-4ba8-a354-38eef508f182','cvbcvb','cbvcvb','cvbvb','cvbcvb','https://images.unsplash.com/photo-1501286353178-1ec881214838','0f536446-710e-47bd-a011-d6cb72e0c543'),('385bb8dc-d68b-4ed7-99ed-be16cb58dcce','sdfsdf','sdfsdf','sdfsdf','sdfsdf','/placeholder.svg','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('4159d998-54d5-43ae-8391-b3fc1449a5aa','sdfsdf','cbvcvb','sdfdf','sdfsdf','/placeholder.svg','edbc6caa-ae9d-4dbb-930e-a02d365f1462'),('5251804a-ce8d-42b8-bb84-aad6c779a412','dfgdfg','dfgdfg','dfgdfg','dfgdfg','/placeholder.svg',NULL),('72d93e1f-179c-4485-9fb4-b686e26205ec','sdfsdf','cbvcvb','sdfdf','sdfsdf','/placeholder.svg',NULL),('917fabcf-c97a-4bc6-99f8-cd2437dacf74','cvggdfg','ewrwewr','sdfsdfsdf','sdfsdf','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('9b3e39e5-3221-4cd1-99f3-36ece407f57e','cvbcvb','cvbcvb','cvbcvb','cvb','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','0f536446-710e-47bd-a011-d6cb72e0c543'),('bb30149a-3186-455e-bb9b-7ac1d6720cb9','sdfsdf','sdfsdf','sdfsdf','sdfsdf','https://images.unsplash.com/photo-1501286353178-1ec881214838','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('fb0c877b-55b4-48a8-bc85-2454db810f7d','dfgdfg','dfgdfg','dfgdfg','dfgdfg','/placeholder.svg','e3daa319-ef1b-478a-9700-17d5fecc92db');
/*!40000 ALTER TABLE `booths` ENABLE KEYS */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `endTime` datetime NOT NULL,
  `startTime` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_01cd2b829e0263917bf570cb672` (`userId`),
  CONSTRAINT `FK_01cd2b829e0263917bf570cb672` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;

--
-- Table structure for table `event_days`
--

DROP TABLE IF EXISTS `event_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_days` (
  `id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `eventId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_784b7b6a6073c93c7681721ee0f` (`eventId`),
  CONSTRAINT `FK_784b7b6a6073c93c7681721ee0f` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_days`
--

/*!40000 ALTER TABLE `event_days` DISABLE KEYS */;
INSERT INTO `event_days` VALUES ('05221183-0c10-4046-884a-3a7b0446dfd7','2025-06-27','00c7485e-a10b-44cc-b756-e7e2f686b945'),('0790ffb2-1714-4bf0-874e-c25bba24d9c6','2025-07-08','5eab8031-88b2-4ecd-a198-1232160faec5'),('07d09901-4b92-495c-b66d-4a3938dc3789','2025-07-04',NULL),('0a0b2184-d300-495f-a491-cb3144eed31e','2025-07-08','b0a072a2-19b3-4c93-a39c-6c02bee63ad7'),('0a9c8506-7e65-4732-b956-35fa6595e11f','2025-06-26',NULL),('0cef680d-5e06-4d67-bea0-79d4a70c4930','2025-07-02','41b2f8d2-2236-40a6-b6f7-6e164c8a2fb6'),('0e6bd75b-032b-4fa8-8c9d-b15876699af7','2025-07-07','b0a072a2-19b3-4c93-a39c-6c02bee63ad7'),('16d6c1f2-7b4f-454f-aaf4-a9a70b08af73','2025-07-04','2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('1a9ff684-3aec-4bbd-a7e9-4418756e45a4','2025-07-05',NULL),('1f5803cd-584b-443a-96d3-1a3a32f018a6','2025-06-27',NULL),('2074bb3c-cf43-4495-b682-ab183d376e1b','2025-06-26',NULL),('2350df64-a3af-4a0b-8c9c-37ed2a80e65b','2025-06-26','0f536446-710e-47bd-a011-d6cb72e0c543'),('23f52e09-a398-457c-bcd5-aea1ebaaf39d','2025-06-26',NULL),('26fedfb4-0a9d-412c-9868-4bddc0108f11','2025-06-26',NULL),('28ff4734-6f93-4b9a-a507-b3e9a09c356e','2025-07-04','7fcdfc66-0e24-4f14-93ae-a153ef87e80f'),('29b15fa7-998d-45c7-ac3e-9a3b4a8ae006','2025-07-05',NULL),('29f02d1c-82d4-448f-b6a5-a28fa0278c0f','2025-06-28','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('2d7aaf75-c58b-4673-9fa2-93c4a4564a74','2025-06-25',NULL),('2eb22e68-15a4-422d-b28c-ec94eafa9753','2025-07-04',NULL),('330811dd-e27a-4441-a520-cd74483f5a88','2025-06-27',NULL),('3c243687-4fc7-473a-8480-3e69b4fb2e7a','2025-06-28',NULL),('3f37baf6-f5ad-49d7-b012-7388bace6436','2025-07-04',NULL),('4588738e-7df8-410b-b907-e030c347c567','2025-06-28',NULL),('476282d3-fee4-49ff-bf3c-7a0ac77efd99','2025-07-05','2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('47ee42de-d4b2-455d-83d8-0053d5d73cc1','2025-07-05',NULL),('48a62bdb-e334-449c-82e4-1a2a1b886e8a','2025-06-25',NULL),('4b39443e-8a1e-4cff-b2a2-f0dbe44d7753','2025-06-25',NULL),('5623eabe-b103-42d8-84e9-c8c95b3a83ea','2025-07-05',NULL),('58c0cc05-c5b7-4610-8429-0cc7d929173c','2025-07-09','5eab8031-88b2-4ecd-a198-1232160faec5'),('5a8b1205-4c76-46cc-9624-173a0dc2de63','2025-06-26','e3daa319-ef1b-478a-9700-17d5fecc92db'),('617a7bd7-6856-4433-b3d6-a5ffb2afb978','2025-06-27',NULL),('65ef776b-0ac4-4099-acc8-a3ba58ccefaa','2025-06-28','00c7485e-a10b-44cc-b756-e7e2f686b945'),('686f38b8-9bf7-40f1-a29d-37a9e1c10b75','2025-06-25','0f536446-710e-47bd-a011-d6cb72e0c543'),('6b89073a-2269-48c3-8e25-cbc78495ee58','2025-06-25','edbc6caa-ae9d-4dbb-930e-a02d365f1462'),('790fce97-951c-49db-ac09-b05cdfd00d10','2025-06-26',NULL),('7f3bd25c-f4e2-4e5b-a190-be62a531f9f0','2025-06-26',NULL),('80b29c07-7504-42dd-9ac4-eeec3a69a8cf','2025-06-27',NULL),('8169cbfa-3abf-48c8-a1fa-44ff7b7ac0c8','2025-06-27','e3daa319-ef1b-478a-9700-17d5fecc92db'),('82ed9a5a-ca28-40c5-aacb-cecbc304cdf7','2025-07-05',NULL),('8393a15d-f8e4-4a99-9da3-0e0103c8438b','2025-07-04',NULL),('892d3096-7a9d-4a6c-bcc3-bf73cadb3361','2025-06-25',NULL),('8a407315-2930-4fa6-b6ff-239f3309a66b','2025-06-28','e3daa319-ef1b-478a-9700-17d5fecc92db'),('8a964466-0387-47cf-8387-95f9c91634eb','2025-06-27',NULL),('8d646acc-5f3a-4c80-9162-56177d0e35c8','2025-06-27','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('9a0a5edd-c157-4143-abd3-c148f13a4a09','2025-06-26','506d5377-6c82-4033-9889-bce48c00eaf3'),('9aad9d83-4f94-4183-9825-7ca686946e8e','2025-07-04',NULL),('9b0cad5a-a9ed-4f39-b72f-a82548611d51','2025-06-27',NULL),('a709a7aa-dbbc-429b-98f8-d25354486094','2025-06-25',NULL),('aa284550-dd37-4356-9a0b-81f86aa5392c','2025-07-01','41b2f8d2-2236-40a6-b6f7-6e164c8a2fb6'),('abc9cadd-27d7-4044-9271-dccaf7ddeaa9','2025-07-05',NULL),('c2c64376-8b2e-42aa-85c0-50e8ef219a90','2025-06-28',NULL),('c8200b68-a764-4f82-b8e0-032fe8e832cb','2025-06-26','edbc6caa-ae9d-4dbb-930e-a02d365f1462'),('ca178e2d-3912-40ea-b2d5-c2ac01bf5cf3','2025-07-05',NULL),('cd21bf85-46bd-4d03-835c-081662e9eee4','2025-06-28',NULL),('d3517177-cb54-49dc-80b4-8d73dcfbbb43','2025-07-05',NULL),('d5cade2e-7e4f-4f43-86a7-b8a0c2da0eee','2025-07-04',NULL),('dacaacc7-afa6-403b-ace6-9d1228140717','2025-06-28',NULL),('dd4837d8-9e86-41d3-ad0d-80e8b2bdf90e','2025-06-26',NULL),('e14def5b-eb87-46a9-9e74-b2e66f0d90be','2025-06-27',NULL),('e1c87de6-2bf1-4683-8246-2a661b76f10a','2025-06-25',NULL),('e785189d-5f85-4519-9c9b-c4cfbc24736a','2025-06-25','506d5377-6c82-4033-9889-bce48c00eaf3'),('e9b9a62f-6e99-4f0e-ae3a-48d68561142b','2025-06-28',NULL),('fb17036a-552f-4c11-8c1e-90c0acd1104e','2025-07-04',NULL),('fcc1322e-9fcd-4b57-b71b-293f065311f2','2025-06-28',NULL),('ff9701f2-1b9b-4c20-b1ec-6444b6488e45','2025-07-04',NULL);
/*!40000 ALTER TABLE `event_days` ENABLE KEYS */;

--
-- Table structure for table `event_types`
--

DROP TABLE IF EXISTS `event_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_types` (
  `id` varchar(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `tabs` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b5856e50c25e4c9db291d0dada` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_types`
--

/*!40000 ALTER TABLE `event_types` DISABLE KEYS */;
INSERT INTO `event_types` VALUES ('0aa0c3d7-6f61-422d-8768-a95ace54fd75','networking','Networking','A networking event.','[\"tickets\",\"schedule\",\"sponsors\"]'),('0c2402c7-02b6-46f0-a611-bdb7908c1967','exhibition','Exhibition','An exhibition or expo event.','[\"tickets\",\"schedule\",\"sponsors\"]'),('5111daad-5079-413a-844d-84487c55c128','music','Music Concert','A live music event.','[\"schedule\",\"sponsors\",\"media\"]'),('537222dc-9fa5-47fb-af0d-e8fb7bc35574','seminar','Seminar','A seminar or educational event.','[\"speakers\",\"schedule\",\"sponsors\",\"media\"]'),('6b2e37cd-dcc5-4f9b-8236-4ca2d47cde21','workshop','Workshop','A hands-on workshop event.','[\"speakers\",\"schedule\",\"sponsors\"]'),('bbc98253-8d4d-442a-bcf6-e18a014c27ad','conference','Conference','A professional conference event.','[\"tickets\",\"speakers\",\"schedule\"]');
/*!40000 ALTER TABLE `event_types` ENABLE KEYS */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `isFreeEvent` tinyint NOT NULL DEFAULT '1',
  `media` text,
  `coverImage` varchar(255) DEFAULT NULL,
  `tabConfig` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES ('00c7485e-a10b-44cc-b756-e7e2f686b945','eeeeeefffffggghhhhhh','eeeeee','Technology','eeeeeeeiiii','2025-06-27','2025-06-28',0,'',NULL,NULL),('0f536446-710e-47bd-a011-d6cb72e0c543','dfgdf','dfgdfg','Technology','dtu','2025-06-25','2025-06-26',1,NULL,NULL,NULL),('2abe278f-2b9f-4419-a3e0-3d2cebad8cf8','Hoang1','sdfsdf','Technology','dfsdfsdf','2025-07-04','2025-07-05',1,'',NULL,NULL),('41b2f8d2-2236-40a6-b6f7-6e164c8a2fb6','dgdfg','dfgdfg','Technology','dgdfg','2025-07-01','2025-07-02',1,'',NULL,NULL),('506d5377-6c82-4033-9889-bce48c00eaf3','aaaaa','aaaaa','Technology','dtu','2025-06-25','2025-06-26',1,NULL,NULL,NULL),('5eab8031-88b2-4ecd-a198-1232160faec5','Hoangnt2','xvxcv','Technology','','2025-07-08','2025-07-09',1,'',NULL,'{\"media\": false, \"tickets\": true, \"schedule\": false, \"speakers\": true, \"sponsors\": false}'),('7fcdfc66-0e24-4f14-93ae-a153ef87e80f','dsfsdf','sfsdfdf','Technology','sfsfd','2025-07-04','2025-07-04',1,'',NULL,NULL),('9f1c0e17-1f42-4a42-868b-b23c49cd6e24','bbbbbbbb','bbbbbbbb','Technology','bbbbbb','2025-06-27','2025-06-28',1,NULL,NULL,NULL),('b0a072a2-19b3-4c93-a39c-6c02bee63ad7','net','cvcxvxv','Technology','','2025-07-07','2025-07-08',1,'',NULL,'{\"media\": false, \"tickets\": true, \"schedule\": true, \"speakers\": false, \"sponsors\": true}'),('c57dd6c6-392e-46b9-a3a6-0a95536cd4eb','Test Event','Sự kiện thử nghiệm','Technology','Hà Nội','2025-07-01','2025-07-02',1,NULL,NULL,NULL),('e3daa319-ef1b-478a-9700-17d5fecc92db','New Event Title1','Updated description','Technology','cccccc','2025-06-26','2025-06-28',0,'',NULL,NULL),('edbc6caa-ae9d-4dbb-930e-a02d365f1462','dfdsf','sdfsdf','Technology','dtu','2025-06-25','2025-06-26',1,'blob:http://localhost:8080/8789a772-381a-40d2-bcc5-b817faa44aac',NULL,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `size` int DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

/*!40000 ALTER TABLE `file` DISABLE KEYS */;
/*!40000 ALTER TABLE `file` ENABLE KEYS */;

--
-- Table structure for table `pass_code`
--

DROP TABLE IF EXISTS `pass_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pass_code` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `pass_code` varchar(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b1528ba0555508cae8b02ff31a` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pass_code`
--

/*!40000 ALTER TABLE `pass_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `pass_code` ENABLE KEYS */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_3d2f174ef04fb312fdebd0ddc5` (`userId`),
  CONSTRAINT `FK_3d2f174ef04fb312fdebd0ddc53` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;

--
-- Table structure for table `speakers`
--

DROP TABLE IF EXISTS `speakers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speakers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `eventId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a2bc40703e109629434a8ee65c1` (`eventId`),
  CONSTRAINT `FK_a2bc40703e109629434a8ee65c1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `speakers`
--

/*!40000 ALTER TABLE `speakers` DISABLE KEYS */;
INSERT INTO `speakers` VALUES ('13517f31-b4d3-4017-9a2e-e5d403dd45cf','sdfsdf','xcvxcfscxv','sdfsdfsdfs','https://images.unsplash.com/photo-1501286353178-1ec881214838','e3daa319-ef1b-478a-9700-17d5fecc92db'),('298c0a14-a9f7-4484-a8f8-30d57e47fa2f','sdfsdf','xcvxcfscxv','sdfsdfsdfs','https://images.unsplash.com/photo-1501286353178-1ec881214838',NULL),('392d7c3f-75e2-440a-9e07-c14096a9fc0b','fgdfg','dfgdfg','dgdfg','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','0f536446-710e-47bd-a011-d6cb72e0c543'),('40497434-409c-4ef7-8107-e29c67f58705','sdfsdf','sdfsdf','sdfsdf','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('42b642fe-abc1-4ed3-8a9f-61c109cc4268','fghfgh','fghfgh','fghfgh','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('72142039-c783-4cd5-8093-d4df91af4543','cbcvb','cvbcvb','cvbcvb','https://images.unsplash.com/photo-1501286353178-1ec881214838','0f536446-710e-47bd-a011-d6cb72e0c543'),('73ea9d5f-3773-4962-a649-da8eadd4819b','sdfsdf','sdfsdfs','sdfsdf','/placeholder.svg','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('7fe01a95-ae85-442f-8b72-0bb04ac2ba80','sdfsdf','sdfdsf','sdfsdfsd','/placeholder.svg','e3daa319-ef1b-478a-9700-17d5fecc92db'),('a561abdb-f880-4de5-bc4b-7d57c9115c67','ccvb','cvbc','cvbcvb','/placeholder.svg','0f536446-710e-47bd-a011-d6cb72e0c543'),('e2104439-85f7-4d9f-852c-50581fc2ea9b','fghfgh','fghfgh','fghfgh','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','e3daa319-ef1b-478a-9700-17d5fecc92db'),('fba27213-52e2-4471-ad48-6c0c853ddf65','sdfsdf','sdfdsf','sdfsdfsd','/placeholder.svg',NULL);
/*!40000 ALTER TABLE `speakers` ENABLE KEYS */;

--
-- Table structure for table `sponsors`
--

DROP TABLE IF EXISTS `sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sponsors` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `level` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logoUrl` varchar(255) DEFAULT NULL,
  `eventId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7623720ac51f2f64c98e09dadaf` (`eventId`),
  CONSTRAINT `FK_7623720ac51f2f64c98e09dadaf` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsors`
--

/*!40000 ALTER TABLE `sponsors` DISABLE KEYS */;
INSERT INTO `sponsors` VALUES ('07148092-1601-439f-9513-ff85f53f77ef','cvbcv','gold','','cvbcvb','/placeholder.svg','0f536446-710e-47bd-a011-d6cb72e0c543'),('0bbd7ff5-c354-4947-949e-5cf6cca3714b','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('13881ca9-da2b-4804-ad8c-190d097adf18','sdfsdf','bbbbbb','','sdfsdf','https://images.unsplash.com/photo-1501286353178-1ec881214838','7fcdfc66-0e24-4f14-93ae-a153ef87e80f'),('1684eb04-426f-41e9-afeb-8322283f6bba','sdfsd','gold','','sdfsdf','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('1d503f39-da43-449f-b6aa-3e4ff9df1b45','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('22fa9e0d-4ccb-4661-bd2b-a7c279bb75d8','vxcxcv','aaaaa','','xcvxcv','https://images.unsplash.com/photo-1501286353178-1ec881214838',NULL),('27c36cf8-c101-48d3-8ab0-a1ccf0c3c8be','cvbhhcvbc','ccccc','','cvbcvbvb','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('456a91cf-2a19-461e-9100-4eb4ec45ba3f','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('460cce2e-4157-456a-a116-ed0e2dd55c1f','cvbhhcvbc','ccccc','','cvbcvbvb','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('48ab9081-cdaf-4266-ad5e-12f3b0707b69','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('48db395c-a783-431f-9117-c933430d41bb','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('5bf7c6b8-2614-4d67-b7b3-0fe2fd889e2a','vxcxcv','aaaaa','','xcvxcv','https://images.unsplash.com/photo-1501286353178-1ec881214838','2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('5f6def06-1c73-42b3-8186-e68156248715','dfdfgfg','gold','','dfgdfgf','/placeholder.svg',NULL),('748254f1-776d-4343-a40a-811a7f270a34','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('754e2cc6-5e1b-43d8-856e-34de0b4911ca','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('80e2b315-9f8d-4ca0-bd8f-c8bb72a0bfa4','cvbhhcvbc','ccccc','','cvbcvbvb','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('83e74052-ba27-49df-ae2f-4ddd73db5bf0','aaa','gold','dfsdf','sdfsdf','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','edbc6caa-ae9d-4dbb-930e-a02d365f1462'),('8f368268-a757-49bb-a425-e77f6ef31ce0','vxcxcv','aaaaa','','xcvxcv','https://images.unsplash.com/photo-1501286353178-1ec881214838',NULL),('99a977b7-9c19-444b-8955-09028bdc0848','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('9e269891-e1a2-4c29-b465-c919fc0af5c7','cvbhhcvbc','ccccc','','cvbcvbvb','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('ac867292-cfde-4974-9ac2-d19fe5e183d9','dfgdfg','gold','','dfgdfgfg','/placeholder.svg',NULL),('af6382d5-9e6b-445f-bcac-776e98bc73a4','cvbhhcvbc','ccccc','','cvbcvbvb','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('afc3fb1c-a189-4063-af2b-d2672e85de02','dfgdfg','gold','','dfgdfgfg','/placeholder.svg','e3daa319-ef1b-478a-9700-17d5fecc92db'),('b5eaec6e-9d1f-4916-8a90-8e447cf31aa0','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('b6ea27c7-2a6e-4c67-b528-c702bdc95332','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('c3d9edfa-f614-427e-8753-6a134ccf0995','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('ca654afd-5bda-4d08-9436-27c13dc3d9c7','cbcvb','gold','','cvbcvb','/placeholder.svg','0f536446-710e-47bd-a011-d6cb72e0c543'),('cb23320e-bccd-4e05-a889-147204bbbeb2','vxcxcv','aaaaa','','xcvxcv','https://images.unsplash.com/photo-1501286353178-1ec881214838',NULL),('cbd20ef6-6523-4f16-8287-86e52ca12861','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('d68a5c4d-c691-4ab2-aa38-1896791cc0eb','dfgdfgdfg','platinum','','dfgdfgdfg','https://images.unsplash.com/photo-1501286353178-1ec881214838',NULL),('d7638b72-5f41-44b1-a48a-7b07289f715d','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('dcb7df17-addc-4e77-b302-28b6563fa270','đfđsfd','Platinum','','sdfsdf','/placeholder.svg',NULL),('dcf90d23-c58e-462f-a175-aa6e7cd23e0c','sdfsdf','gold','','sdfsdf','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('e0a7598a-cd27-487b-8b88-39b65825ab12','dfgdfgdfg','platinum','','dfgdfgdfg','https://images.unsplash.com/photo-1501286353178-1ec881214838','e3daa319-ef1b-478a-9700-17d5fecc92db'),('e81dfaa5-14de-4772-9e9b-088ea6f5ed09','đfđsfd','Platinum','','sdfsdf','/placeholder.svg','2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('f35226fc-ddb6-48f4-a880-94a095218511','dfdfgfg','gold','','dfgdfgf','/placeholder.svg','e3daa319-ef1b-478a-9700-17d5fecc92db'),('f8bd8800-6240-4f4c-aee1-70fbf1a20fac','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('facae4d5-958c-478b-bf5a-a88421b38a31','cdfdfg','Gold','','đfsff','https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',NULL),('fc1ccbc5-80fb-47e8-a446-6be4c22875b2','sfsfsd','aaa','','sdfsdf','/placeholder.svg','7fcdfc66-0e24-4f14-93ae-a153ef87e80f');
/*!40000 ALTER TABLE `sponsors` ENABLE KEYS */;

--
-- Table structure for table `sponsorship_levels`
--

DROP TABLE IF EXISTS `sponsorship_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sponsorship_levels` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `event_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a06a96992bfed15607d5b8bd532` (`event_id`),
  CONSTRAINT `FK_a06a96992bfed15607d5b8bd532` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsorship_levels`
--

/*!40000 ALTER TABLE `sponsorship_levels` DISABLE KEYS */;
INSERT INTO `sponsorship_levels` VALUES ('22784570-ddb6-4a3a-8c0d-97bb11ee2332','Platinum',0,'2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('3427a687-d7b7-4f9c-bb40-789847e3289f','Silver',0,'2abe278f-2b9f-4419-a3e0-3d2cebad8cf8'),('fc52eaf9-1285-4ac2-9094-6ea749d0c6bc','aaa',0,'7fcdfc66-0e24-4f14-93ae-a153ef87e80f'),('ffc4c1ad-747f-438c-a5e4-079df0589413','bbbbbb',0,'7fcdfc66-0e24-4f14-93ae-a153ef87e80f');
/*!40000 ALTER TABLE `sponsorship_levels` ENABLE KEYS */;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

/*!40000 ALTER TABLE `status` DISABLE KEYS */;
/*!40000 ALTER TABLE `status` ENABLE KEYS */;

--
-- Table structure for table `tab_config`
--

DROP TABLE IF EXISTS `tab_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tab_config` (
  `id` varchar(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e636c2681bc8f0b58857ec1edd` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tab_config`
--

/*!40000 ALTER TABLE `tab_config` DISABLE KEYS */;
INSERT INTO `tab_config` VALUES ('3aebea1e-4e32-4acd-9377-ffdc66ba1c7f','media','organizer.tabs.media','organizer.tabs.mediaDesc','Image','bg-pink-500',6,1,'2025-07-03 15:20:13.087000','2025-07-03 15:20:13.087000'),('7e9f7f42-99e7-4c4f-a4df-84dfe57f5069','speakers','organizer.tabs.speakers','organizer.tabs.speakersDesc','Users','bg-purple-500',3,1,'2025-07-03 15:20:13.042000','2025-07-03 15:20:13.042000'),('82d452ce-6e86-4130-8e56-9cc49c9de018','schedule','organizer.tabs.schedule','organizer.tabs.scheduleDesc','Calendar','bg-yellow-500',4,1,'2025-07-03 15:20:13.057000','2025-07-03 15:20:13.057000'),('96e8465d-37a5-44ae-aaa0-e9b00ff92387','sponsors','organizer.tabs.sponsors','organizer.tabs.sponsorsDesc','HandCoins','bg-orange-500',5,1,'2025-07-03 15:20:13.072000','2025-07-03 15:20:13.072000'),('f7bc7c18-77a3-44f0-ba9e-2c2c108be0b2','tickets','organizer.tabs.tickets','organizer.tabs.ticketsDesc','Ticket','bg-green-500',2,1,'2025-07-03 15:20:13.027000','2025-07-03 15:20:13.027000');
/*!40000 ALTER TABLE `tab_config` ENABLE KEYS */;

--
-- Table structure for table `ticket_types`
--

DROP TABLE IF EXISTS `ticket_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_types` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `saleStartDate` date DEFAULT NULL,
  `saleEndDate` date DEFAULT NULL,
  `isEarlyBird` tinyint NOT NULL DEFAULT '0',
  `earlyBirdDiscount` int DEFAULT NULL,
  `isVIP` tinyint NOT NULL DEFAULT '0',
  `category` varchar(255) DEFAULT NULL,
  `eventId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0bf6c025aea56d71d7c0a019f9e` (`eventId`),
  CONSTRAINT `FK_0bf6c025aea56d71d7c0a019f9e` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_types`
--

/*!40000 ALTER TABLE `ticket_types` DISABLE KEYS */;
INSERT INTO `ticket_types` VALUES ('0232fecf-17c3-4b50-b1c0-40d5918b8b32','sdf','sdf',100000.00,100,'2025-06-24','2025-06-26',0,0,0,'General',NULL),('030fad20-0d31-4c97-9380-00bb962d08a9','dfdsfd','sdfsdf',200.00,100,'2025-06-24','2025-06-26',0,0,1,'General',NULL),('0a236aa0-d60c-4f4d-a619-3349534750f4','vbdfgdfg','dfgdfgf',200.00,100,'2025-06-27','2025-06-28',0,0,0,'General',NULL),('198c7965-4c13-4c5b-ac17-c07ac31911f9','sdfsdf','sdfsdf',100000.00,100,'2025-06-27','2025-06-28',0,0,0,'General','00c7485e-a10b-44cc-b756-e7e2f686b945'),('1acf3832-066a-4584-9e7c-622d00d8c3a9','eeeee','eeeee',150.00,100,'2025-06-25','2025-06-28',1,10,0,'General',NULL),('1dace3d2-7c2b-4db7-a05d-f94be5118293','sdf','sdf',100000.00,100,'2025-06-24','2025-06-26',0,0,0,'General',NULL),('21f7ee62-dcbd-4c0a-94a4-1783792bead9','sdf','sdf',100000.00,100,'2025-06-24','2025-06-26',0,0,0,'General',NULL),('2d5ec920-9aba-476f-a2d8-d9188729971c','dfdsfd','sdfsdf',100000.00,100,'2025-06-24','2025-06-26',0,0,1,'General','edbc6caa-ae9d-4dbb-930e-a02d365f1462'),('366a4a5e-dfc5-49b2-a655-e50e08802f8c','sdf','sdf',100000.00,100,'2025-06-24','2025-06-26',0,0,0,'General',NULL),('490167ce-a69e-494e-978c-01de748f0212','sdfsdf','sdfsdf',100.00,100,'2025-06-27','2025-06-28',0,0,0,'General',NULL),('4c9aba6f-c75d-4fc2-aecc-657e85067146','dfdsfd','sdfsdf',100000.00,100,'2025-06-24','2025-06-26',0,0,1,'General',NULL),('51da82a0-9d57-48ec-9d66-0590882e8df7','ccccc','cccc',200.00,100,'2025-06-24','2025-06-28',0,0,1,'General','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('55f44c67-88d1-4bc9-8394-d347f88c83a8','vbdfgdfg','dfgdfgf',100000.00,100,'2025-06-27','2025-06-28',0,0,0,'General','00c7485e-a10b-44cc-b756-e7e2f686b945'),('56df5bdb-7676-475a-aef0-d43da4215187','ddddddd','dddddd',100000.00,100,'2025-06-25','2025-06-28',0,0,1,'General','e3daa319-ef1b-478a-9700-17d5fecc92db'),('5ea130dc-cbe2-4bbb-bcc7-fe3ce12286e4','sdfsdf','sdfsdf',100.00,100,'2025-06-27','2025-06-28',0,0,0,'General',NULL),('69734388-5d36-4fa8-9484-4dd52f74ab43','dfdsfd','sdfsdf',100000.00,100,'2025-06-24','2025-06-26',0,0,1,'General',NULL),('6df6f20a-7f80-4c70-86ee-e4dd0b0d75cf','cccccc','cccccc',100000.00,100,'2025-06-25','2025-06-28',0,0,0,'General','e3daa319-ef1b-478a-9700-17d5fecc92db'),('6ecc292c-2657-45fd-9a1c-e13604fae3b6','sdf','sdf',100.00,100,'2025-06-24','2025-06-26',0,0,0,'General',NULL),('78c62534-bbd4-448c-8fa2-f1f63e4a48a6','cccccc','cccccc',100.00,100,'2025-06-25','2025-06-28',0,0,0,'General',NULL),('91c072ea-8dae-4012-8f18-efd7aa82b11b','bbbbb','bbbbbb',100.00,100,'2025-06-24','2025-06-28',0,0,0,'General','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('960da141-c1e2-46ab-a9da-6636ffcf801c','dfdsfd','sdfsdf',100000.00,100,'2025-06-24','2025-06-26',0,0,1,'General',NULL),('9ef67b47-03ce-4e4e-a3e6-04a3dbdee83e','dddd','ddd',150.00,100,'2025-06-24','2025-06-28',1,0,0,'General','9f1c0e17-1f42-4a42-868b-b23c49cd6e24'),('a995c74e-5486-429c-bc9b-af462c991641','sdf','sdf',100000.00,100,'2025-06-24','2025-06-26',0,0,0,'General','edbc6caa-ae9d-4dbb-930e-a02d365f1462'),('bf9820c2-e25d-46be-8b1e-6c9020520bf0','sdf','sdf',100000.00,100,'2025-06-24','2025-06-26',0,0,0,'General',NULL),('c146b28a-274b-4664-bb46-52d74dde13f7','dfdsfd','sdfsdf',100000.00,100,'2025-06-24','2025-06-26',0,0,1,'General',NULL),('cb7a5b64-80a8-4ae5-b013-85ce19c42ebf','dfdsfd','sdfsdf',100000.00,100,'2025-06-24','2025-06-26',0,0,1,'General',NULL),('edba6fb3-c1f4-4f2e-829d-3246a0e91f6b','ddddddd','dddddd',200.00,100,'2025-06-25','2025-06-28',0,0,1,'General',NULL),('f69086c6-daa9-478a-9c7c-1cf76a8d9c77','eeeee','eeeee',100000.00,100,'2025-06-25','2025-06-28',1,10,0,'General','e3daa319-ef1b-478a-9700-17d5fecc92db');
/*!40000 ALTER TABLE `ticket_types` ENABLE KEYS */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `provider` varchar(255) NOT NULL DEFAULT 'email',
  `socialId` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `photoId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `statusId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  UNIQUE KEY `REL_75e2be4ce11d447ef43be0e374` (`photoId`),
  KEY `IDX_9bd2fe7a8e694dedc4ec2f666f` (`socialId`),
  KEY `IDX_58e4dbff0e1a32a9bdc861bb29` (`firstName`),
  KEY `IDX_f0e1b4ecdca13b177e2e3a0613` (`lastName`),
  KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  KEY `FK_dc18daa696860586ba4667a9d31` (`statusId`),
  CONSTRAINT `FK_75e2be4ce11d447ef43be0e374f` FOREIGN KEY (`photoId`) REFERENCES `file` (`id`),
  CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
  CONSTRAINT `FK_dc18daa696860586ba4667a9d31` FOREIGN KEY (`statusId`) REFERENCES `status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

--
-- Dumping routines for database 'eventomorrow_dev'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-04 14:36:17

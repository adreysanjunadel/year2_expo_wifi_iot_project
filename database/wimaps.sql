-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.36 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for wimaps
CREATE DATABASE IF NOT EXISTS `wimaps` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wimaps`;

-- Dumping structure for table wimaps.encryption_type
CREATE TABLE IF NOT EXISTS `encryption_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table wimaps.encryption_type: ~9 rows (approximately)
INSERT IGNORE INTO `encryption_type` (`id`, `name`) VALUES
	(1, 'Open'),
	(2, 'WEP'),
	(3, 'WPA/PSK'),
	(4, 'WPA2/PSK'),
	(5, 'WPA/WPA2/PSK'),
	(6, 'WPA2/Enterprise'),
	(7, 'WPA3/PSK'),
	(8, 'WPA3/Enterprise'),
	(9, 'Unknown');

-- Dumping structure for table wimaps.log_data
CREATE TABLE IF NOT EXISTS `log_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table wimaps.log_data: ~2 rows (approximately)
INSERT IGNORE INTO `log_data` (`id`, `date_time`) VALUES
	(1, '2025-01-04 10:56:13'),
	(2, '2025-01-04 10:58:04');

-- Dumping structure for table wimaps.log_data_has_router_data
CREATE TABLE IF NOT EXISTS `log_data_has_router_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_data_id` int NOT NULL,
  `router_data_id` int NOT NULL,
  PRIMARY KEY (`id`,`log_data_id`,`router_data_id`),
  KEY `fk_log_data_has_router_data_router_data1_idx` (`router_data_id`),
  KEY `fk_log_data_has_router_data_log_data1_idx` (`log_data_id`),
  CONSTRAINT `fk_log_data_has_router_data_log_data1` FOREIGN KEY (`log_data_id`) REFERENCES `log_data` (`id`),
  CONSTRAINT `fk_log_data_has_router_data_router_data1` FOREIGN KEY (`router_data_id`) REFERENCES `router_data` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table wimaps.log_data_has_router_data: ~66 rows (approximately)
INSERT IGNORE INTO `log_data_has_router_data` (`id`, `log_data_id`, `router_data_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 1, 3),
	(4, 1, 4),
	(5, 1, 5),
	(6, 1, 6),
	(7, 1, 7),
	(8, 1, 8),
	(9, 1, 9),
	(10, 1, 10),
	(11, 1, 11),
	(12, 1, 12),
	(13, 1, 13),
	(14, 1, 14),
	(15, 1, 15),
	(16, 1, 16),
	(17, 1, 17),
	(18, 1, 18),
	(19, 1, 19),
	(20, 1, 20),
	(21, 1, 21),
	(22, 1, 22),
	(23, 1, 23),
	(24, 1, 24),
	(25, 1, 25),
	(26, 1, 26),
	(27, 1, 27),
	(28, 1, 28),
	(29, 1, 29),
	(30, 1, 30),
	(31, 1, 31),
	(32, 2, 32),
	(33, 2, 33),
	(34, 2, 34),
	(35, 2, 35),
	(36, 2, 36),
	(37, 2, 37),
	(38, 2, 38),
	(39, 2, 39),
	(40, 2, 40),
	(41, 2, 41),
	(42, 2, 42),
	(43, 2, 43),
	(44, 2, 44),
	(45, 2, 45),
	(46, 2, 46),
	(47, 2, 47),
	(48, 2, 48),
	(49, 2, 49),
	(50, 2, 50),
	(51, 2, 51),
	(52, 2, 52),
	(53, 2, 53),
	(54, 2, 54),
	(55, 2, 55),
	(56, 2, 56),
	(57, 2, 57),
	(58, 2, 58),
	(59, 2, 59),
	(60, 2, 60),
	(61, 2, 61),
	(62, 2, 62),
	(63, 2, 63),
	(64, 2, 64),
	(65, 2, 65),
	(66, 2, 66);

-- Dumping structure for table wimaps.router_data
CREATE TABLE IF NOT EXISTS `router_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ssid` varchar(32) NOT NULL,
  `rssi` int NOT NULL,
  `channel` int NOT NULL,
  `bssid` varchar(17) NOT NULL,
  `encryption_type_id` int NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_router_encrypton_types_idx` (`encryption_type_id`),
  CONSTRAINT `fk_router_encrypton_types` FOREIGN KEY (`encryption_type_id`) REFERENCES `encryption_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table wimaps.router_data: ~66 rows (approximately)
INSERT IGNORE INTO `router_data` (`id`, `ssid`, `rssi`, `channel`, `bssid`, `encryption_type_id`, `latitude`, `longitude`) VALUES
	(1, 'Sanjuna', -45, 1, '76:CB:90:8E:A0:F4', 4, 0, 0),
	(2, 'Dialog 4G 138', -56, 7, '98:A9:42:81:F0:8A', 4, 0, 0),
	(3, 'Dialog 4G 627', -73, 10, 'D8:D8:66:0B:9E:2B', 4, 0, 0),
	(4, 'Galaxy M12 3834', -75, 1, 'BE:16:55:DC:FB:19', 4, 0, 0),
	(5, 'Dialog 4G 495', -77, 7, 'D8:D8:66:0F:1D:A7', 4, 0, 0),
	(6, 'AndroidAP_6567', -78, 6, 'BA:3D:1E:5F:18:56', 9, 0, 0),
	(7, 'Dialog 4G 891', -78, 9, '98:A9:42:0F:F7:63', 4, 0, 0),
	(8, 'Galaxy A12 2C72', -80, 1, '0A:71:99:05:79:AE', 4, 0, 0),
	(9, 'Galaxy A10s4afe', -80, 6, '32:EF:73:4E:15:F8', 4, 0, 0),
	(10, 'Rusindu-M12', -80, 11, 'E6:17:B1:B6:CF:47', 4, 0, 0),
	(11, 'Redmi Note 12', -83, 11, '3A:D4:92:F4:38:1A', 4, 0, 0),
	(12, 'pocket router', -84, 6, '9A:80:BB:96:EC:12', 4, 0, 0),
	(13, 'Dialog 4G 657', -84, 11, '00:E0:4C:1A:7A:61', 4, 0, 0),
	(14, 'CR7', -85, 1, '1A:1F:73:E5:22:5F', 4, 0, 0),
	(15, 'Redmi 9', -86, 1, '76:6D:ED:EC:BB:BB', 4, 0, 0),
	(16, 'PRAVEEN_MAX_007', -86, 6, '7E:9F:F2:35:8C:AD', 4, 0, 0),
	(17, 'DIRECT-QWLAPTOP-A1O6EFVKmsXH', -86, 11, 'FE:89:D2:52:68:BB', 4, 0, 0),
	(18, 'Redmi13C', -86, 12, '16:E3:10:13:36:5B', 4, 0, 0),
	(19, 'Tare', -87, 1, '2C:A9:F0:CB:A5:B3', 4, 0, 0),
	(20, 'Prolink_PRT7011L_5C0AA', -87, 2, '90:61:0C:A5:C0:AA', 4, 0, 0),
	(21, 'Isuru\'s Pixel', -87, 11, 'DE:1C:B8:4E:C9:91', 4, 0, 0),
	(22, 'Redmi Note 11', -88, 1, '42:95:27:23:5F:30', 4, 0, 0),
	(23, 'Imesh', -88, 1, 'AE:9E:A2:AF:EF:0C', 4, 0, 0),
	(24, 'Redmi 12C', -88, 12, '1E:A9:8B:6F:A1:1C', 4, 0, 0),
	(25, 'Afran', -89, 6, 'C6:BA:35:6D:C1:6B', 9, 0, 0),
	(26, 'HUAWEI Y6s', -89, 6, '26:6F:8C:47:7E:C1', 4, 0, 0),
	(27, 'Galaxy M110374', -90, 1, '3A:48:D2:C2:F8:AD', 4, 0, 0),
	(28, 'Redmi_12', -90, 12, 'FA:0C:FE:3F:27:67', 4, 0, 0),
	(29, 'Redmi 13C', -92, 12, '22:5A:33:AC:91:EF', 4, 0, 0),
	(30, 'Kanishka', -94, 11, 'FE:AA:B6:78:5E:6E', 4, 0, 0),
	(31, 'TECNO', -95, 1, '56:C5:68:2C:0F:C5', 4, 0, 0),
	(32, 'Sanjuna', -50, 1, '76:CB:90:8E:A0:F4', 4, 0, 0),
	(33, 'Dialog 4G 138', -68, 7, '98:A9:42:81:F0:8A', 4, 0, 0),
	(34, 'Dialog 4G 627', -68, 10, 'D8:D8:66:0B:9E:2B', 4, 0, 0),
	(35, 'Galaxy M12 3834', -71, 1, 'BE:16:55:DC:FB:19', 4, 0, 0),
	(36, 'Dialog 4G 891', -74, 9, '98:A9:42:0F:F7:63', 4, 0, 0),
	(37, 'Redmi Note 12', -75, 11, '3A:D4:92:F4:38:1A', 4, 0, 0),
	(38, 'Galaxy A12 2C72', -78, 1, '0A:71:99:05:79:AE', 4, 0, 0),
	(39, 'Redmi13C', -78, 12, '16:E3:10:13:36:5B', 4, 0, 0),
	(40, 'Redmi 9', -81, 1, '76:6D:ED:EC:BB:BB', 4, 0, 0),
	(41, 'HUAWEI Y6s', -81, 6, '26:6F:8C:47:7E:C1', 4, 0, 0),
	(42, 'CR7', -82, 1, '1A:1F:73:E5:22:5F', 4, 0, 0),
	(43, 'PRAVEEN_MAX_007', -82, 6, '7E:9F:F2:35:8C:AD', 4, 0, 0),
	(44, 'Dialog 4G 495', -83, 7, 'D8:D8:66:0F:1D:A7', 4, 0, 0),
	(45, 'Rusindu-M12', -83, 11, 'E6:17:B1:B6:CF:47', 4, 0, 0),
	(46, 'Galaxy M110374', -84, 1, '3A:48:D2:C2:F8:AD', 4, 0, 0),
	(47, 'Imesh', -84, 1, 'AE:9E:A2:AF:EF:0C', 4, 0, 0),
	(48, 'SLT-4G_161E87', -84, 5, '98:A9:42:16:1E:87', 4, 0, 0),
	(49, 'pocket router', -84, 6, '9A:80:BB:96:EC:12', 4, 0, 0),
	(50, 'Redmi Note 11', -85, 1, '42:95:27:23:5F:30', 4, 0, 0),
	(51, 'X-Factor', -85, 6, '5C:A0:00:E2:0E:76', 4, 0, 0),
	(52, 'Redmi_12', -85, 12, 'FA:0C:FE:3F:27:67', 4, 0, 0),
	(53, 'A22', -86, 6, 'FA:EA:C6:39:7D:9A', 4, 0, 0),
	(54, 'Kanishka', -86, 11, 'FE:AA:B6:78:5E:6E', 4, 0, 0),
	(55, 'HUAWEI-3FC5', -86, 11, '20:54:FA:31:3F:C5', 4, 0, 0),
	(56, 'Dialog 4G 657', -87, 11, '00:E0:4C:1A:7A:61', 4, 0, 0),
	(57, 'Tare', -88, 1, '2C:A9:F0:CB:A5:B3', 4, 0, 0),
	(58, 'Galaxy A10s4afe', -88, 6, '32:EF:73:4E:15:F8', 4, 0, 0),
	(59, 'AndroidAP_6567', -89, 6, 'BA:3D:1E:5F:18:56', 9, 0, 0),
	(60, 'Isuru\'s Pixel', -91, 11, 'DE:1C:B8:4E:C9:91', 4, 0, 0),
	(61, 'Redmi 12C', -91, 12, '1E:A9:8B:6F:A1:1C', 4, 0, 0),
	(62, 'ZTE Blade V50 Design', -93, 5, '0E:C0:14:2C:89:6F', 4, 0, 0),
	(63, 'ZTE', -93, 9, '26:8E:8A:20:6D:10', 4, 0, 0),
	(64, 'DIRECT-QWLAPTOP-A1O6EFVKmsXH', -93, 11, 'FE:89:D2:52:68:BB', 4, 0, 0),
	(65, 'Galaxy A21s436E', -95, 11, '12:95:EE:0C:50:BA', 4, 0, 0),
	(66, 'SK', -95, 11, 'EA:90:3A:38:AA:89', 4, 0, 0);

-- Dumping structure for table wimaps.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `mobile` varchar(14) NOT NULL,
  `email` varchar(50) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `reg_date_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mobile_UNIQUE` (`mobile`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table wimaps.user: ~0 rows (approximately)
INSERT IGNORE INTO `user` (`id`, `first_name`, `last_name`, `mobile`, `email`, `otp`, `reg_date_time`) VALUES
	(2, 'Sanjuna', 'Delpitiya', '0720243888', 'sanjunadelpitiya1@gmail.com', NULL, '2024-12-20 00:00:00'),
	(3, 'Ashen', 'Lalantha', '0712345678', 'sanjunadelpitiya@gmail.com', NULL, '2024-12-21 00:00:00'),
	(4, 'Shevaan', 'Delpitiya', '0767662050', 'triaxlegaming@gmail.com', NULL, '2024-12-31 00:00:00');

-- Dumping structure for table wimaps.user_has_log_data
CREATE TABLE IF NOT EXISTS `user_has_log_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `log_data_id` int NOT NULL,
  PRIMARY KEY (`id`,`user_id`,`log_data_id`),
  KEY `fk_user_has_log_data_log_data1_idx` (`log_data_id`),
  KEY `fk_user_has_log_data_user1_idx` (`user_id`),
  CONSTRAINT `fk_user_has_log_data_log_data1` FOREIGN KEY (`log_data_id`) REFERENCES `log_data` (`id`),
  CONSTRAINT `fk_user_has_log_data_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table wimaps.user_has_log_data: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

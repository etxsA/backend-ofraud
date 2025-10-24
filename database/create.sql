-- Crear DB
CREATE DATABASE IF NOT EXISTS oFraud;
USE oFraud

-- Delete DB
-- Drop DATABASE oFraud; 

-- Tabla Users
CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `salt` VARCHAR(10),
  `creation_date` DATE NOT NULL DEFAULT (CURRENT_DATE()),
  `profile_pic_url` VARCHAR(500),
  `admin` bool,
  `update_date` DATE DEFAULT NULL,
  `deleted_at` DATE NULL DEFAULT NULL
);

-- ALTER TABLE `user` add COLUMN ( `deleted_at`DATE NULL DEFAULT NULL);

-- Sample insertions, all password: pass123
INSERT INTO `user` (`id`, `name`, `email`, `password`, `salt`, `creation_date`, `profile_pic_url`, `admin`, `update_date`) VALUES
(1,'Admin User','admin@ofraud.com','4c4326c81833c95896022b7103456a3de1130250cb874fe74d1a493eae809190','salt','2025-01-10','https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/12/star-wars-general-leia-organa-2180815.jpg?tf=3840x',1,NULL),
(2,'Sofia Reyes','sofia.r@example.com','4c4326c81833c95896022b7103456a3de1130250cb874fe74d1a493eae809190','salt','2025-02-15','https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',0,NULL),
(3,'Carlos Luna','carlos.l@example.com','4c4326c81833c95896022b7103456a3de1130250cb874fe74d1a493eae809190','salt','2025-03-20','https://i.redd.it/zw0i302m0luc1.jpeg',0,NULL),
(4,'Ana Torres','ana.t@example.com','4c4326c81833c95896022b7103456a3de1130250cb874fe74d1a493eae809190','salt','2025-04-05','https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80',0,NULL),
(5,'Javier Morales','javier.m@example.com','4c4326c81833c95896022b7103456a3de1130250cb874fe74d1a493eae809190','salt','2025-05-12','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMPKiDv-LAivr767syH_3mERkHi1D_d_L6XQ&s',0,NULL);
UPDATE `user` SET admin=true WHERE id = 1; -- Set user 1 as admin. 

-- Tabla Categories
	CREATE TABLE `category` (
	  `id` INT PRIMARY KEY AUTO_INCREMENT,
	  `name` VARCHAR(30) NOT NULL,
	  `icon` VARCHAR(200),
	  `description` VARCHAR(512),
	  `deleted_at` DATE NULL DEFAULT NULL

	);
	
INSERT INTO `category` (`id`, `name`, `icon`, `description`) VALUES
(1, 'Compras', 'cart.badge.questionmark', 'Reportes de fraudes relacionados con compras en línea o físicas. Incluye casos donde se realizaron cargos no autorizados, productos que nunca llegaron, o tiendas que resultaron ser falsas o engañosas.'),
(2, 'Phishing', 'envelope.badge.shield.half.filled', 'Intentos de engaño mediante correos electrónicos, mensajes de texto o llamadas telefónicas que suplantan la identidad de entidades confiables para obtener información personal, contraseñas o datos bancarios.'),
(3, 'Apps', 'app.badge.checkmark', 'Aplicaciones móviles o de escritorio que simulan ser legítimas pero que contienen malware, solicitan permisos innecesarios o realizan cobros no autorizados. También incluye apps falsas que imitan servicios conocidos.'),
(4, 'Bancos', 'banknote.fill', 'Estafas vinculadas a instituciones bancarias o financieras. Puede tratarse de llamadas fraudulentas, páginas web falsas de bancos o mensajes que buscan robar credenciales o acceder a cuentas bancarias.'),
(5, 'Redes', 'person.2.slash.fill', 'Casos de fraude cometidos a través de redes sociales o plataformas de mensajería. Incluye suplantación de perfiles, mensajes engañosos de conocidos, y fraudes en grupos o comunidades digitales.'),
(6, 'Inversión', 'chart.line.downtrend.xyaxis', 'Esquemas fraudulentos que prometen grandes ganancias con inversiones mínimas. Incluye estafas con criptomonedas, pirámides financieras, o plataformas de inversión que desaparecen tras recibir dinero.'),
(7, 'Viajes', 'airplane.path.dotted', 'Estafas relacionadas con paquetes turísticos falsos, reservas inexistentes o agencias de viaje fraudulentas. También abarca casos de promociones engañosas para vuelos, hoteles o alquiler de autos.'),
(8, 'Identidad', 'person.crop.circle.badge.exclamationmark', 'Situaciones donde una persona ha sido víctima de robo de identidad. Puede incluir el uso indebido de datos personales para abrir cuentas, realizar compras, solicitar créditos u otros actos fraudulentos.'),
(999, 'Otra', 'questionmark.circle', 'Reportes de fraudes o estafas que no encajan en ninguna de las categorías anteriores. Puede tratarse de nuevos métodos de engaño o situaciones poco comunes que requieren análisis adicional.');

-- Tabla Status
CREATE TABLE `status` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL
);

INSERT INTO `status` (`id`,`name`) VALUES 
(1, 'Submited'),
(2, 'Rejected'),
(3, 'Accepted');

-- Tabla Reports
CREATE TABLE `report` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `description` VARCHAR(550) NOT NULL,
  `report_pic_url` VARCHAR(500) NOT NULL,
  `category_id` INT,
  `user_id` INT NOT NULL,
  `reference_url` VARCHAR(120) NOT NULL,
  `creation_date` DATE NOT NULL,
  `status_id` INT NOT NULL,
  `deleted_at` DATE NULL DEFAULT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
);

INSERT INTO `report` (`id`, `title`, `description`, `report_pic_url`, `category_id`, `user_id`, `reference_url`, `creation_date`, `status_id`) VALUES
(1, 'Tienda electrónica falsa', 'Ofrecía laptops a precios muy bajos. Los clientes nunca recibieron los productos.', 'https://images-wixmp-530a50041672c69d335ba4cf.wixmp.com/templates/image/34041b678f8322dd95446ca0e0ee3d4caebb59008a7aa3f8922a8461c268fe6d1617888011678.jpg', 1, 1, 'https://www.alertafraude.mx/reportes/1001', '2025-10-03', 1),
(2, 'Correo de phishing bancario', 'Usuarios recibieron correos que simulaban ser de un banco, solicitando datos de acceso.', 'https://mbluxury1.s3.amazonaws.com/2020/07/14065242/BankWAW-website-design.jpg', 2, 2, 'https://www.alertafraude.mx/reportes/1002', '2025-10-04', 1),
(3, 'App de descuentos fraudulentos', 'Una aplicación prometía grandes descuentos, pero robaba datos bancarios.', 'https://www.templateshub.net/uploads/1570009401%20CouponDay%20Clean%20Premium%20Coupon%20Template.jpg', 3, 3, 'https://www.alertafraude.mx/reportes/1003', '2025-10-05', 1),
(4, 'Falsos créditos inmediatos', 'Un sitio pedía depósitos por \'gastos de gestión\' y nunca otorgaba el crédito.', 'https://themewagon.com/wp-content/uploads/2020/11/credit-1.jpg', 4, 4, 'https://www.alertafraude.mx/reportes/1004', '2025-10-06', 1),
(5, 'Perfil falso en redes sociales', 'Cuentas se hacían pasar por celebridades para pedir dinero a seguidores.', 'https://miro.medium.com/v2/resize:fit:1400/0*sVJDL0GdqXDxzynj.jpg', 5, 1, 'https://www.alertafraude.mx/reportes/1005', '2025-10-07', 1),
(6, 'Inversión en criptomonedas inexistentes', 'Un sitio ofrecía inversiones en criptomonedas que no existían.', 'https://themewagon.com/wp-content/uploads/2020/11/crypto-1.jpg', 6, 2, 'https://www.alertafraude.mx/reportes/1006', '2025-10-08', 1),
(7, 'Publicidad de viajes falsos', 'Promocionaban viajes todo incluido a mitad de precio. Nunca se confirmaron boletos.', 'https://mbluxury1.s3.amazonaws.com/2024/06/25074513/Travel-Website-Design-Tour-Radar.jpg', 7, 3, 'https://www.alertafraude.mx/reportes/1007', '2025-10-09', 1),
(8, 'Venta de consolas inexistentes', 'Prometían entregas inmediatas de consolas en preventa, pero nunca se enviaron.', 'https://static.vecteezy.com/system/resources/previews/009/521/560/non_2x/online-gaming-concept-website-landing-page-with-game-console-free-illustration-background-free-vector.jpg', 1, 4, 'https://www.alertafraude.mx/reportes/1008', '2025-10-10', 1),
(9, 'Correo con archivo sospechoso', 'Un correo con un supuesto recibo contenía un archivo malicioso.', 'https://www.lifewire.com/thmb/GYpSjFecUJX2Ktls5ZCKPIDvc_g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gmail-select-insert-link-2681bddad62a4b34afe7c732995bd003.jpg', 2, 1, 'https://www.alertafraude.mx/reportes/1009', '2025-10-11', 1),
(10, 'Suplantación de identidad en trámites', 'Un portal imitaba páginas de gobierno para robar datos personales.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4y9X3Kv9wa0Biax50gBdST0EwkhQPZQG6ow&s', 8, 2, 'https://www.alertafraude.mx/reportes/1010', '2025-10-12', 1);

-- Tabla Likes
CREATE TABLE `like` (
  `user_id` INT NOT NULL,
  `report_id` INT NOT NULL,
  `creation_date` DATE NOT NULL DEFAULT (CURRENT_DATE()),
  PRIMARY KEY (`user_id`, `report_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  FOREIGN KEY (`report_id`) REFERENCES `report` (`id`)
);

INSERT INTO `like` (`user_id`, `report_id`, `creation_date`) VALUES
(1,1,'2025-09-01'),(1,2,'2025-09-02'),
(2,4,'2025-09-03'),(2,5,'2025-09-04'),
(3,1,'2025-09-05'),(3,6,'2025-09-06'),
(4,1,'2025-09-07'),(4,7,'2025-09-08'),
(5,2,'2025-09-09'),(5,8,'2025-09-10');

-- Updated Table for Comments 
CREATE TABLE `comment` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `content` VARCHAR(512) NOT NULL, 
  `user_id` INT NOT NULL,
  `report_id` INT NOT NULL,
  `parent_comment_id` INT NULL DEFAULT NULL, 
  `creation_date` DATE NOT NULL DEFAULT (CURRENT_DATE()),
  `deleted_at` DATE NULL DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  FOREIGN KEY (`report_id`) REFERENCES `report` (`id`),
  FOREIGN KEY (`parent_comment_id`) REFERENCES `comment` (`id`) 
);

INSERT INTO `comment` (`id`, `content`, `user_id`, `report_id`, `parent_comment_id`, `creation_date`) VALUES
(1,'I received the exact same email! Thanks for posting, it confirms it\'s a widespread scam.',3,1,NULL,'2025-08-11'),
(2,'Did you report the email to Netflix directly? They have a department for this.',4,1,1,'2025-08-11'),
(3,'Yes, I forwarded the email to their phishing report address. Everyone should do the same.',2,1,2,'2025-08-12'),
(4,'I almost fell for this one a few months ago. The website looks very convincing.',5,1,NULL,'2025-08-13'),
(5,'My friend lost $500 to this GadgetGalaxy site. It needs to be taken down.',5,2,NULL,'2025-08-13'),
(6,'Has anyone reported it to the authorities or the domain registrar?',5,2,5,'2025-08-14'),
(7,'I filed a complaint with the FTC. Not sure if it will do anything, but it\'s worth a shot.',3,2,6,'2025-08-15'),
(8,'These crypto scams are everywhere. A good rule of thumb: if it sounds too good to be true, it is.',5,3,NULL,'2025-08-16'),
(9,'That is absolutely correct. There is no such thing as a guaranteed high return.',1,3,8,'2025-08-17'),
(10,'Thanks for the warning. I just got a similar call but they claimed to be from Amazon Support.',2,4,NULL,'2025-08-21'),
(11,'Never, ever let a stranger install software on your computer.',1,4,5,'2025-08-21'),
(12,'I was also scammed by a fake job offer. They got my personal details but thankfully no money.',5,5,NULL,'2025-09-02'),
(13,'It is so sad that people prey on those looking for romance.',5,6,NULL,'2025-09-06'),
(14,'This is a very common technique. The emotional manipulation is the key part of the scam.',1,6,5,'2025-09-07'),
(15,'What was the misspelled domain? It helps others to know what to look for.',5,10,NULL,'2025-10-11'),
(16,'It was `mybannk-security.com` instead of `mybank-security.com`. The double \'n\' is easy to miss.',1,10,5,'2025-10-12');


-- Comment likes
CREATE TABLE `comment_like` (
  `user_id` INT NOT NULL,
  `comment_id` INT NOT NULL,
  `creation_date` DATE NOT NULL DEFAULT (CURRENT_DATE()), 
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE
);

INSERT INTO `comment_like` (`user_id`, `comment_id`, `creation_date`) VALUES
(1,3,'2025-09-15'),(1,9,'2025-09-16'),
(2,1,'2025-09-17'),(2,8,'2025-09-18'),
(3,2,'2025-09-19'),(3,10,'2025-09-20'),
(4,5,'2025-09-21'),(4,10,'2025-09-22'),
(5,6,'2025-09-23'),(5,10,'2025-09-24'),
(2,1,'2025-09-25'),(4,8,'2025-09-26');


-- User Creation 
DROP USER IF EXISTS 'access1'@'localhost';
CREATE USER 'access1'@'localhost' IDENTIFIED BY 'access1-p';
GRANT SELECT, INSERT, UPDATE, DELETE ON `oFraud`.* TO 'access1'@'localhost';


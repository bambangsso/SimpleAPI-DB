CREATE DATABASE IF NOT EXISTS simpleapi_db;
GRANT ALL PRIVILEGES on simpleapi_db.* TO 'bjtech'@'%' IDENTIFIED BY 'fhouse' WITH GRANT OPTION;
USE simpleapi_db;
CREATE TABLE IF NOT EXISTS post (user varchar(40), message varchar(100));
INSERT INTO post VALUES ('elina', 'besok lomba agustusan di taman');
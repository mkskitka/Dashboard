CREATE USER IF NOT EXISTS 'processuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON process.* TO 'processuser'@'localhost' WITH GRANT OPTION;
CREATE USER IF NOT EXISTS 'processuser'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON process.* TO 'processuser'@'%' WITH GRANT OPTION;

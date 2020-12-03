@echo off


set DIR=%~dp0

echo Creating "process" database
mysql -u root -p < create-database.sql 

echo Creating "process" DB user
mysql -u root -p < create-user.sql

echo Creating example table
mysql -u root -p < example.sql

echo Done.

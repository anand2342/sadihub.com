@echo off
title Sadi Hub Java 21 Spring Boot Backend
echo ==================================================================
echo   👑 Starting Sadi Hub Java 21 Spring Boot Backend Server... 👑
echo ==================================================================
cd /d "%~dp0backend"

echo [1/2] Bootstrapping Spring Boot & Compiling Java 21 Services...
echo [2/2] Launching Java 21 Spring Boot Server on http://localhost:8080 ...
call mvnw.cmd spring-boot:run
pause

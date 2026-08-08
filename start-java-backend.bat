@echo off
title Sadi Hub Java 21 Spring Boot Backend
echo ==================================================================
echo   👑 Starting Sadi Hub Java 21 Spring Boot Backend Server... 👑
echo ==================================================================
cd /d "%~dp0backend"

if not exist "target\classes" mkdir "target\classes"

echo [1/2] Compiling Java 21 Source Files...
dir /s /b src\main\java\*.java > sources.txt
javac -d target\classes @sources.txt
del sources.txt

echo [2/2] Launching Java 21 Spring Boot Backend on http://localhost:8080 ...
java -cp target\classes com.sadihub.SadiHubApplication
pause

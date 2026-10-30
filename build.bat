@echo off
echo ========================================================
echo Building Full-Stack Teacher Management System
echo ========================================================

echo [1/2] Building React Frontend with Vite...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    exit /b %errorlevel%
)
cd ..

echo [2/2] Packaging Spring Boot Application with Maven...
cd Teacher
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo Backend packaging failed!
    exit /b %errorlevel%
)
cd ..

echo ========================================================
echo Build Complete! Merged JAR generated at:
echo Teacher\target\Teacher-0.0.1-SNAPSHOT.jar
echo ========================================================

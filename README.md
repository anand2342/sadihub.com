# 👑 Sadi Hub (sadihub.com) - Enterprise Full-Stack Monorepo

Welcome to **Sadi Hub (`sadihub.com`)**, a modern, high-performance wedding portal built using a decoupled **Java 21 Spring Boot 3.x REST API Backend** and a **React 19 + Vite + Tailwind CSS Frontend**.

---

## 📁 Repository Directory Structure

```
Weeding_Portel/
├── 📁 backend/                # Java 21 Spring Boot 3.x REST API Server
│   ├── pom.xml                # Maven Dependencies
│   └── src/main/java/com/sadihub/
│       ├── SadiHubApplication.java
│       ├── config/            # Spring Security + JWT Configuration
│       ├── controller/        # REST API Controllers (Auth, Events, Photos, Wishes)
│       ├── entity/            # JPA Hibernate Relational Entities
│       └── repository/        # Spring Data JPA Repositories
│
├── 📁 frontend/               # React 19 + TypeScript + Vite Web Portal UI
│   ├── src/                   # React Components, Pages, & Java API Client (javaApi.ts)
│   ├── public/                # Static Media Assets
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 supabase/               # PostgreSQL Schema SQL & Migrations
├── 🚀 start-java-backend.bat  # 1-Click Launch Script for Java Backend (Port 8080)
├── 🚀 start-frontend.bat      # 1-Click Launch Script for Frontend Web Portal (Port 5173)
└── 📄 README.md
```

---

## 🚀 How to Run the Project

### 1. Launch Java 21 Backend (Port 8080)
Double click `start-java-backend.bat` or run:
```cmd
start-java-backend.bat
```
- Server URL: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`

### 2. Launch React Frontend (Port 5173)
Double click `start-frontend.bat` or run:
```cmd
start-frontend.bat
```
- Web Portal URL: `http://localhost:5173`

---

## 🛠️ Technology Stack
- **Backend API**: Java 21 LTS + Spring Boot 3.2.3 + Spring Security + JWT + JPA Hibernate + H2 Database
- **Web Frontend**: React 19 + TypeScript + Vite v8 + Tailwind CSS v4 + Lucide Icons
- **Mobile Target**: React Native Expo JavaScript (`sadi hub.com`)

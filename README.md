# 🎰 Online Casino App — Full-Stack Application

Aplikacja polega na stworzeniu **kasyna online** z pełnym backendem, frontendem, uwierzytelnianiem użytkowników, grywalnością oraz uruchamianiem całości w Dockerze.  
Projekt demonstruje poprawną inżynierię oprogramowania: warstwowość, REST API, walidację, paginację, testy i wersjonowanie w Gicie.

---

## 🚀 Technologie

### **Backend**
- **Node.js + TypeScript**
- **NestJS** – modularny framework zapewniający kontrolery, serwisy, guardy, interceptory oraz wbudowaną architekturę warstwową
- **Prisma ORM** – typowane zapytania i migracje bazy danych
- **PostgreSQL** – główna baza danych
- **JWT (Passport)** – uwierzytelnianie użytkowników
- **class-validator + DTO** – walidacja wejścia
- **Jest** – testy jednostkowe i integracyjne

### **Frontend**
- **React + TypeScript**
- **Vite** – szybkie środowisko uruchomieniowe
- **Axios / React Query** – komunikacja z API
- **Chakra UI / TailwindCSS** – UI i stylowanie
- **React Hook Form + Zod** – walidacja formularzy

### **Docker**
Uruchamianie całego środowiska poprzez `docker-compose`:

- `backend` — NestJS  
- `frontend` — React  
- `db` — PostgreSQL  
- `pgadmin`

# CS:GO Casino Platform - Web Project

Profesjonalna platforma typu "Case Opener" oparta na architekturze mikroserwisowej (konteneryzacja Docker), zbudowana z użyciem nowoczesnych technologii webowych. Projekt umożliwia otwieranie skrzynek z animacją karuzeli, zarządzanie ekwipunkiem oraz handel na wewnętrznym rynku (Marketplace).

## 🚀 Technologie

### Backend:
* **NestJS** - Framework Node.js do budowy skalowalnych aplikacji serwerowych.
* **Prisma ORM** - Nowoczesne mapowanie obiektowo-relacyjne dla bazy danych.
* **PostgreSQL** - Relacyjna baza danych.
* **Swagger** - Automatyczna dokumentacja API.

### Frontend:
* **React** - Biblioteka do budowy interfejsu użytkownika.
* **Axios** - Klient HTTP do komunikacji z API.
* **CSS3 Animations** - Zaawansowana logika karuzeli oparta na `cubic-bezier`.

---

## 🛠 Instrukcja uruchomienia

Aby uruchomić projekt, upewnij się, że masz zainstalowany **Docker** oraz **Docker Compose**.

### 1. Budowa i start kontenerów
W folderze głównym projektu wykonaj komendę:
```bash
docker-compose up -d --build
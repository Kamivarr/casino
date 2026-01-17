# CS:GO Case Opener & Marketplace

Projekt zaliczeniowy symulujący ekosystem pozyskiwania i handlu wirtualnymi przedmiotami (skinami). Aplikacja umożliwia otwieranie skrzynek, zarządzanie ekwipunkiem oraz handel z innymi użytkownikami w czasie rzeczywistym.

## 1. Wprowadzenie
**Cel aplikacji:** Stworzenie platformy webowej odwzorowującej mechaniki znane z gier typu FPS, pozwalającej użytkownikom na symulację ekonomii wirtualnej bez ryzyka finansowego.

**Kluczowe możliwości:**
* Otwieranie skrzynek z animacją losowania (CSS `cubic-bezier`).
* Handel przedmiotami na rynku (kupno/sprzedaż).
* Zarządzanie wirtualnym portfelem i ekwipunkiem.

## 2. Wykorzystane technologie
* **Backend:** NestJS, TypeScript, Prisma ORM.
* **Frontend:** React, Vite, TypeScript, Material UI.
* **Baza danych:** PostgreSQL.
* **Infrastruktura:** Docker, Docker Compose.

## 3. Instalacja i uruchomienie
Wymagania wstępne: Zainstalowany **Docker** oraz **Docker Compose**.

### Instrukcja "One-Click Setup":
Projekt jest w pełni skonteneryzowany. Aby go uruchomić, wykonaj następujące kroki:

1.  Sklonuj repozytorium:
    ```bash
    git clone [https://github.com/Kamivarr/casino.git](https://github.com/Kamivarr/casino.git)
    cd casino
    ```
2.  Uruchom środowisko:
    ```bash
    docker-compose up --build
    ```
3.  **Gotowe!** Aplikacja automatycznie skonfiguruje bazę danych i wypełni ją danymi testowymi (seed).

Dostęp do usług:
* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:3000
* **Swagger Docs:** http://localhost:3000/api

## 4. Funkcje aplikacji
* **System Losowania:** Interaktywna karuzela losująca przedmioty z różnym stopniem rzadkości.
* **Marketplace:** Pełny system handlu. Użytkownik może wystawić przedmiot na sprzedaż, a inny go kupić. Operacje są zabezpieczone transakcjami ACID.
* **Bezpieczeństwo:** Rejestracja i logowanie z użyciem JWT oraz hashowaniem haseł (bcrypt).
* **Ekwipunek:** Podgląd zdobytych przedmiotów, ich wartości i statusu (w ekwipunku / na rynku).

## 5. Struktura i Konfiguracja
Model danych oparty jest na relacjach PostgreSQL. Główne encje to `User`, `Item`, `Case` oraz `MarketListing`.
Konfiguracja zmiennych środowiskowych znajduje się w pliku `.env` wewnątrz kontenerów (zarządzana przez docker-compose).

## 6. Wdrożenie
Aplikacja jest przygotowana do pracy w kontenerach, co czyni ją niezależną od systemu operacyjnego hosta. Mechanizm **Healthcheck** zapewnia, że backend startuje dopiero po pełnym uruchomieniu bazy danych.
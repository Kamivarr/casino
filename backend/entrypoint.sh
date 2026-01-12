#!/bin/sh

# Czekanie na dostępność bazy danych (opcjonalnie, prisma db push samo ponawia próby)
echo "Oczekiwanie na bazę danych..."

# Synchronizacja schematu z bazą danych
npx prisma db push --accept-data-loss

# Uruchomienie seedowania (możesz dodać flagę, żeby nie robić tego za każdym razem)
npx prisma db seed

# Uruchomienie aplikacji w trybie deweloperskim
npm run start:dev
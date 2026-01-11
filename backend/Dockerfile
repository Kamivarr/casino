FROM node:20-alpine

# Instalujemy biblioteki systemowe wymagane przez Prismę na Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Kopiujemy pliki definicji pakietów
COPY package*.json ./
COPY prisma ./prisma/

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę kodu
COPY . .

# Generujemy klienta Prisma dopasowanego do Alpine
RUN npx prisma generate

# Budujemy projekt
RUN npm run build

# Startujemy aplikację
CMD ["npm", "run", "start:prod"]
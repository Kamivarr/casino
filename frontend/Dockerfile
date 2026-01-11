FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Budujemy wersję produkcyjną
RUN npm run build

# Do serwowania frontendu w Dockerze użyjemy prostego serwera
RUN npm install -g serve

EXPOSE 3001
CMD ["serve", "-s", "build", "-l", "3001"]
# Stage 1: builder
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: runner
FROM node:20 AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]

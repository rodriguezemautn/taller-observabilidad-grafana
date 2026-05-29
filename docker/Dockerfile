# Stage 1: Dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/core/package.json packages/infrastructure/package.json packages/web-app/package.json ./packages/
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate --schema=packages/infrastructure/src/persistence/prisma/schema.prisma
RUN npx tsc -b tsconfig.json
RUN npm run build -w packages/web-app

# Stage 3: Run
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
COPY --from=build /app/packages/core/dist ./packages/core/dist
COPY --from=build /app/packages/infrastructure/dist ./packages/infrastructure/dist
COPY --from=build /app/packages/web-app/dist ./packages/web-app/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/packages/infrastructure/src/persistence/prisma/schema.prisma ./schema.prisma
EXPOSE 3001
CMD ["node", "--enable-source-maps", "packages/infrastructure/dist/index.js"]

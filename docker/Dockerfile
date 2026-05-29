# Stage 1: Dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar raíz del monorepo
COPY package.json package-lock.json ./

# Copiar package.json de cada workspace (con directorios)
RUN mkdir -p packages/core packages/infrastructure packages/web-app
COPY packages/core/package.json packages/core/
COPY packages/infrastructure/package.json packages/infrastructure/
COPY packages/web-app/package.json packages/web-app/

# Instalar SOLO las dependencias (sin scripts)
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar node_modules + código fuente
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/packages ./packages
COPY . .

# Generar Prisma Client + Compilar TypeScript + Build Frontend
RUN ./node_modules/.bin/prisma generate --schema=packages/infrastructure/src/persistence/prisma/schema.prisma
RUN ./node_modules/.bin/tsc -b tsconfig.json
RUN npm run build -w packages/web-app

# Stage 3: Run
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Copiar solo lo necesario para correr
COPY --from=build /app/packages/core/dist ./packages/core/dist
COPY --from=build /app/packages/infrastructure/dist ./packages/infrastructure/dist
COPY --from=build /app/packages/web-app/dist ./packages/web-app/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/packages/infrastructure/src/persistence/prisma/schema.prisma ./schema.prisma

EXPOSE 3001
CMD ["node", "--enable-source-maps", "packages/infrastructure/dist/index.js"]

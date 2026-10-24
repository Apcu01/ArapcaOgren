# syntax=docker/dockerfile:1
# Node sürümü sabit: package.json "engines" ile aynı (21 Ekim 2026 güvenlik yamalı sürüm)
FROM node:24.22.1-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Bağımlılıklar ve derleme (gizli anahtarlar burada gerekmez; yalnızca çalışırken verilir)
FROM base AS build
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# Çalışma imajı
FROM base AS run
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]

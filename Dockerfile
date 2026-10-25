# syntax=docker/dockerfile:1
# Node sürümü sabit: package.json "engines" ile aynı (21 Ekim 2026 güvenlik yamalı sürüm)
FROM node:24.22.1-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Bağımlılıklar ve derleme.
# Sayfalar derlemede önceden hazırlanır: DATABASE_URL ve SITE_URL derleme argümanı olarak verilirse içerik derlemede hazır olur
# (Dokploy: Build Args). Verilmezse derleme yine çalışır, sayfalar sunucu açıldıktan birkaç saniye sonra veritabanından hazırlanır.
# Bu değerler yalnızca derleme aşamasında kullanılır, son imaja girmez. OpenRouter anahtarı derlemede gerekmez.
FROM base AS build
ARG DATABASE_URL
ARG SITE_URL
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN DATABASE_URL="$DATABASE_URL" SITE_URL="$SITE_URL" npm run build

# Çalışma imajı
FROM base AS run
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]

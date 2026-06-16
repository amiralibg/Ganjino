# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

# Install dependencies (no internal workspace deps, so package.json alone is enough)
COPY package.json ./
RUN pnpm install

# Copy source and build the static bundle
COPY . .

# VITE_API_BASE_URL is baked into the bundle at build time. Dokploy does not
# forward runtime env vars as build args, so default it to the production API
# URL here. Override with --build-arg VITE_API_BASE_URL=... for other envs.
ARG VITE_API_BASE_URL=https://ganjino-api.amiralibg.xyz/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

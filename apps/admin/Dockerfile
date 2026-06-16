# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

# Install dependencies (no internal workspace deps, so package.json alone is enough)
COPY package.json ./
RUN pnpm install

# Copy source and build the static bundle
COPY . .

# VITE_API_BASE_URL is baked into the bundle at build time, so it must be
# provided as a build argument (set it in Dokploy under Build Args).
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

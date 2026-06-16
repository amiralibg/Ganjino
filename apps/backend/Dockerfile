# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

# Install dependencies (no internal workspace deps, so package.json alone is enough)
COPY package.json ./
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript -> dist/
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

# Install production dependencies only
COPY package.json ./
RUN pnpm install --prod

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Start application
CMD ["node", "dist/index.js"]

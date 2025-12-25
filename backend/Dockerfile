FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Install ts-node for TypeScript config support in production
RUN npm install --save-dev ts-node typescript @types/node

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Strapi
ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run Strapi
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install wget for healthcheck
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 strapi

# Copy necessary files
COPY --from=builder --chown=strapi:nodejs /app/dist ./dist
COPY --from=builder --chown=strapi:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:nodejs /app/package*.json ./
COPY --from=builder --chown=strapi:nodejs /app/public ./public
COPY --from=builder --chown=strapi:nodejs /app/src ./src
COPY --from=builder --chown=strapi:nodejs /app/config ./config
COPY --from=builder --chown=strapi:nodejs /app/tsconfig.json ./tsconfig.json

# Copy entrypoint script
COPY --chown=strapi:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Create directories for data, uploads, and database migrations
RUN mkdir -p /app/data /app/public/uploads /app/.tmp /app/database/migrations
RUN chown -R strapi:nodejs /app/data /app/public/uploads /app/.tmp /app/database

USER strapi

EXPOSE 1337

ENV PORT=1337
ENV HOST=0.0.0.0

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]

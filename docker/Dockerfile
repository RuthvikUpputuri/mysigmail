# Stage 1: Build the frontend
FROM node:20-alpine AS builder

# Install build tools for native dependencies like argon2
RUN apk add --no-cache python3 make g++

# Corepack needed for pnpm/yarn, but we can just use npm to install
RUN corepack enable

WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* pnpm-workspace.yaml* yarn.lock* bun.lock* bun.lockb* ./

# Detect the lockfile and install accordingly
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f bun.lock ] || [ -f bun.lockb ]; then npx bun install --frozen-lockfile; \
  else npm ci; \
  fi

COPY . .
RUN npm run build

# Stage 2: Serve using Node.js Backend
FROM node:20-alpine

# Install build tools for native dependencies like argon2
RUN apk add --no-cache --virtual .build-deps python3 make g++

WORKDIR /app

# Copy package.json and backend server
COPY package.json ./
COPY server ./server

# Install ONLY production dependencies (this includes express, argon2, etc)
RUN npm pkg delete scripts.prepare && npm install --omit=dev && apk del .build-deps

# Copy the built frontend from stage 1
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/index.js"]

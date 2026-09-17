# Stage 1: Build the frontend
FROM node:20-alpine AS builder

# Corepack needed for pnpm/yarn, but we can just use npm to install
RUN corepack enable

WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies using whichever lockfile is present
RUN if [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm ci; fi

COPY . .
RUN npm run build

# Stage 2: Serve using Node.js Backend
FROM node:20-alpine

WORKDIR /app

# Copy package.json and backend server
COPY package.json ./
COPY server ./server

# Install ONLY production dependencies (this includes express, argon2, etc)
RUN npm install --omit=dev

# Copy the built frontend from stage 1
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server/index.js"]

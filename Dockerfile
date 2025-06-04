FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN npm install && cd frontend && npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Add environment variables for build time
ENV NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Build the application
WORKDIR /app/frontend
RUN npm run build || (cat .next/error.log && exit 1)

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

# Set the correct permission for prerender cache
RUN mkdir -p ./frontend/.next/cache && chown -R nextjs:nodejs ./frontend/.next

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Add environment variables with default values
ENV NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

CMD ["node", "frontend/server.js"] 
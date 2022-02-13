# Install dependencies only when needed
FROM node:16-buster AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3node:16-buster to understand why libc6-compat might be needed.
#RUN apt-get install -y libc6-compat

# Get latest deps
# =============================
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-buster AS builder

# Copy deps from last step
# =============================
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build, then remove dev deps
# =============================
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image
# =============================
FROM node:16-buster AS runner
WORKDIR /app

# NODE_ENV production is common
# =============================
ENV NODE_ENV production

# Create a non-root user
# =============================
RUN addgroup -gid 1001 --system nodejs
RUN adduser --system nextjs -u 1001

# Get all required files to run
# =============================
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Use previously created user
# =============================
USER nextjs

# Change this if port number matters at all
# =============================
EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# Finally, run Next.js app
# =============================
CMD ["node_modules/.bin/next", "start"]

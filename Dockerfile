FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:alpine

WORKDIR /app

COPY --from=builder /app/build build/
COPY package.json .

RUN bun install --production --frozen-lockfile

RUN mkdir -p downloads build && chown 1000:1000 downloads build && chmod 755 downloads build

ENV NODE_ENV=production

USER 1000

EXPOSE 3000

CMD ["bun", "./build/index.js"]
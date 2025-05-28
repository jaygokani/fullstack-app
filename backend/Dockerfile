FROM oven/bun:1.1.18-alpine

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

COPY .env.example .env

EXPOSE 5000

CMD ["bun", "run", "server.js"]

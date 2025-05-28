FROM oven/bun:1.1.18-alpine

WORKDIR /app

COPY package.json ./

RUN bun install

COPY .env.example .env

COPY . .

EXPOSE 5000

CMD ["bun", "run", "server.js"]

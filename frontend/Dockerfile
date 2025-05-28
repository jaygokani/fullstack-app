FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env.example .env

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 7071

CMD ["npm", "run", "start"]

FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node_modules/.bin/vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
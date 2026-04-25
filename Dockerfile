FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
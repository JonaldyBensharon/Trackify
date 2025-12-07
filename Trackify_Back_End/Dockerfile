#Back-end/Dockerfile
FROM node:18-alpine

#direktori kerja
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

COPY . ./

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]

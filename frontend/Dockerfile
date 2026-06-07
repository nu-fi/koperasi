FROM node:22-alpine

WORKDIR /app

# Copy daftar library dulu biar diinstall
COPY package*.json ./
RUN npm install

# Copy sisa kodenya
COPY . .

# Buka port 5173 untuk Vite
EXPOSE 5173

# Perintah untuk menjalankan Vite Dev Server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
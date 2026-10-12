FROM node:18-bullseye
# Instal FFMPEG dan Chromium
RUN apt-get update && apt-get install -y ffmpeg chromium

# Set direktori kerja
WORKDIR /app

# Copy file package dan instal
COPY package*.json ./
RUN npm install

# Copy sisa file (termasuk server.js)
COPY . .

# Expose port
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]

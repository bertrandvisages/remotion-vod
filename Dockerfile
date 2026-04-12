FROM node:20-slim

# Install dependencies for Chromium + FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium ffmpeg \
    fonts-liberation fonts-noto-color-emoji \
    libnss3 libatk-bridge2.0-0 libx11-xcb1 libxcomposite1 \
    libxdamage1 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 \
    libgtk-3-0 libxshmfence1 libglu1-mesa ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p renders

EXPOSE 3100

CMD ["node", "server.mjs"]

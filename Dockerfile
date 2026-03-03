FROM node:20-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Открываем порт, на котором работает приложение
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
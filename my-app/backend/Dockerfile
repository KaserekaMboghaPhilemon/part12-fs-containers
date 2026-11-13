FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY . .
    EXPOSE 3001
CMD ["npm", "start"]

FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production
COPY . .

EXPOSE 5000

RUN npm install -g serve

CMD ["serve", "-s", "build/"]

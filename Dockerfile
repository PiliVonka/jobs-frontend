FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production
COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000 

CMD ["serve", "-l", "3000", "-s", "build/"]


FROM node:19

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY . .
COPY .env.docker .env

RUN npm run webpack
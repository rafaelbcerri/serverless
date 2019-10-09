FROM node:10

WORKDIR /app

RUN npm i -g serverless

COPY package*.json ./

RUN npm i

EXPOSE 3000

COPY . /app/
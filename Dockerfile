FROM node:12.18.0

RUN mkdir /meu_chapa
WORKDIR /meu_chapa

COPY package.json /meu_chapa/package.json
COPY package-lock.json /meu_chapa/package-lock.json

RUN npm install

COPY . /meu_chapa


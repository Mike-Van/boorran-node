FROM node:13
RUN apt-get update
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g serverless
COPY . .
RUN npm rebuild
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start:production" ]

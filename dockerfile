FROM node:10
RUN apt-get update
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g serverless
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start:production" ]

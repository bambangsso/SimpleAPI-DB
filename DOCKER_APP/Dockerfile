ARG APP_PORT
FROM node:8

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install
COPY . .

EXPOSE $APP_PORT
CMD [ "node", "index.js", "staging" ]
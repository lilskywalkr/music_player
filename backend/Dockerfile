FROM node:latest

RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3500

CMD ["npm", "run", "nodemon-back-dev"]
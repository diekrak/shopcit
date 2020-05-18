FROM node:10

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY app.js .
#EXPOSE 3002
CMD [ "node", "app.js" ]
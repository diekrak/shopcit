FROM node:10

WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY ./app .
EXPOSE 3002
CMD [ "node", "app.js" ]
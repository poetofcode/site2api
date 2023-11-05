FROM node:21-alpine
WORKDIR /home/poet/docker-pr/site2api
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]

FROM node:21-alpine
WORKDIR /home/poet/docker-pr/site2api
COPY package*.json .
RUN npm install && npm install --only=dev
COPY . .
ENV SITE2API_ENV=prod
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]

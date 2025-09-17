FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# install dependencies for dev (react-scripts)
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

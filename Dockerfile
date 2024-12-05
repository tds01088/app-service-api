FROM docker.io/node:18-alpine

ARG http_proxy
ARG https_proxy
ARG no_proxy

LABEL maintainer="GDSP"

# Work dir
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .npmrc ./

# If you are building your code for production
# RUN npm install --only=production
RUN npm install

# Bundle app source
COPY . .

USER 5678

EXPOSE 4000
CMD ["npm", "start"]
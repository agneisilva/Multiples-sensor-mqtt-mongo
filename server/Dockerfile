FROM node:latest
# 
# WORKDIR /
# application's code will live within
WORKDIR /app
# We copy our package.json file to our
# app directory
RUN npm install -g nodemon
COPY package.json /app/package.json
# We then run npm install to install
# express for our application
RUN npm install && npm ls
RUN mv /app/node_modules /node_modules
# We then copy the rest of our application
# to the app direcoty
COPY . /app
# We start our application by calling
# npm start.
CMD ["npm", "start"]
FROM node:latest

WORKDIR /usr/app/

COPY ./crosscutting/ ./crosscutting/
COPY ./server/ ./server/

WORKDIR /usr/app/server/
RUN npm install

# WORKDIR /usr/app
# RUN pwd && ls

# WORKDIR /usr/app/server/
# RUN pwd && ls

# WORKDIR /usr/app/crosscutting/
# RUN pwd && ls

WORKDIR /usr/app/server/

CMD ["npm", "start"]
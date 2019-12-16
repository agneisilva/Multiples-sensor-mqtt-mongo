FROM node:latest

WORKDIR /usr/app/

COPY ./crosscutting/ ./crosscutting/
COPY ./sensor/ ./sensor/

WORKDIR /usr/app/sensor/
RUN npm install

# WORKDIR /usr/app
# RUN pwd && ls

# WORKDIR /usr/app/sensor/
# RUN pwd && ls

# WORKDIR /usr/app/crosscutting/
# RUN pwd && ls

WORKDIR /usr/app/sensor/

CMD ["node", "simulateMultiplesSensor.js"]
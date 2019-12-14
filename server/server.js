const mqtt = require('mqtt')
const guid = require('../crosscutting/guid.js')
const mongoDb = require('./mongodb.js')
const influxdb = require('./influxdb.js');



const options = {
  host: '127.0.0.1',
  port: 1883,
  keepalive: 60,
  clientId: "Server: " + guid.newGuid()
  // username: "testing_user",
  // password: "password",
  // protocol: 'mqtts',
  // rejectUnauthorized: true,
  // ca: TRUSTED_CA_LIST
};

const client = mqtt.connect(options)

const topic_SENSORCONNECTED = 'sensor/connected';
const topic_SENSORSIGNAL = 'sensor/signal';
const topic_SENSORDISCONNECTED = 'sensor/disconnected'

client.on('connect', () => {
  client.subscribe(topic_SENSORCONNECTED)
  client.subscribe(topic_SENSORDISCONNECTED)
  client.subscribe(topic_SENSORSIGNAL)

  console.log('Server connected')
})

client.on("error", function (error) { console.log("Can't connect" + error) });

client.on('message', (topic, message) => {
  switch (topic) {
    case topic_SENSORCONNECTED:
      return handleSensorConnected(message)
    case topic_SENSORSIGNAL:
      return handleSensorSignal(message)
    case topic_SENSORDISCONNECTED:
      return handleSensorDisconnected(message)
  }
  console.log('No handler for topic %s', topic)
})

function handleSensorConnected(message) {
  console.log('Sensor connected, sensor id %s', message.toString())
}

function handleSensorDisconnected(message) {
  console.log('Sensor disconnected, sensor id %s', message.toString())
}

async function handleSensorSignal(playload) {
  console.log('sensor signal received; Data: %s', playload.toString())
  
  //await Promise.all([
    //mongoDb.insertPlayloadToMongoDB(playload);
    influxdb.insertPlayloadToInfluxdb(playload);
  // ]);
  
}

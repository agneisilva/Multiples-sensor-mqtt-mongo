const mqtt = require('mqtt')
const guid = require('../crosscutting/guid.js')
const { MongoClient } = require('mongodb');


const url = 'mongodb://localhost:27017/';
const dbMongo = 'sensorDB';
const sensorCollection = 'sensor';

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

function handleSensorSignal(playload) {
  console.log('sensor signal received; Data: %s', playload.toString())
  insertPlayloadToMongoDB(playload);
}


var insertPlayloadToMongoDB = async function (playload) {

  await MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    try {

      let database = db.db(dbMongo);
      const collection = database.collection(sensorCollection);

      obj = JSON.parse(playload);

      var data = { type: obj.type, date: obj.date, clientid: obj.clientId };

      collection.insertOne(obj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });

      console.log('Inserted 3 documents into the collection');

    }
    catch (err) {
      console.log(err);
    }


    console.log("Connected successfully to server");

  });
}

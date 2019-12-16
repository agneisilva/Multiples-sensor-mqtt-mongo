const mqtt = require('mqtt')
const guid = require('../crosscutting/guid.js')

const topic_SENSORCONNECTED = 'sensor/connected';
const topic_SENSORSIGNAL = 'sensor/signal';
const topic_SENSORDISCONNECTED = 'sensor/disconnected'

const types_signal = {
    SIGNAL: "SIGNAL", 
    ERROR: "ERROR"
};

var clientId = guid.newGuid();

const options = {
    host: process.env.mqtt_hostname || '127.0.0.1',
    port: process.env.mqtt_port || 1883,
    keepalive: 60,
    clientId: clientId
    // username: "testing_user",
    // password: "password",
    // protocol: 'mqtts',
    // rejectUnauthorized: true,
    // ca: TRUSTED_CA_LIST
};

const client=mqtt.connect(options)

//get params from parent process  
// var value = process.argv[2];
//write back to parent process
// process.stdout.write('Sensor ' + value + ' beginning.');

client.on('connect', () => {
    // Inform server that sensor is connected
    client.publish(topic_SENSORCONNECTED, clientId);
    console.log(`sensor id ${clientId} connected to hub`);
})

client.on("error", function (error) { console.log("Can't connect" + error) });

const timer = process.env.sensor_interval_signal || 2000;

// simulate sensor sending data to server
setInterval(() => {
    sendSensorSignal();
}, timer)

function sendSensorSignal() {
    if (client.connected) {
        
        var signal = {
            type: types_signal.SIGNAL, 
            date: new Date().toString(), 
            clientId: clientId
        };

        client.publish(topic_SENSORSIGNAL, JSON.stringify(signal))

        console.log(`Sensor signal sent. Sensor id:  ${clientId}`);
    }
}

/**
 * Want to notify process that sensors is disconnected before process
 */
function handleAppExit(options, err) {
    if (err) {
        console.log(err.stack)
    }

    if (options.cleanup) {
        client.publish(topic_SENSORDISCONNECTED, clientId)
        console.log('Sensor signal disconnected sent. Sensor id: ' + clientId);
    }

    if (options.exit) {
        process.exit()
    }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {
    cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
    exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
    exit: true
}))


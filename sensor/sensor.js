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
    host: '127.0.0.1',
    port: 1883,
    keepalive: 60,
    clientId: clientId
    // username: "testing_user",
    // password: "password",
    // protocol: 'mqtts',
    // rejectUnauthorized: true,
    // ca: TRUSTED_CA_LIST
};

const client=mqtt.connect(options)

console.log('STARTED:  Sensor number ' + clientId + '  started');

var value = process.argv[2];
process.stdout.write('Sensor ' + value + ' beginning.');

process.stdout.write('STARTED:  Sensor number ' + clientId + '  started');

client.on('connect', () => {
    // Inform server that sensor is connected
    client.publish(topic_SENSORCONNECTED, clientId);
    console.log('sensor signal connected sent');
})

client.on("error", function (error) { console.log("Can't connect" + error) });

// simulate opening garage door
setInterval(() => {
    sendSensorSignal();
}, 2000)

function sendSensorSignal() {
    if (client.connected) {
        
        var signal = {
            type: types_signal.SIGNAL, 
            date: new Date().toString(), 
            clientId: clientId
        };

        client.publish(topic_SENSORSIGNAL, JSON.stringify(signal))

        console.log('sensor signal sent ' + clientId);
    }
}

/**
 * Want to notify controller that garage is disconnected before shutting down
 */
function handleAppExit(options, err) {
    if (err) {
        console.log(err.stack)
    }

    if (options.cleanup) {
        client.publish(topic_SENSORDISCONNECTED, clientId)
        console.log('sensor signal disconnected sent' + clientId);
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


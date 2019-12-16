// simulateMultiplesSensor.js
'use strict';

var spawn = require('child_process').spawn;
var bbPromise = require('bluebird');

// https://alexzywiak.github.io/managing-multiple-child-processes-in-nodejs/index.html
function loadSensor(arg) {

    return new bbPromise(function (resolve, reject) {
        var process = spawn('node', ['./sensor.js', arg]);

        process.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        process.stderr.on('data', function (err) {
            reject(err.toString());
        });

        process.on('exit', function () {
            resolve();
        });
    });
}

//execute with npm start [number of sensor] e.g "npm start 10" (it'll start 10 sensor). 
//if  the parameter isn't passed it'll assume 10 sensor
var numberSensorParamExec = +process.argv[2]

var numberSensorParamEnv = process.env.SENSORS_NUMBER

var numberSensor = +(numberSensorParamExec || numberSensorParamEnv || 3);

console.log("number of sensor: " + numberSensor);

//https://stackoverflow.com/a/58682914
var sensorExecution = Array(...Array(numberSensor)).map((_, i) => i);

var commands = sensorExecution.map(function (value) {
    return loadSensor.bind(null, value);
});

return bbPromise.map(commands, function (command) {
    return command();
})
.then(function () {
        console.log('Child Processes Completed');
});
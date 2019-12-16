'use strict';
const Influx = require('influxdb-nodejs');
const config = require('./config.js');


const INFLUXDB_HOSTNAME = config.influxdb_hostname || 'localhost';
const INFLUXDB_PORT = config.influxdb_port || 27017; 

const INFLUXDB_DB = 'sensor_db';
const SENSOR_TABLE = 'sensors_tb';

const url = `http://${INFLUXDB_HOSTNAME}:${INFLUXDB_PORT}/${INFLUXDB_DB}`;

const client = new Influx(url);

client.startHealthCheck();

var insertPlayloadToInfluxdb = async function (playload) {
    
    client.showDatabases()
    .then(names => {

        if (!names.includes(INFLUXDB_DB)) {
            client.createDatabase(INFLUXDB_DB)
                .then(_ => {
                    console.info('create database success.  Databases: ' + JSON.stringify(names))
                })
                .catch(err => console.error(`create database fail, ${err.message}`));
        }
    })
    .then(_ => insert(playload))
    .catch(console.error);
}

var insert = (playload) =>  {
        //if(!!playload) return; 
        
        var obj = JSON.parse(playload);

        client.write(SENSOR_TABLE)
            .tag({
                sensorId: obj.clientId,
            })
            .field({
                type: obj.type, 
                dateTime:  obj.date
            })
            .then(() => console.info('write point to influxdb success'))
            .catch(err => console.error(`write point to influxdb-relay fail, err:${err.message}`));
}

module.exports = {
    insertPlayloadToInfluxdb
}
'use strict';

const Influx = require('influxdb-nodejs');

const client = new Influx('http://127.0.0.1:8086/sensors_db');

client.startHealthCheck();

// const fieldSchema = {
//     use: 'integer',
//     bytes: 'integer',
//     url: 'string',
// };

// const tagSchema = {
//     spdy: ['speedy', 'fast', 'slow'],
//     method: '*',
//     // http stats code: 10x, 20x, 30x, 40x, 50x
//     type: ['1', '2', '3', '4', '5'],
// };

// client.schema('http', fieldSchema, tagSchema, {
//     // default is false
//     stripUnknown: true,
// });

var insertPlayloadToInfluxdb = async function (playload) {
    
    client.showDatabases()
    .then(names => {

        if (!names.includes('sensors_db')) {
            client.createDatabase("sensors_db")
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
        console.log("insert Playload to Influxdb");
        
        var obj = JSON.parse(playload);

        console.log(JSON.stringify(obj));

        client.write('sensor_tb')
            .tag({
                sensorId: obj.clientId,
            })
            .field({
                type: obj.type, 
                dateTime:  obj.date
            })
            .then(() => console.info('write point to influxdb-relay success'))
            .catch(err => console.error(`write point to influxdb-relay fail, err:${err.message}`));
}

module.exports = {
    insertPlayloadToInfluxdb
}
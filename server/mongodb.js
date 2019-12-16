const { MongoClient } = require('mongodb');
const config = require('./config.js');

const MONGO_HOSTNAME = config.mongo_hostname || 'localhost';
const MONGO_PORT = config.mongo_port || 27017; 

const MONGO_DB = 'sensorDB';
const COLLECTION_SENSOR = 'sensors';

const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

var insertPlayloadToMongoDB = async function (playload) {

    await MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        try {

            let database = db.db(MONGO_DB);
            const collection = database.collection(COLLECTION_SENSOR);

            obj = JSON.parse(playload);

            collection.insertOne(obj, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        }
        catch (err) {
            console.log(err);
        }


        console.log("Connected successfully to server");

    });
}

module.exports = {
    insertPlayloadToMongoDB
}
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';
const dbMongo = 'sensorDB';
const sensorCollection = 'sensor';

var insertPlayloadToMongoDB = async function (playload) {

    await MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        try {

            let database = db.db(dbMongo);
            const collection = database.collection(sensorCollection);

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
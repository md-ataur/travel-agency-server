const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware functions
app.use(cors());
app.use(express.json());


// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travelAgency");
        const tourismCollection = database.collection("tourism");
        const touristCollection = database.collection("tourists");

        // POST API ta add a new tourism
        app.post('/places', async (req, res) => {
            const tourism = req.body;
            const result = await tourismCollection.insertOne(tourism);
            res.json(result);
        });

        // POST API ta add new tourist
        app.post('/tourists', async (req, res) => {
            const tourist = req.body;
            const result = await touristCollection.insertOne(tourist);
            res.json(result);
        });

        // POST API to get data by email
        app.post('/tourists/byemail', async (req, res) => {
            const email = req.body;
            const query = { email: { $in: email } };
            const result = await touristCollection.find(query).toArray();
            res.json(result)
        });

        // GET API to get all tourism data
        app.get('/places', async (req, res) => {
            const cursor = tourismCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        // GET API to get single tourism data by id
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tourismCollection.findOne(query);
            res.send(result);
        });

        // GET API to get all tourist data
        app.get('/tourists', async (req, res) => {
            const cursor = touristCollection.find({});
            const tourists = await cursor.toArray();
            res.send(tourists);
        });

        // DELETE API
        app.delete('/tourists/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await touristCollection.deleteOne(query);
            res.json(result);
        });


        // console.log('Successfully database connected');
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Node Server is Running');
});

app.listen(port, () => {
    console.log('Listening at', port);
});
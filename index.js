const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
// middleware
app.use(cors())
app.use(express.json())
// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufcsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
//     console.log('database connected')
// });
async function run() {
    try {
        await client.connect()
        const listsColloection = client.db("to-do-list").collection("lists")
        app.post('/list', async (req, res) => {
            const data = req.body
            console.log(data)
            const result = await listsColloection.insertOne(data)
            res.send(result)
        })
        app.get("/lists", async (req, res) => {
            const query = {};
            const result = await listsColloection.find(query).toArray();
            res.send(result);
        });
        app.delete("/list/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await listsColloection.deleteOne(filter);
            res.send(result);
        });
        app.put("/list/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskComplete: true
                }
            }
            const result = await listsColloection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir)

// ====
app.get('/', (req, res) => {
    res.send('running server')
})
app.listen(port, () => {
    console.log('listening to port', port)
})

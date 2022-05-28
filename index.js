const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfywcxd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('manufacture').collection('parts');
        const orderCollection = client.db('manufacture').collection('orders');
        const reviewCollection = client.db('manufacture').collection('reviews');

        app.get('/parts', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
        })
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const part = await partsCollection.findOne(query)
            res.send(part)
        })
        app.get('/orders', async (req, res) => {
            console.log(req.query)
            const buyerEmail = req.query.buyer
            const query = { UserEmail: buyerEmail }
            const orders = orderCollection.find(query)
            const result = await orders.toArray()
            // console.log(result)
            res.send(result)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('assigment-project-12')
})

app.listen(port, () => {
    console.log(`project-server-12 in running on port ${port}`)
})
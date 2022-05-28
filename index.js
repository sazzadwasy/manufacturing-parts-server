const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
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
        const userCollection = client.db('manufacture').collection('users');

        app.get('/parts', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
        })
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token })

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

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
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
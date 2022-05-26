const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('assigment-project-12')
})

app.listen(port, () => {
    console.log(`project-server-12 in running on port ${port}`)
})
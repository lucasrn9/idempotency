const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { v4: uuidv4 } = require('uuid')

app.use(cors())
app.use(bodyParser.json())

const PORT = 8000
const DB = []
const DBIdempotent = []

function throttling(seconds) {
    return new Promise((resolve) => {
        console.log(`Throttling: Waiting for ${seconds} seconds...`);
        setTimeout(resolve, seconds * 1000);
    });
}

app.post('/new-order', async (req, res) => {
    const order = req.body
    const hasIntentionalError = req.headers.error === "True"
    order.id = uuidv4()
    DB.push(order)
    console.log(order)
    await throttling(8)
    return hasIntentionalError ? (res.status(500).send("Error")) : (
        res.status(201).json("success !"))
})

app.post('/new-order-idempotent', async (req, res) => {
    const order = req.body
    const hasIntentionalError = req.headers.error === "True"
    await throttling(8)
    const orderAlreadyExists = DBIdempotent.find((orderDB) => orderDB.orderId == order.orderId)
    if (orderAlreadyExists) {
        return hasIntentionalError ? (res.status(500).json({ message: "Error !" })) : (
            res.status(200).json({ message: "Already made with success !", orderId: orderAlreadyExists.orderId }))
    }
    // ideally, the possibility of only having a single order with the same id in the DB should be validated in this push method (in the db), but lets keep it as simple as possible
    DBIdempotent.push(order)
    console.log(order)
    return hasIntentionalError ? (res.status(500).json({ message: "Error !" })) : (res.status(201).json({ message: "success !" }))
})

app.get('/orders', (req, res) => {
    res.status(200).send(JSON.stringify(DB))
})

app.listen(PORT, () => {
    console.log(`API is up on port http://localhost:${PORT}`)
})
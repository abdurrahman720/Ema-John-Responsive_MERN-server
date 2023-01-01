const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5001;

//middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rtntsud.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db("emaJohn").collection("products");

        app.get("/products", async (req, res) => {
            const page = req.query.page;
            const size =parseInt( req.query.size);
            console.log(page, size);
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count,products});
        })

        app.post('/productsByIds', async (req, res, next) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id));
            console.log(ids)
            const query = {
                _id : ({$in: objectIds})
            }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })
    }
    finally {
        
    }
}

run().catch(err => {console.log(err)})



app.get('/', (req, res) => {
    res.send('Ema John server is Running');
})

app.listen(port, () => {
    console.log("Ema Jhon server running on", port);
})
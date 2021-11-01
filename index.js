const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsocy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run (){
    try {
        await client.connect();
        const database = client.db('travleAgency');
        const serviceCollection = database.collection('places')
        const myOrderCollection = database.collection('myBooking')
       

        // GET API
        app.get('/services', async(req, res)=>{
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        });

        // GET SINGLE API
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service)

        })
        // Load data according to user id get api
        app.get('/cart/:uid', async(req, res)=>{
            const uid = req.params.uid;
            const query = {uid: uid};
            const result = await myOrderCollection.find(query).toArray();
            res.json(result);

            
        })

        
        // add data to cart collection with additional info
        app.post('/booking/add', async(req, res)=>{
            const booking = req.body;
            console.log(booking);
            const result = await myOrderCollection.insertOne(booking)
            res.json(result)
        })
        // Post
        app.post('/services',async(req, res) =>{
            const service = req.body;
        //    console.log('hitting the dating', service);

            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
            console.log(result);
        });

        // delete one item
        app.delete('/booking/add/:id',async (req,res)=> {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myOrderCollection.deleteOne(query);
            res.json(result);
            console.log(result);
          });

    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Travel server is running');
})

app.listen(port, () => {
    console.log("server is running", port);
})
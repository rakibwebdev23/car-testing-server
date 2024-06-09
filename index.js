const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.CAR_USER_NAME}:${process.env.CAR_USER_KEY}@cluster0.712mjau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carServicesCollection = client.db('carTestingDB').collection('services');

    const carServicesOrderCollection = client.db('carTestingDB').collection('serviceOrder');


    app.get('/services', async (req, res) => {
      const cursor = carServicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {     
        // Include only the `title` and `imdb` fields in the returned document
        projection: {title: 1, price: 1, service_id: 1, img:1 },
      };

      const result = await carServicesCollection.findOne(query, options);
      res.send(result);
    })

    // order section

    app.get('/orders', async(req, res) =>{
      let query = {}
      if(req.query?.email){
        query = { email: req.query?.email}
      }
      const result = await carServicesOrderCollection.find(query).toArray();
      res.send(result);
    })

  app.post('/orders', async(req, res) =>{
    const order = req.body;
    const result = await carServicesOrderCollection.insertOne(order);
    res.send(result);
  })    

  app.delete('/orders/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await carServicesOrderCollection.deleteOne(query);
    res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
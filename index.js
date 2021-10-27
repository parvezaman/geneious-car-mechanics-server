const express = require('express');        //step 1: start the server
const { MongoClient } = require('mongodb');//step 1: connect server with database
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();                    //step 2: start the server

const port = process.env.PORT || 5000;                       //step 3: start the server

// --------------------------------------------------------------------------------------------------
// cors middleware set up
// --------------------------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbuol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; //step 2: connect server with database

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //step 2: connect server with database

// genius-car-service database credentials
// user: genius-car-service
// password: bhVB7IBPmeqsj3rs


// ---------------------------------------------------------------------------------------------

// codes from mongodb documentation to connect the server with database

// ---------------------------------------------------------------------------------------------

async function run() {
  try {
    await client.connect();

    console.log("trying to connect");


    // create a database
    const database = client.db("genius-car-service");
    const servicesCollection = database.collection("services");

    //GET API: Get all services start
    app.get('/services', async(req, res)=>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //GET API: Get all services end
    // ------------------------------------------------------------------------------

    //GET API: Get single service start

     app.get('/services/:id', async (req, res)=>{
       const id = req.params.id; 

       console.log("getting a single service", id);
       const query = {_id:ObjectId(id)};

       const singleService = await servicesCollection.findOne(query);

       res.json(singleService);
     })

    //GET API: Get single service end



    // taking data from UI and sending to the database start

    // POST API
    app.post('/services', async (req, res)=>{
        const service = req.body;
        console.log("hitting via axios: hit the post api",service);
        // const service ={
        //     "name": "ENGINE DIAGNOSTIC",
        //     "price": "300",
        //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
        // }

        const result = await servicesCollection.insertOne(service);

        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        console.log(result);
        res.json(result);
        // res.send('hit the post api');

    });

    // create a document to insert
    // const doc = {
    //   title: "Record of a Shriveled Datum",
    //   content: "No bytes, no problem. Just insert a document, in MongoDB",
    // }

    // const result = await servicesCollection.insertOne(doc);

    // console.log(`A document was inserted with the _id: ${result.insertedId}`);

    // DELETE API: handle Delete from user interface and remove from database start
    app.delete('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      
      const result = await servicesCollection.deleteOne(query);

      res.json(result);
    });
    // DELETE API: handle Delete from user interface and remove from database end


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


    // taking data from UI and sending to the database end





app.get('/', (req, res) => {            //step 4: start the server
  res.send('Hello World!');
});

app.listen(port, () => {               //step 5: start the server
  console.log(`Example app listening at http://localhost:${port}`);
});
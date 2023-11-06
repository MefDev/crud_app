const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient
const password = process.env.MongoDbPass
const username = process.env.MongoDbUser
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'));
app.set('view engine', 'ejs')

const connectionString = `mongodb+srv://${username}:${password}@cluster0.fo0f3dq.mongodb.net/?retryWrites=true&w=majority`
MongoClient.connect(connectionString).then(client => {
    console.log("Connected to db")
    const db = client.db("star-wars-quotes")
    const quotesCollection = db.collection("quotes")
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body).then(() => res.redirect("/")).catch(err => console.log(err))
    });
    app.get('/', (req, res) => {
        db.collection("quotes").find().toArray().then(data => res.render("index.ejs", {quotes: data})).catch(err=>console.log(err))      
    });
    app.put('/quotes', (req, res) => {
       quotesCollection.findOneAndUpdate(
        {name: "kaka pika"}, 
        {
        $set: {
            name: req.body.name,
            quote: req.body.quote,
        },
       }, {upsert: true}).then(() => res.json('Success')).catch(err => console.log(err))
      })
    app.delete('/quotes', (req,res) =>{
        quotesCollection.deleteOne({name : req.body.name}).then(data => {
            if (data.deletedCount === 0) res.json('No quote to delete')
            res.json("Delete Darth Vader's quote.")
        }).catch(err => console.log(err))
    })
}).catch(err => console.log(err))


app.listen(3000, () =>{
    console.log('listening on 3000');
})










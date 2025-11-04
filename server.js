const express = require('express');
const { ObjectId } = require('mongodb');
const { connectDB, client } = require('./db');
require('dotenv').config();

const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

let feedbackCollection;
let usersCollection;

connectDB().then((collection) => {
    feedbackCollection = collection.feedbackCollection;
    usersCollection = collection.usersCollection;
    
    app.post('/feedbacks', async (req, res) => {
        try {
            const feedback = req.body; 
            const result = await feedbackCollection.insertOne(feedback);
            res.status(201).send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    });
   
    app.get('/feedbacks', async (req, res) => {
        try {
            const feedbacks = await feedbackCollection.find().toArray();
            res.send(feedbacks);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    });

    app.delete('/feedbacks/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await feedbackCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        } catch (err) {
            res.status(500).send({ error: err.message });
        }
    });

    
    app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "User not found" });
        }
        if (password !== user.password) {
            return res.status(400).send({ error: "Incorrect password" });
        }
        res.send({
            message: "Login successful",
            isvalid: true
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
    });


    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});


require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongoose.connect("mongodb://localhost:27017/issueTrackerDB");
mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}`);

const cardSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Card = new mongoose.model("Card", cardSchema);

const exampleCard = new Card({
    title: "This is an example issue",
    content: "Click from the top right to add more"
});

app.route("/api/cards")
    .get((req, res) => {
        Card.find((err, foundCards) => {
            if (err) return console.log(err);
            //If database has no cards, add a default card
            if (foundCards.length === 0) {
                exampleCard.save(err => {
                    if (err) return console.log(err);
                });
            }
            res.json(foundCards)
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;

        const newCard = new Card({
            title: title,
            content: content
        });

        newCard.save(err => {
            if (err) return console.log(err);
            res.json("Success");
        });
    });

app.route("/api/card/:title")
    .get((req, res) => {
        const title = req.params.title;
        Card.findOne({ title: title }, (err, foundCard) => {
            if (err) return console.log(err);
            res.json(foundCard)
        })
    })
    .post((req, res) => {
        Card.deleteOne({ _id: req.body.id }, err => {
            if (err) return console.log(err);
            res.json("Success")
        })
    })
    .patch((req, res) => {
        const title = req.body.previousTitle;
        Card.updateOne(
            { title: title },
            { $set: req.body },
            err => {
                if (err) return console.log(err);
                res.json("Updated");
            }
        );
    });

app.route("/api/search/")
    .post((req, res) => {
        const searchText = req.body.searchValue;

        const regex = new RegExp(escapeRegex(searchText), 'gi');

        Card.find({"title": regex}, (err, foundCards) => {
            if (err) return console.log(err);
            res.json({foundCards})
        })
    })

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

app.listen(port, () => {
    console.log("Server started successfully")
});

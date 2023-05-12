const express = require('express');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const userService = require("./user-service.js");
dotenv.config();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/api/heroes", (req, res) => {
    let name = req.query.name;
    userService.getAllHeroes(name)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })

});

app.get("/api/heroes/:id", (req, res) => {
    userService.getHeroById(req.params.id)
        .then(data => {
            res.json(data);
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })

});

app.post("/api/heroes", (req, res) => {
    userService.addHero(req.body)
        .then(data => res.status(201).json(data))
        .catch((err) => {
            res.status(500).json(err);
        });

});

app.delete("/api/heroes/:id", (req, res) => {
    userService.deleteHero(req.params.id)
        .then(data => {
            res.json(data)
        }).catch(msg => {
            res.status(422).json({ error: msg });
        })
});

app.put("/api/heroes", (req, res) => {
    userService.updateHero(req.body).then(() => { res.json({ "message": "the object updated" }) })
        .catch((err) => {
            res.status(500).json({ "message": "Server internal error" });
        });

});

userService.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
    })
    .catch((err) => {
        console.log("unable to start the server: " + err);
        process.exit();
    });
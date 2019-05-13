const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const connection = require("./data/mongoConnection");
const users = require("./data/users");
const products = require("./data/products");
const ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.json());
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});

async function main() {
    const db = await connection();

    try {
    } catch (e) {
        console.log(e);
        await db.serverConfig.close();
    }
    //await db.serverConfig.close();
}

main().catch(err => {
    console.log(err);
});
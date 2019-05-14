const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const connection = require("./data/mongoConnection");
const users = require("./data/users");
const products = require("./data/products");
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const saltrounds = 16;

app.use(bodyParser.json());
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});

async function main() {
    const db = await connection();

    //let hash = await bcrypt.hash("newpass", saltrounds);
    //await users.createUser(hash, "Laura");
    //await users.updateUser("5cdad32029764eee872a4757", {newPassword: hash});
    //await products.createProduct("Lotion", "Aveeno", ["moisturizing"], ["other lotions"], 7);
    //await products.updateProduct("5cdad3b822e1e0eea2c8f257", {newProductName: "LOTION!"})

    //await users.removeDislike("5cdad32029764eee872a4757", "alcohol pads");
    //console.log(user);

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
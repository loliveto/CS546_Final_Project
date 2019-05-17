const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
const connection = require("./data/mongoConnection");
const cookieParser = require("cookie-parser");
const users = require("./data/users");
const products = require("./data/products");
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const saltrounds = 16;

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());

//===Logging Middleware===
const pathsAccessed = {};
app.use(function (request, response, next) {
    if (!pathsAccessed[request.path]) pathsAccessed[request.path] = 0;
    let currentTime = new Date().toUTCString();

    pathsAccessed[request.path]++;
    //console.log(request.cookies);

    // if (request.cookies.AuthCookie) {
    //     console.log("[" + currentTime + "]: " + request.method + " " + request.originalUrl + " (Authenticated User)");
    // } else {
    //     console.log("[" + currentTime + "]: " + request.method + " " + request.originalUrl + " (Non-Authenticated User)");
    // }

    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});

async function main() {
    const db = await connection();

    let pw = await bcrypt.hash("password", saltrounds);
    //users.createUser(pw, "Laura");
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
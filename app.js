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
const static = express.static(__dirname + "/public");

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use("/public", static);

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
    
    const serum_greenteaseed = await products.createProduct("intensive hydrating serum with green tea seed", "innisfree", ["hydrating", "moisturizing"], ["pore cleaning toner with volcanic cluster", "my real squeeze mask 5-pack"], 27.00, ".../views/pages/images/greenteaserum.png");

    // volcanic cluster toner
    const toner_volcaniccluster = await products.createProduct("pore cleaning toner with volcanic cluster", "innisfree", ["toning", "pore cleaning"], ["intensive hydrating serum with green tea seed", "my real squeeze mask 5-pack"], 20.00, ".../views/pages/images/volcclustertoner.png");

    const cleanser_teatree = await products.createProduct("tea tree cleanser", "the body shop", ["cleanses", "imperfection care", "toning"], ["tea tree night mask"], 14.00, ".../views/pages/images/teatreecleanser.png");

    const imperialis = await products.createProduct("imperialis", "lush cosmetics", ["moisturizing"], ["breath of fresh air toner water"], 26.95, ".../views/pages/images/imperialis.jpg");

    const cream_aquamax = await products.createProduct("super aqua max combination watery cream", "nature republic", ["moisturizing", "hydrating", "brightening"], 16.90, ".../views/pages/images/superaquamaxcomb.png");

    const mask_teatree = await products.createProduct("tea tree night mask", "the body shop", ["imperfection care", "toning"], 22.00, ".../views/pages/images/teatreemask.png");

    const sixpack = await products.createProduct("my real squeeze mask 6-pack", "innisfree", ["moisturizing", "imperfection care", "hydrating", "brightening", "toning", "anti-aging"], 10.80, ".../views/pages/images/6pack.png");

    const wgpj = await products.createProduct("watermelon glow pink juice", "glow recipe", ["hydrating", "brightening"], ["intensive hydrating serum with green tea seed"], 39.00, ".../views/pages/images/wpj.png");


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

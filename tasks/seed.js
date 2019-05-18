const dbConnection = require("../data/mongoConnection");
const userdata = require("../data/users");
const productdata = require("../data/products");
const bcrypt = require("bcrypt");
const saltrounds = 16;

const main = async () => {
    console.log("Starting seed.")
    const db = await dbConnection();
    await db.dropDatabase();
    
    const serum_greenteaseed = await productdata.createProduct("intensive hydrating serum with green tea seed", "innisfree", ["hydrating", "moisturizing"], ["pore cleaning toner with volcanic cluster", "my real squeeze mask 5-pack"], 27.00, ".../views/pages/images/greenteaserum.png");
    // volcanic cluster toner
    const toner_volcaniccluster = await productdata.createProduct("pore cleaning toner with volcanic cluster", "innisfree", ["toning", "pore cleaning"], ["intensive hydrating serum with green tea seed", "my real squeeze mask 5-pack"], 20.00, ".../views/pages/images/volcclustertoner.png");
    const cleanser_teatree = await productdata.createProduct("tea tree cleanser", "the body shop", ["cleanses", "imperfection care", "toning"], ["tea tree night mask"], 14.00, ".../views/pages/images/teatreecleanser.png");
    const imperialis = await productdata.createProduct("imperialis", "lush cosmetics", ["moisturizing"], ["breath of fresh air toner water"], 26.95, ".../views/pages/images/imperialis.jpg");
    const cream_aquamax = await productdata.createProduct("super aqua max combination watery cream", "nature republic", ["moisturizing", "hydrating", "brightening"], [], 16.90, ".../views/pages/images/superaquamaxcomb.png");
    const mask_teatree = await productdata.createProduct("tea tree night mask", "the body shop", ["imperfection care", "toning"], [], 22.00, ".../views/pages/images/teatreemask.png");
    const sixpack = await productdata.createProduct("my real squeeze mask 6-pack", "innisfree", ["moisturizing", "imperfection care", "hydrating", "brightening", "toning", "anti-aging"], [], 10.80, ".../views/pages/images/6pack.png");
    const wgpj = await productdata.createProduct("watermelon glow pink juice", "glow recipe", ["hydrating", "brightening"], ["intensive hydrating serum with green tea seed"], 39.00, ".../views/pages/images/wpj.png");

    const laurahash = await bcrypt.hash("laura123", saltrounds);
    const rachelhash = await bcrypt.hash("rachel123", saltrounds);
    const johash = await bcrypt.hash("jo123", saltrounds);

    const laura = await userdata.createUser(laurahash, "Laura");
    const rachel = await userdata.createUser(rachelhash, "Rachel");
    const jo = await userdata.createUser(johash, "Jo");

    /*
    const use = await users.addUser();
    */

    console.log("Done seeding database.");
    await db.serverConfig.close();
};

main().catch(console.log);

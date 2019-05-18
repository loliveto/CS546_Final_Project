const products = require('./products');
const users = require('./users');
const connection = require('./mongoConnection');

// creating products for the database
async function main() {
	// green tea seed serum
	const serum_greenteaseed = await products.createProduct("intensive hydrating serum with green tea seed", "innisfree", ["hydrating", "moisturizing"], ["pore cleaning toner with volcanic cluster", "my real squeeze mask 5-pack"], 27.00, ".../views/pages/images/greenteaserum.png");

	// volcanic cluster toner
	const toner_volcaniccluster = await products.createProduct("pore cleaning toner with volcanic cluster", "innisfree", ["toning", "pore cleaning"], ["intensive hydrating serum with green tea seed", "my real squeeze mask 5-pack"], 20.00, ".../views/pages/images/volcclustertoner.png");

	const cleanser_teatree = await products.createProduct("tea tree cleanser", "the body shop", ["cleanses", "imperfection care", "toning"], ["tea tree night mask"], 14.00, ".../views/pages/images/teatreecleanser.png");

	const imperialis = await products.createProduct("imperialis", "lush cosmetics", ["moisturizing"], ["breath of fresh air toner water"], 26.95, ".../views/pages/images/imperialis.jpg");

	const cream_aquamax = await products.createProduct("super aqua max combination watery cream", "nature republic", ["moisturizing", "hydrating", "brightening"], 16.90, ".../views/pages/images/superaquamaxcomb.png");

	const mask_teatree = await products.createProduct("tea tree night mask", "the body shop", ["imperfection care", "toning"], 22.00, ".../views/pages/images/teatreemask.png");

	const sixpack = await products.createProduct("my real squeeze mask 6-pack", "innisfree", ["moisturizing", "imperfection care", "hydrating", "brightening", "toning", "anti-aging"], 10.80, ".../views/pages/images/6pack.png");

	const wgpj = await products.createProduct("watermelon glow pink juice", "glow recipe", ["hydrating", "brightening"], ["intensive hydrating serum with green tea seed"], 39.00, ".../views/pages/images/wpj.png");

	const toner_brofa = await products.createProduct("breath of fresh air toner", "lush cosmetics", ["toning"], ["pore cleaning toner with volcanic cluster", "imperialis"], 10.95, ".../views/pages/images/breathfreshair.png");

	const aloeveragel = await products.createProduct("aloe vera gel", "nature republic", ["toning", "hydrating"], ["super aqua max combination watery cream"], 6.60, ".../views/pages/images/aloeveragel.png");
}

main().catch(error => {
	console.log(error);
});

const products = require('./products');
const users = require('./users');
const connection = require('./mongoConnection');

// creating products for the database
async function main() {
	const serum_greenteaseed = await products.createProduct("intensive hydrating serum with green tea seed", "innisfree", ["hydrating", "moisturizing"], ["pore cleaning toner with volcanic cluster", "my real squeeze mask 5-pack"], 27.00);

	const toner_volcaniccluster = await products.createProduct("pore cleaning toner with volcanic cluster", "innisfree", ["toning", "pore cleaning"], ["intensive hydrating serum with green tea seed", "my real squeeze mask 5-pack"], 20.00);

	const cleanser_teatree = await products.createProduct("tea tree cleanser", "the body shop", ["cleanses", "imperfection care", "toning"], ["tea tree night mask"], 14.00);

	const imperialis = await products.createProduct("imperialis", "lush cosmetics", ["moisturizing"], ["breath of fresh air toner water"], 26.95);

	const cream_aquamax = await products.createProduct("super aqua max combination watery cream", "nature republic", ["moisturizing", "hydrating", "brightening"], 16.90);

	const mask_teatree = await products.createProduct("tea tree night mask", "the body shop", ["imperfection care", "toning"], 22.00);

	const sixpack = await products.createProduct("my real squeeze mask 6-pack", "innisfree", ["moisturizing", "imperfection care", "hydrating", "brightening", "toning", "anti-aging"], 10.80);

	const wgpj = await products.createProduct("watermelon glow pink juice", "glow recipe", ["hydrating", "brightening"], ["intensive hydrating serum with green tea seed"], 39.00);

	const toner_brofa = await products.createProduct("breath of fresh air toner", "lush cosmetics", ["toning"], ["pore cleaning toner with volcanic cluster", "imperialis"], 10.95);

	const aloeveragel = await products.createProduct("aloe vera gel", "nature republic", ["toning", "hydrating"], ["super aqua max combination watery cream"], 6.60);
}

main().catch(error => {
	console.log(error);
});

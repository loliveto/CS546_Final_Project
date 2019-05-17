const userRoutes = require("./users");
const productRoutes = require("./products");

const constructorMethod = app => {
	app.use('/', userRoutes);
	app.use('/products', productRoutes);
	app.use('*', (req, res) => {
		res.status(404).json({error: "Not found"});
	});
}

module.exports = constructorMethod;

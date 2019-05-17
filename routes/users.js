const express = require("express");
const router = express.Router();
const data = require("../data/users");
const productData = require("../data/products");
const bcrypt = require("bcrypt");
const path = require("path");

// thinking that this path should just render the main page
router.get('/', async(req,res) => {
	console.log(req.cookies);
	if (req.cookies && req.cookies.AuthCookie) {
		res.redirect("/private");
	}
	else {
		res.render("pages/login", {layout:false});
	}
});

// for logging in
router.post("/login", async(req,res) => {
	const un = req.body.name;
	console.log(req.body);
	const searchforuser = await data.getUserByName(un);

	// user doesn't exist in database
	if (!searchforuser) {
		res.render("pages/login", {layout:false, messages: "error: we don't know a user with that name."});
		return;
	}

	const pw = req.body.password;
	const vp = await bcrypt.compare(pw, searchforuser.hashedPassword);
	if (vp) {
		res.cookie("AuthCookie", searchforuser._id, { expires: new Date(Date.now() + 99999) });
		res.redirect("/private");
	}
	else {
		res.render("pages/login", {messages: "invalid password entered."});
	}
});

//creating an account
router.post("/signup", async(req, res) => {

});

// when a user logs in, they should be able taken to their profile page, where they can
// review past searches, 
router.get("/private", async(req, res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		const un = await data.getUserById(req.cookies.AuthCookie);
		if (un) {
			res.render('pages/profile',
			{
				name: un.profile.name,
				prev_searches: un.profile.previousSearches,
				likes: un.profile.likes,
				dislikes: un.profile.dislikes
			});
		}
	}
	else {
		res.status(403).json({layout: false, messages: "you need to be logged in to see this page."});
	}
});

//allows user to logout (logout.handlebars)
router.get("/logout", async (req, res) => {
	res.clearCookie("AuthCookie");
	res.render("pages/login", {layout: false, messages: "you have been logged out."})
});

/*
//browse database (database.handlebars? in static folder maybe)
router.get("/browse", async (req, res) => {
	res.render("static/database", {layout: false});
});
*/

// form page to let a user search for a product in the database
router.post("/search", async (req, res) => {
	const term = req.body;
	if (req.cookies && req.cookies.AuthCookie) {
		if (!term) {
			res.render("pages/search", {layout: false, messages: "you need to enter a term to search."});
		}
		else {
			// TODO: implement the dropdown ?
		}
	}
	else {
		res.status(403).json({layout: false, messages: "you need to be logged in to see this page."});
	}
})

//see specific product (product.handlebars in static folder)
//need getProductById method
router.get("/:id", async (req, res) => {
	const product = await productData.getProductById(req.params.id);
	if (product) {
		res.render('pages/product', 
			{
				productName: product.productName,
				brand: product.brand,
				effects: product.effects,
				price: product.price,
				reviews: product.reviews
			});
	}
	else {
		res.status(404).json({layout: false, messages: "product not found."})
	}

});

module.exports = router;

const express = require("express");
const router = express.Router();
const data = require("../data/users");
const productData = require("../data/products");
const bcrypt = require("bcrypt");
const path = require("path");

//see specific product (product.handlebars in static folder)
//need getProductById method
router.get("/:id", async (req, res) => {
	const product = await productData.getProductById(req.params.id);
	if (product) {
		res.render('pages/product', 
			{
				productid: product._id,
				productName: product.productName,
				brand: product.brand,
				effects: product.effects,
				price: product.price,
				relatedProducts: product.relatedProducts,
				reviews: product.reviews
			});
	}
	else {
		res.status(404).json({layout: false, messages: "product not found."})
	}

});

// form page to let a user search for a product in the database
// router.post("/search", async (req, res) => {
// 	const term = req.body;
// 	if (req.cookies && req.cookies.AuthCookie) {
// 		if (!term) {
// 			res.render("pages/search", {layout: false, messages: "you need to enter a term to search."});
// 		}
// 		else {
// 			// TODO: implement the dropdown ?
// 		}
// 	}
// 	else {
// 		res.status(403).json({layout: false, messages: "you need to be logged in to see this page."});
// 	}
// });

//writing a review for a specific product
router.get("/review/:id", async (req, res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		const product = await productData.getProductById(req.params.id);
		res.render("pages/createReview", {productName: product.productName, productid: product._id})
	} else {
		res.render("pages/error");
	}

});

router.post("/review/:id", async (req, res) => {
	let sentbody = req.body;
	user = await data.getUserById(req.cookies.AuthCookie);
	await productData.addReview(req.params.id, user.profile, sentbody.review)
	let url = "/products/" + req.params.id;
	res.redirect(url);
});

//add a like
router.post("/like/:id", async (req, res) => {
	let product = await productData.getProductById(req.params.id);
	let user = await data.getUserById(req.cookies.AuthCookie);
	let userlikes = user.profile.likes;
	let alreadyliked = false;
	userlikes.forEach(async like => {
		if(like === product.productName){
			alreadyliked = true;
			await data.removeLike(user._id, product.productName);
		}
	});
	if(!alreadyliked){
		await data.addLike(user._id, product.productName);
	}
	let url = "/products/" + req.params.id;
	res.redirect(url);
});

//add a dislike
router.post("/dislike/:id", async (req, res) => {
	let product = await productData.getProductById(req.params.id);
	let user = await data.getUserById(req.cookies.AuthCookie);
	let userldisikes = user.profile.dislikes;
	let alreadydisliked = false;
	userldisikes.forEach(async dislike => {
		if(dislike === product.productName){
			alreadydisliked = true;
			await data.removeDislike(user._id, product.productName);
		}
	});
	if(!alreadydisliked){
		await data.addDislike(user._id, product.productName);
	}
	let url = "/products/" + req.params.id;
	res.redirect(url);
});

module.exports = router;

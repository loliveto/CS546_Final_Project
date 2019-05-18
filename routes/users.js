const express = require("express");
const router = express.Router();
const data = require("../data/users");
const productData = require("../data/products");
const bcrypt = require("bcrypt");
const saltrounds = 16;
const path = require("path");

async function uniqueName(name) {
	users = await data.getAllUsers();
	let uniqueName = true;
	users.forEach(user => {
		if (user.profile.name === name) {
			uniqueName = false;
		}
	});
	return uniqueName;
}

// thinking that this path should just render the main page
router.get('/', async (req, res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		res.redirect("/private");
	}
	else {
		res.render("pages/login");
	}
});

// for logging in
router.post("/login", async (req, res) => {
	const un = req.body.name;
	//console.log(req.body);
	let searchforuser;
	try {
		searchforuser = await data.getUserByName(un);
	} catch (e) { }

	// user doesn't exist in database
	if (!searchforuser) {
		res.render("pages/login", {messages: "error: we don't know a user with that name." });
		return;
	}

	const pw = req.body.password;
	const vp = await bcrypt.compare(pw, searchforuser.hashedPassword);
	if (vp) {
		res.cookie("AuthCookie", searchforuser._id, { expires: new Date(Date.now() + 99999) });
		res.redirect("/private");
	}
	else {
		res.render("pages/login", { messages: "invalid password entered." });
	}
});

//creating an account
router.post("/signup", async (req, res) => {
	let sentbody = req.body;
	if (!sentbody.newname || !sentbody.newpassword) {
		res.render("pages/login", { SUmessages: "Please complete the form." });
	} else {
		let hash = await bcrypt.hash(sentbody.newpassword, saltrounds);
		let uniqName = await uniqueName(sentbody.newname);
		
		if (!uniqName) {
			res.render("pages/login", { SUmessages: "Sorry, somebody already has that name!" });
		} else {
			data.createUser(hash, sentbody.newname);
			res.render("pages/login", {messages: "Account created sucessfully! Log in with your new credentials." });
		}
	}

});

// when a user logs in, they should be able taken to their profile page, where they can
// review past searches, 
router.get("/private", async (req, res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		let un;
		try {
			un = await data.getUserById(req.cookies.AuthCookie);
		} catch (e) { }

		if (un) {
			res.render('pages/profile',
				{
					name: un.profile.name,
					prevsearches: un.profile.prevSearches,
					likes: un.profile.likes,
					dislikes: un.profile.dislikes
				});
		}
	}
	else {
		res.status(403).json({messages: "you need to be logged in to see this page." });
	}
});

//allows user to logout (logout.handlebars)
router.get("/logout", async (req, res) => {
	res.clearCookie("AuthCookie");
	res.render("pages/login", {messages: "you have been logged out." })
});

/*
//browse database (database.handlebars? in static folder maybe)
router.get("/browse", async (req, res) => {
	res.render("static/database", {layout: false});
});
*/

router.get("/search", async (req, res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		const user = await data.getUserById(req.cookies.AuthCookie);
		let reslist = [""];
		res.render("pages/search", {resultList: reslist, prevsearches: user.profile.prevSearches});
	}
	else {
		res.status(403).json({messages: "you need to be logged in to see this page."});
	}
});

// form page to let a user search for a product in the database
router.post("/search", async (req, res) => {
	const term = req.body.keywords;
	const plist = await productData.getAllProducts();
	const user = await data.getUserById(req.cookies.AuthCookie);
	let reslist = [];
	if (req.cookies && req.cookies.AuthCookie) {
		if (!term) {
			reslist = [""];
			res.render("pages/search", {resultList: reslist, messages: "you need to enter a term to search.", prevsearches: user.profile.prevSearches});
		}
		else {
			await data.addPrevSearch(req.cookies.AuthCookie, term);
			plist.forEach(prod => {
				if(prod.productName === term || prod.brand === term){
					reslist.push(prod);
				}else{
					prod.effects.forEach(ef => {
						if(ef === term){
							reslist.push(prod);
						}
					})
				}
			});
			if (reslist.length == 0) {
				res.render("pages/search", {term: term, prevsearches: user.profile.prevSearches});
			}else{
				res.render("pages/search", {resultList: reslist, prevsearches: user.profile.prevSearches});
			}
		}
	}
	else {
		res.status(403).json({messages: "you need to be logged in to see this page."});
	}
});

module.exports = router;

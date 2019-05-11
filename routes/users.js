const express = require("express");
const router = express.Router();
const data = require("../data/users");
const bcrypt = require("bcrypt");
const path = require("path");

// thinking that this path should just render the main page
router.get('/', async(req,res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		res.redirect("/private");
	}
	else {
		res.render("static/login", {layout:false});
	}
});

// for logging in
router.post("/login", async(req,res) => {
	const un = req.body.username;
	const searchforuser = await data.getByUsername(un);

	// user doesn't exist in database
	if (!searchforuser) {
		res.render("static/login", {layout:false, messages: "error: we don't know a user with that name."});
		return;
	}

	const pw = req.body.password;
	const vp = await bcrypt.compare(password, searchforuser.hashedPassword);
	if (vp) {
		res.cookie("AuthCookie", searchforuser._id, { expires: new Date(Date.now() + 99999) });
		res.redirect("/private");
	}
	else {
		res.render("static/login", layout: false, messages: "invalid password entered.");
	}
});

// when a user logs in, they should be able taken to their profile page, where they can
// review past searches, 
router.get("/private", async(req, res) => {
	if (req.cookies && req.cookies.AuthCookie) {
		const un = await data.getById(req.cookies.AuthCookie);
		if (un) {
			res.render('layouts/main',
			{
				username: un.username,
				name: un.name,
				prev_searches: un.previousSearches,
				likes: un.likes,
				dislikes: un.dislikes
			});
		}
	}
	else {
		res.status(403).json({layout: false, messages: "you need to be logged in to see this page."});
	}
});

module.exports = router;

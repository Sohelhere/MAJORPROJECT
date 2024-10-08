const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn , isOwner , listingValidate} = require("../middleware.js");
const { populate } = require('../models/Reviews.js');
const listingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get( asyncWrap(listingController.index))
 .post(upload.single("listing[image]"),  listingValidate, isLoggedIn,  asyncWrap(listingController.createListing));


//NEW ROUTE
router.get("/new", isLoggedIn,  (req, res)=>{
    res.render("listings/new.ejs");
});

router
.route("/:id")
.get( asyncWrap(listingController.showListing))
.put( upload.single("listing[image]"),listingValidate, isLoggedIn, isOwner, asyncWrap(listingController.updateListing))
.delete(isLoggedIn, isOwner,  asyncWrap(listingController.destroyListing));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner,  asyncWrap(listingController.editListing));

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require('../utils/asyncWrap.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const controllerUser = require("../controller/users.js");

router.
route("/signup")
.get(controllerUser.renderSignUpForm)
.post(asyncWrap(controllerUser.signup));

router
.route("/login")
.get(controllerUser.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),controllerUser.login);

router.get("/logout", controllerUser.logout);

module.exports = router;
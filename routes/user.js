const express = require("express");
const router = express.Router({mergeParams:true});
const controller = require("../controller/users.js");
const { isBanned,isLoggedIn,saveRedirectUrl } = require("../middleware.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");


router.route("/signup")
    .get(controller.signup);

router.route("/login/federated/google")
    .get(controller.loginGoogle)

router.route('/oauth2/redirect/google')
    .get(saveRedirectUrl,passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),controller.auth);

router.route("/profile")
    .get(isLoggedIn,isBanned,controller.renderProfileForm)
    .put(isLoggedIn, isBanned,wrapAsync(controller.updateProfile));

router.route("/logout")
    .get(isLoggedIn, controller.logout)

router.route("/save/:id")
    .post(isLoggedIn,isBanned,wrapAsync(controller.bookmark));

module.exports = router;
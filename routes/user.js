const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const { renderSignupForm, signup, renderLoginForm, login, logout } = require("../controllers/user.js");

router.get("/signup", renderSignupForm)
router.post("/signup", wrapAsync(signup))

router.get("/login", renderLoginForm)
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), login)

router.get("/logout",logout)

module.exports = router;
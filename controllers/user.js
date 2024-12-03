let User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newuser = new User({ email, username })
        let registerUser = await User.register(newuser, password)
        req.login(registerUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome To Wanderlust")
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust, you are login!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "You are logout!")
        res.redirect("/listings")
    })
}
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const mo = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsynce = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
// const { ListingSchema, reviewSchema } = require("./schema.js")
// const Review = require("./models/review.js")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")

// const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
const dbURL = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto :{
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600
})

store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption))
app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(mo("_m"))
app.use(express.static(path.join(__dirname, "/public")))

main().then((res) => {
    console.log("DataBase connected")
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(dbURL);
}

app.listen(8080, () => {
    console.log("App Listening on port : ", 8080);
})

// app.get("/", (req, res) => {
//     res.send("App runung....")
// })

app.get("/test", (req,res)=>{
    res.render("index/test.ejs")
})

app.use("/listings", listingsRouter)
app.use("/listings/:_id/reviews", reviewsRouter)
app.use("/", userRouter)





app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"), { currUser: req.user });
    // res.send("Page Not Found!")
});

//Error Heandleing
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error", { err })
});
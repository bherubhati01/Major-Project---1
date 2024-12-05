const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));

app.listen(3000, ()=>{
    console.log("Port : ", 3000)
})

app.get("/", (req,res)=>{
    res.render("test1")
})

app.post("/test",(req,res)=>{
    console.log(req.body)
    res.redirect("/")
})
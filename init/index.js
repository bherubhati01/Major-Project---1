const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then((res)=>{
    console.log("DataBase connected")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner :"67403c7ed206a2bd38dd51dd" }))
    await Listing.insertMany(initData.data)
    console.log("Data inited")
}

initDB();
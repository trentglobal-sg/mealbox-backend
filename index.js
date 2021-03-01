// Setup start
const express = require("express");
const cors = require("cors")
require("dotenv").config();
const MongoUtil = require("./MongoUtil");
const mongoUrl = process.env.MONGO_URL;
const ObjectId = require("mongodb").ObjectId;
let app = express ();
app.use(express.json());
app.use(cors());
// Setup end


async function main(){
    let db = await MongoUtil.connect(mongoUrl, "tgc-11")
    console.log("Database connected")
}

main()


// Route begins here
app.listen(3000, () => {
    console.log("server has started")
})
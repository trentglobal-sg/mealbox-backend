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

    // Post - Add new document
    app.post("/task", async (req,res)=>{
        let title = req.body.title
        let done = req.body.done

        try {
            let results = await db.collection("tasks").insertOne({
                title : title,
                done: done
            })
            res.status(200)
            res.send(results)
        } catch (e) {
            res.status (500)
            res.send({
                "Message" : "Unable to insert"
            });
            console.log(e)
        }
    })
}

main()


// Route begins here
app.listen(3000, () => {
    console.log("server has started")
})
// Setup start
const express = require("express");
const cors = require("cors")
require("dotenv").config();
const MongoUtil = require("./MongoUtil");
const mongoUrl = process.env.MONGO_URL;
const ObjectId = require("mongodb").ObjectId;
let app = express();
app.use(express.json());
app.use(cors());
// Setup end


async function main() {
    let db = await MongoUtil.connect(mongoUrl, "tgc-11")

    // For "comments" collection
    // Get - Fetch comment
    app.get("/comments", async (req, res) => {
        try {
            let comments = await db.collection("comments").find().toArray();
            res.status(200)
            res.send(comments)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to get information"
            })
        }
    })

    // Post - Add new comment
    app.post("/comments", async (req, res) => {
        let comments = req.body.comments
        let username = req.body.username
        let recipe_id = req.body.recipe_id
        let recipe_name = req.body.recipe_name
        let user_id = req.body.user_id

        try {
            let results = await db.collection("comments").insertOne({
                username: username,
                user_id: user_id,
                comments: comments,
                recipe_name: recipe_name,
                recipe_id: recipe_id,
            })
            res.status(200)
            res.send(results)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to insert comments"
            });
            console.log(e)
        }
    })

    // Put comment
    app.put("/comments", async (req, res) => {
        try {
            await db.collection("comments").updateOne(
                {
                    _id: ObjectId(req.body._id)
                },
                {
                    '$set': {
                        "username": req.body.username,
                        "user_id": req.body.user_id,
                        "comments": req.body.comments,
                        "recipe_name": req.body.recipe_name,
                        "recipe_id": req.body.recipe_id,
                    }
                });
            res.status(200);
            res.send({
                'message': 'OK'
            })
        } catch (e) {
            res.status(500);
            res.send({
                'message': "Unable to update"
            })
            console.log(e);
        }
    });
    // Delete comment
    app.delete("/comments/:id", async (req, res) => {
        try {
            await db.collection("comments").deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.status(200);
            res.send({
                "Message": "Deleted request"
            })

        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to delete request"
            })
        }
    })


    // For "recipes" collection
    // Get - Fetch Recipes
    app.get("/recipe", async (req, res) => {
        try {
            let comments = await db.collection("recipes").find().toArray();
            res.status(200)
            res.send(comments)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to get recipes"
            })
        }
    })

    // Post A Recipe URL 
    // This URL is given to selected users for them to upload recipe into the system
    // Limitation due to account-login authentication not implemented into system yet

    app.post("/recipe", async (req, res) => {
        let recipe_name = req.body.recipe_name
        let description = req.body.description
        let ingredients = req.body.ingredients
        let cuisine_type = req.body.cuisine_type
        let tags = req.body.tags
        let instructions = req.body.instructions
        let difficulty = req.body.difficulty
        let cooking_time = req.body.cooking_time
        let preparation_time = req.body.preparation_time
        let serving = req.body.serving

        try {
            let results = await db.collection("recipes").insertOne({
                recipe_name: recipe_name,
                description: description,
                ingredients: ingredients,
                cuisine_type: cuisine_type,
                tags: tags,
                instructions: instructions,
                difficulty: difficulty,
                cooking_time: cooking_time,
                preparation_time: preparation_time,
                serving: serving
            })
            res.status(200)
            res.send(results)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to insert recipe"
            });
            console.log(e)
        }
    })
}

main()


// Route begins here
app.listen(3001, () => {
    console.log("server has started")
})
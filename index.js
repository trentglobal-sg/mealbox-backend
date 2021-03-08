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
        try {
            let results = await db.collection("comments").insertOne({
                username: req.body.username,
                user_id: req.body.user_id,
                comments: req.body.comments,
                recipe_name: req.body.recipe_name,
                recipe_id: req.body.recipe_id,
                last_updated: new Date()
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
    app.get("/recipes", async (req, res) => {
        try {
            let recipes = await db.collection("recipes").find().toArray();
            res.status(200)
            res.send(recipes)
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

    app.post("/recipes", async (req, res) => {
        try {
            let results = await db.collection("recipes").insertOne({
                recipe_name: req.body.recipe_name,
                description: req.body.description,
                ingredients: req.body.ingredients,
                cuisine_type: req.body.cuisine_type,
                tags: req.body.tags,
                instructions: req.body.instructions,
                difficulty: req.body.difficulty,
                cooking_time: req.body.cooking_time,
                preparation_time: req.body.preparation_time,
                serving: req.body.serving,
                created_by: req.body.created_by,
                created_on: new Date()
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

    // Delete for recipes
    app.delete("/recipes/:id", async (req, res) => {
        try {
            await db.collection("recipes").deleteOne({
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

    // For "resource" collection
    // Get - Fetch resources
    app.get("/resources", async (req, res) => {
        try {
            let resources = await db.collection("resources").find().toArray();
            res.status(200)
            res.send(resources)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to get resource"
            })
        }
    })

    // Post - Add new resource
    app.post("/resources", async (req, res) => {
        try {
            let results = await db.collection("resources").insertOne({
                img_url: req.body.img_url,
            })
            res.status(200)
            res.send(results)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to insert resource"
            });
            console.log(e)
        }
    })

    // Delete for resources
    app.delete("/resources/:id", async (req, res) => {
        try {
            await db.collection("resources").deleteOne({
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
}


main()


// Route begins here
app.listen(3001, () => {
        console.log("server has started")
    })
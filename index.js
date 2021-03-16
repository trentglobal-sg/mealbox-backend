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
                "Message": "Unable to get comments"
            })
        }
    })

    // To send back all comments on the recipe based on the id
    app.post("/comments/individual", async (req, res) => {
        // let id = req.body.recipe_id
        try {
            let comments = await db.collection("comments").find({
                recipe_id: ObjectId(req.body.recipe_id)
            }).project(
                {
                    _id: 1,
                    recipe_id: 1,
                    username: 1,
                    comments: 1
                }
            ).toArray()
            res.send(comments)
            res.status(200)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": `No comments found`
            })
        }
    })

    // Post - Add new comment
    app.post("/comments", async (req, res) => {
        try {
            let results = await db.collection("comments").insertOne({
                recipe_id: ObjectId(req.body.recipe_id),
                username: req.body.username,
                comments: req.body.comments,
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
                        recipe_id: ObjectId(req.body.recipe_id),
                        username: req.body.username,
                        comments: req.body.comments,
                        last_updated: new Date()
                    }
                });
            res.status(200);
            res.send({
                'message': 'Updated Comments'
            })
        } catch (e) {
            res.status(500);
            res.send({
                'message': "Unable to update comments"
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
    // To send back individual recipe based on the id
    app.post("/recipes/individual", async (req, res) => {
        let id = req.body.recipe_id
        try {
            let results = await db.collection("recipes").findOne({
                _id: ObjectId(id)
            })
            res.send(results)
            res.status(200)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "No recipe found"
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
                created_on: new Date(),
                resource: {
                    _id: ObjectId(req.body.resource._id),
                    img_url: req.body.resource.img_url
                }
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

    // Put - Edit recipes
    app.put("/recipes", async (req, res) => {
        try {
            await db.collection("recipes").updateOne(
                {
                    _id: ObjectId(req.body.recipe_id)
                },
                {
                    '$set': {
                        _id: ObjectId(req.body.recipe_id),
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
                        resource: {
                            _id: ObjectId(req.body.resource._id),
                            img_url: req.body.resource.img_url
                        }

                    }
                });
            res.status(200);
            res.send({
                'Message': 'Updated Recipe'
            })
        } catch (e) {
            res.status(500);
            res.send({
                'Message': "Unable to update recipe"
            })
            console.log(e);
        }
    });

    // Delete for recipes
    app.delete("/recipes/:id", async (req, res) => {
        try {
            await db.collection("recipes").deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.status(200);
            res.send({
                "Message": "Deleted Recipe"
            })

        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to delete recipe"
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

      // Put - Edit resource
    app.put("/resources", async (req, res) => {
        try {
            let results = await db.collection("resources").updateOne({
                _id: ObjectId(req.body._id)
            },
            {
                "$set":{
                    _id: ObjectId(req.body._id),
                    img_url: req.body.img_url
                }
            })
            res.status(200)
            res.send({
                "Message": "Updated Resource"
            })
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
                "Message": "Deleted resource"
            })

        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to delete resource"
            })
        }
    })
}


main()


// Route begins here
app.listen(3001, () => {
    console.log("server has started")
})
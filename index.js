// Setup start
const express = require("express");
const cors = require("cors")
require("dotenv").config();
const MongoUtil = require("./MongoUtil");
const mongoUrl = process.env.MONGO_URI;
const ObjectId = require("mongodb").ObjectId;
let app = express();
app.use(express.json());
app.use(cors());
// Setup end

async function main() {
    let db = await MongoUtil.connect(mongoUrl, process.env.DB_NAME)

    app.get("/", (req, res) => {
        res.send("Hello World")
    });

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
    app.get("/recipes/:id/comments", async (req, res) => {
        let id = req.params.id;
        try {
            let comments = await db.collection("comments").find({
                recipe_id: new ObjectId(id)
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
            console.error(e);
            res.status(500)
            res.send({
                "Message": `No comments found`
            })
        }
    })

     // To send back comment based on search
    app.get("/comments/:recipe_id/search", async (req, res) => {
        let criteria={
            recipe_id: new ObjectId(req.params.recipe_id)
        };
        if (req.body.search_query){
            criteria["comments"] = {
                     $regex: req.body.search_query, $options:"i"
            }
        }
        try {
            let results = await db.collection("comments").find(criteria).toArray()
            res.send(results)
            res.status(200)
        } catch (e) {
            console.error(e);
            res.status(500)
            res.send({
                "Message": "No recipe found"
            })
        }
    })

    // Post - Add new comment
    app.post("/comments", async (req, res) => {
        try {
            let results = await db.collection("comments").insertOne({
                recipe_id: new ObjectId(req.body.recipe_id),
                username: req.body.username,
                comments: req.body.comments,
                last_updated: new Date()
            })
            res.status(200)
            res.send({
                "Message": "Comments Inserted"
            })
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
                "Message": "Deleted comment"
            })

        } catch (e) {
            res.status(500)
            res.send({
                "Message": "Unable to delete comment"
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

  

    // To send back recipe based on search
    app.get("/recipes/search", async (req, res) => {
    
        let criteria={};
        if (req.query.recipe_name){
            criteria["recipe_name"] = {
                     $regex: req.query.recipe_name, $options:"i"
            }
        }
        if (req.query.difficulty){
            criteria["difficulty"] = {
                     $in : [req.query.difficulty]
            }
        }
        if (req.query.cuisine_type){
            criteria["cuisine_type"] = {
                     $in : [req.query.cuisine_type]
            }
        }

        try {
            let results = await db.collection("recipes").find(criteria).toArray()
            res.send(results)
            res.status(200)
        } catch (e) {
            res.status(500)
            res.send({
                "Message": "No recipe found"
            })
        }
    })

      // To send back individual recipe based on the id
      app.get("/recipes/:id", async (req, res) => {

        let id = req.params.id;
        try {
            let results = await db.collection("recipes").findOne({
                _id: new ObjectId(id)
            })
            res.send(results)
            res.status(200)
        } catch (e) {
            console.error(e);
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
                    _id: new ObjectId(req.body.resource._id),
                    img_url: req.body.resource.img_url
                }
            })
            res.status(200)
            res.send({"Message":"Recipe Created"})
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
                    _id: new ObjectId(req.body.recipe_id)
                },
                {
                    '$set': {
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
                            _id: new ObjectId(req.body.resource._id),
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
                _id: new ObjectId(req.params.id)
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
    app.put("/resources/:id", async (req, res) => {
        try {
            let results = await db.collection("resources").updateOne({
                _id: new ObjectId(req.params.id)
            },
            {
                "$set":{
                    _id: new ObjectId(req.params.id),
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
                _id:  new ObjectId(req.params.id)
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
app.listen(process.env.PORT, () => {
    console.log("server has started")
})
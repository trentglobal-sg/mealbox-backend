require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

(async () => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);

        await db.collection("recipes").deleteMany({});
        await db.collection("resources").deleteMany({});
        await db.collection("comments").deleteMany({});

        // Recipe seeds
        const recipes = [
            {
                recipe_name: "Fettuccini Carbonara",
                description: "A rich and creamy Italian pasta dish that's perfect for date nights.",
                ingredients: ["Olive oil", "Shallots", "Onion", "Bacon", "Garlic", "Fettucini pasta", "Egg yolks", "Heavy cream", "Parmesan cheese", "Salt", "Pepper"],
                cuisine_type: "Italian",
                tags: ["Date Night Special", "Comfort Food"],
                instructions: ["Saute shallots, onion and bacon.", "Cook pasta.", "Toss pasta with egg mixture and bacon."],
                difficulty: "Moderate",
                cooking_time: "25 minutes",
                preparation_time: "10 minutes",
                serving: 6,
                created_by: "Sarah J.Pixy"
            },
            {
                recipe_name: "Chicken Teriyaki Bowl",
                description: "Classic Japanese rice bowl with tender chicken and teriyaki sauce.",
                ingredients: ["Chicken thighs", "Soy sauce", "Mirin", "Sugar", "Ginger", "Garlic", "Rice", "Sesame seeds", "Green onions"],
                cuisine_type: "Japanese",
                tags: ["Quick Meal", "Healthy"],
                instructions: ["Marinate chicken.", "Cook chicken until caramelized.", "Serve over rice."],
                difficulty: "Easy",
                cooking_time: "20 minutes",
                preparation_time: "10 minutes",
                serving: 2,
                created_by: "Kenji Yamamoto"
            },
            {
                recipe_name: "Spicy Shakshuka",
                description: "A flavorful dish with poached eggs in a spicy tomato sauce.",
                ingredients: ["Olive oil", "Onion", "Red bell pepper", "Garlic", "Cumin", "Paprika", "Chili flakes", "Tomatoes", "Eggs", "Cilantro"],
                cuisine_type: "Middle Eastern",
                tags: ["Vegetarian", "Brunch"],
                instructions: ["Saute veggies.", "Simmer tomatoes.", "Poach eggs in sauce."],
                difficulty: "Moderate",
                cooking_time: "30 minutes",
                preparation_time: "10 minutes",
                serving: 4,
                created_by: "Amira El-Haddad"
            },
            {
                recipe_name: "Beef Tacos",
                description: "Mexican street-style tacos with seasoned beef and fresh toppings.",
                ingredients: ["Taco shells", "Ground beef", "Cumin", "Paprika", "Onion", "Tomatoes", "Lettuce", "Cheese", "Sour cream"],
                cuisine_type: "Mexican",
                tags: ["Street Food", "Family Dinner"],
                instructions: ["Cook beef with spices.", "Fill taco shells.", "Top with veggies and cheese."],
                difficulty: "Easy",
                cooking_time: "15 minutes",
                preparation_time: "10 minutes",
                serving: 4,
                created_by: "Carlos Mendez"
            },
            {
                recipe_name: "Pad Thai",
                description: "Thai stir-fried noodles with shrimp, tofu, and peanuts.",
                ingredients: ["Rice noodles", "Shrimp", "Tofu", "Eggs", "Bean sprouts", "Peanuts", "Tamarind paste", "Fish sauce"],
                cuisine_type: "Thai",
                tags: ["Street Food", "Savory"],
                instructions: ["Soak noodles.", "Stir-fry all ingredients.", "Top with peanuts and lime."],
                difficulty: "Moderate",
                cooking_time: "25 minutes",
                preparation_time: "15 minutes",
                serving: 3,
                created_by: "Nong Bua"
            },
            {
                recipe_name: "French Onion Soup",
                description: "Caramelized onions in a rich broth topped with cheese toast.",
                ingredients: ["Onions", "Butter", "Beef broth", "Thyme", "Baguette", "Gruyere cheese"],
                cuisine_type: "French",
                tags: ["Comfort Food", "Classic"],
                instructions: ["Caramelize onions.", "Simmer broth.", "Serve with cheesy baguette."],
                difficulty: "Moderate",
                cooking_time: "45 minutes",
                preparation_time: "15 minutes",
                serving: 4,
                created_by: "Jean Dupont"
            },
            {
                recipe_name: "Butter Chicken",
                description: "Indian curry with tender chicken in a creamy tomato sauce.",
                ingredients: ["Chicken", "Butter", "Tomatoes", "Cream", "Garam masala", "Garlic", "Ginger"],
                cuisine_type: "Indian",
                tags: ["Curry", "Spicy"],
                instructions: ["Marinate chicken.", "Cook sauce.", "Combine and simmer."],
                difficulty: "Moderate",
                cooking_time: "30 minutes",
                preparation_time: "20 minutes",
                serving: 4,
                created_by: "Anita Kapoor"
            },
            {
                recipe_name: "Caesar Salad",
                description: "Crisp romaine lettuce tossed in creamy Caesar dressing.",
                ingredients: ["Romaine lettuce", "Croutons", "Parmesan", "Caesar dressing", "Anchovies (optional)"],
                cuisine_type: "American",
                tags: ["Salad", "Light"],
                instructions: ["Toss lettuce with dressing.", "Top with croutons and cheese."],
                difficulty: "Easy",
                cooking_time: "0 minutes",
                preparation_time: "10 minutes",
                serving: 2,
                created_by: "Rachel Green"
            },
            {
                recipe_name: "Miso Ramen",
                description: "Savory Japanese noodle soup with miso broth and pork belly.",
                ingredients: ["Ramen noodles", "Miso paste", "Pork belly", "Soy sauce", "Eggs", "Green onions", "Nori"],
                cuisine_type: "Japanese",
                tags: ["Comfort Food", "Soup"],
                instructions: ["Make miso broth.", "Cook pork belly.", "Assemble with noodles and toppings."],
                difficulty: "Hard",
                cooking_time: "60 minutes",
                preparation_time: "20 minutes",
                serving: 2,
                created_by: "Hikaru Saito"
            },
            {
                recipe_name: "Greek Moussaka",
                description: "Layered eggplant and beef casserole with creamy béchamel sauce.",
                ingredients: ["Eggplant", "Ground beef", "Onion", "Tomato paste", "Potatoes", "Béchamel sauce"],
                cuisine_type: "Greek",
                tags: ["Baked", "Hearty"],
                instructions: ["Fry eggplant and potatoes.", "Cook beef sauce.", "Layer and bake."],
                difficulty: "Hard",
                cooking_time: "60 minutes",
                preparation_time: "30 minutes",
                serving: 6,
                created_by: "Yannis Papadopoulos"
            }
        ];

        // Generate ObjectIDs and resources
        recipes.forEach(r => r._id = new ObjectId());

        const resources = recipes.map(recipe => ({
            _id: new ObjectId(),
            img_url: `https://via.placeholder.com/600x400?text=${encodeURIComponent(recipe.recipe_name)}`
        }));

        recipes.forEach((recipe, index) => {
            recipe.resource = {
                _id: resources[index]._id,
                img_url: resources[index].img_url
            };
        });

        // Generate 2-3 comments per recipe
        const comments = [];
        const usernames = ["foodie_john", "quickchef23", "brunchlover", "chef_amy", "spicy_mama", "veggie_vince"];

        recipes.forEach((recipe, i) => {
            const commentCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 comments
            for (let j = 0; j < commentCount; j++) {
                comments.push({
                    _id: new ObjectId(),
                    comments: `Sample comment ${j + 1} for ${recipe.recipe_name}`,
                    username: usernames[Math.floor(Math.random() * usernames.length)],
                    recipe_name: recipe.recipe_name,
                    recipe_id: recipe._id,
                    user_id: 100 + j + i * 3
                });
            }
        });

        await db.collection("recipes").insertMany(recipes);
        await db.collection("resources").insertMany(resources);
        await db.collection("comments").insertMany(comments);

        console.log(`✅ Inserted ${recipes.length} recipes, ${resources.length} resources, ${comments.length} comments.`);
    } catch (err) {
        console.error("❌ Error inserting data:", err);
    } finally {
        await client.close();
    }
})();

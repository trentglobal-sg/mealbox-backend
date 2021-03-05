# Reactive Frontend Frameworks and RESTful API Development

# **Mealbox**
## Context
This project aims to create an interactive web application using React and creating my own RESTful API using Mongo and Express. 

This application serve the following purpose:
* Allow user to follow recipes 

# Structure
## Content Information
### Information required on the recipes to recreate
```
(Resources) Collection 1:
(All information to be stored as URL, string)
Videos of the recipe 
Images of the end product 
Recipe id
Recipe Name

(Recipes) Collection 2:
Recipe Name (string)
Short Description (string) (No more than 100 characters)
Ingredients Required (Array of strings)
Cuisine type (String) (Drop down)
Tags (Array) (Multiple Select)
Instructions (Array of strings) 
Comments (Array of object)
Difficulty (string) (Radio) 
Cooking Time "(String) 
Preperation Time (Integer)
Serving (Integer)


(Comment) Collection 3:
_id : Comment id (ObjectId)
Comments (string)
Reviewer Name (string)
user id (string)
Recipe ID 
Recipe Name
```

## Content Structure
###  Home page

* Contain a hero section that allows user to search cuisine name or cuisine type. 
* Description of the website and it's objective
* Most popular (By number of comments)

### Recipe Search Page

* Listing of all the Recipe
    * Key information of the recipe
        * Recipe Name
        * Image of the end product
        * Short Description
        * Difficulty
        * Cuisine Type 
        * Created By
        * Date
        * Show last updated if any
* Filtering Options 
     * By Cuisine type
     * By Difficulty
     * By Tags
     * By Cooking Time

### Individual Recipe Page
* Image of the end product
* Video of the recipe
* Preperation Time (Integer)
* Serving (Integer)
* Cusine Type
* Tags
* Ingredient Required
* Insutrctions
    * Step 1: 
    * Step 2:
    * Step 3:
    * Notes: 
* Difficulty
    * Easy
    * Moderate
    * Hard





const express = require('express');

const { 
    getRecipies,
    getRecipe,
    getRecipeComments,
    getAllRatingsForRecipe,
    getRecipiesFromUser
} = require('../controllers/recipeController')

const router = express.Router();

router.get('/user', getRecipiesFromUser);
// GET all recipes
router.get('/', getRecipies);

// GET a single recipe
router.get('/:id', getRecipe);

// GET all comments for a recipe
router.get('/:id/comments', getRecipeComments);

router.get('/:id/ratings', getAllRatingsForRecipe);

module.exports = router;

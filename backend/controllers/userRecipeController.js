const Recipe = require('../models/recipeModel');
const Comment = require('../models/commentModel');
const Rate = require('../models/rateModel');

const getUsersRecipes = async (req, res) => {
    const user_id = req.user._id

    const recipes = await Recipe.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(recipes)
}

// POST a new recipe
const createRecipe = async (req, res) => {
    const { title, description, ingredients } = req.body;

    if (!title || !description || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'All fields are required and ingredients must be a non-empty array' });
    }

    try {
        const user_id = req.user._id
        const recipe = await Recipe.create({ title, description, ingredients, user_id });
        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// DELETE a recipe
const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByIdAndDelete(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// UPDATE a recipe
const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const recipe = await Recipe.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addRatingToRecipe = async (recipeId, userId, rating) => {
    try {
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const existingRatingIndex = recipe.ratings.findIndex(r => r.user_id.toString() === userId.toString());
        if (existingRatingIndex !== -1) {
            recipe.ratings[existingRatingIndex].rating = rating;
        } else {
            recipe.ratings.push({ user_id: userId, rating });
        }

        await recipe.save();

        return recipe;
    } catch (error) {
        throw Error('Could not add/update rating to recipe: ' + error.message);
    }
}

const addCommentToRecipe = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const user_id = req.user._id; 

    try {
        const newComment = await Comment.create({ recipe_id: id, user_id, comment });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const rateRecipe = async (req, res) => {
    const { id } = req.params
    const user_id = req.user._id
    const { rating } = req.body;

    try {
        const existingRating = await Rate.findOne({ recipe: id, user: user_id });
        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
            res.json(existingRating);
        } else {
            const newRating = new Rate({
                recipe: id,
                user: user_id,
                rating: rating
            });
            await newRating.save();
            res.json(newRating);
        }
    } catch (error) {
        console.error('Error rating recipe:', error);
        res.status(500).json({ error: 'Failed to rate recipe' });
    }
};

const getRatedRecipes = async (req, res) => {
    const user_id = req.user._id;

    try {
        const ratedRecipes = await Rate.find({ user: user_id }).populate('recipe');

        const recipesWithRatings = ratedRecipes.map(rate => ({
            ...rate.recipe._doc,
            rating: rate.rating
        }));

        res.status(200).json(recipesWithRatings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rated recipes' });
    }
}

module.exports = {
    getUsersRecipes,
    createRecipe,
    deleteRecipe,
    updateRecipe,
    addRatingToRecipe,
    addCommentToRecipe,
    rateRecipe,
    getRatedRecipes
}

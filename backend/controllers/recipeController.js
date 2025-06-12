const Recipe = require('../models/recipeModel');
const Comment = require('../models/commentModel');
const Rate = require('../models/rateModel');
const User = require('../models/userModel') 

// GET all recipes
const getRecipies = async (req, res) => {
    try {
        const recipes = await Recipe.find({}).sort({createdAt: -1});
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getRecipiesFromUser = async (req, res) => {
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user_id = user._id
        const recipes = await Recipe.find({ user_id }).sort({createdAt: -1})

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET a single recipe
const getRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id).populate('user_id', 'email');
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getRecipeComments = async (req, res) => {
    const { id } = req.params;
    try {
        const comments = await Comment.find({ recipe_id: id }).populate('user_id', 'email').sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllRatingsForRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const ratings = await Rate.find({ recipe: id }).populate('user', 'email');
        res.json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
}

module.exports = {
    getRecipies,
    getRecipe,
    getRecipeComments,
    getAllRatingsForRecipe,
    getRecipiesFromUser
}
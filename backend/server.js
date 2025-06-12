require('dotenv').config()
const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const recipesRoutes = require('./routes/recipes')
const userRoutes = require('./routes/user')
const protectedRoutes = require('./routes/userRecipes')

const app = express()

app.use(cors());

app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/recipes', recipesRoutes)
app.use('/api/user', userRoutes)
app.use('/api/userRecipes', protectedRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
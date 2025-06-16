import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Link } from 'react-router-dom'

const RecipeDetails = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe._id}`} className="recipe-link">
        <div className="recipe-header">
          <h3>{recipe.title}</h3>
          {recipe.rating && <span className="recipe-rating">★ {recipe.rating}</span>}
        </div>
        <p className="recipe-description">{recipe.description}</p>
        <p className="recipe-time">
          Posted {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
        </p>
      </Link>
    </div>
  )
}

export default RecipeDetails

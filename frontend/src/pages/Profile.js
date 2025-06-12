import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import RecipeDetails from '../components/RecipeDetails';

const Profile = () => {
    const { user } = useAuthContext();
    const [recipes, setRecipes] = useState([]);
    const [ratedRecipes, setRatedRecipes] = useState([]);

    useEffect(() => {
        const fetchUserRecipes = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userRecipes/`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setRecipes(json);
            }
        };

        const fetchRatedRecipes = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userRecipes/rated`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setRatedRecipes(json);
            }
        };

        if (user) {
            fetchUserRecipes();
            fetchRatedRecipes();
        }
    }, [user]);

    return (
        <div className="profile">
            <div className='userDetails'>
                <h2>My Profile</h2>
                <p>Email: {user?.email}</p>
                <h3>My Recipes: </h3>
                {recipes.length > 0 ? (
                    <div>
                        <div className="recipes-grid">
                            {recipes.map((recipe) => (
                                <RecipeDetails key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Haven't posted any recipes yet.</p>
                )}
            </div>
            <div className='userRecipeInfo'>
                <div className='addRecipe'>
                    <Link to="/addRecipe">
                        <div className='simbolAndP'>
                            <span className='material-symbols-outlined addbutton'>
                                add_circle 
                            </span>
                            <p>Add new recipe</p>
                        </div>
                    </Link>
                </div>
                <h3>Rated Recipes: </h3>
                {ratedRecipes.length > 0 ? (
                    <div>
                        <div className="recipes-grid-rated">
                            {ratedRecipes.map((recipe) => (
                                <RecipeDetails key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Haven't rated any recipes yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;

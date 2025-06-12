import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';

const UserProfile = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchUserRecipes = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/user?email=${email}`);
            const json = await response.json();

            if (response.ok) {
                setRecipes(json);
            }
        };

        fetchUserRecipes();
    }, [email]);

    return (
        <div className="profile">
            <div className='userDetails'>
                <h2>{email}'s profile</h2>
                <h3>{email}'s recipes: </h3>
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
        </div>
    );
};

export default UserProfile;

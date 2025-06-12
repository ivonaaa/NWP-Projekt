import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const RecipeDetailsPage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const { user } = useAuthContext();
    const userEmail = user ? user.email : null;
    const [newComment, setNewComment] = useState('');
    const [overallRating, setOverallRating] = useState(0);
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
                const json = await response.json();

                if (response.ok) {
                    setRecipe(json);
                } else {
                    throw new Error(json.error || 'Failed to fetch recipe');
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };

        fetchRecipe();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}/comments`);
                const json = await response.json();

                if (response.ok) {
                    setComments(json);
                } else {
                    throw new Error(json.error || 'Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [id]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}/ratings`);
                const ratings = await response.json();
                if (response.ok) {
                    const totalRatings = ratings.length;
                    const sumRatings = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                    const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
                    setOverallRating(avgRating);
                    
                    if (user) {
                        const userRating = ratings.find(rating => rating.user.email === user.email);
                        if (userRating) {
                            setUserRating(userRating.rating);
                        } else {
                            setUserRating(null);
                        }
                    }
                } else {
                    throw new Error('Failed to fetch ratings');
                }
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, [id, user]);

    const handleEmailClick = (email) => {
        if (user && email === user.email) {
            return '/profile';
        } else {
            return `/userProfile?email=${email}`;
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userRecipes/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ user_id: user.id, comment: newComment }),
            });
            const json = await response.json();

            if (response.ok) {
                setComments([json, ...comments]);
                setNewComment('');
            } else {
                throw new Error(json.error || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleRateRecipe = async (ratingValue) => {
        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/UserRecipes/${id}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ rating: ratingValue }),
            });
            const json = await response.json();

            if (response.ok) {
                setUserRating(ratingValue);
                
                const fetchRatings = async () => {
                    try {
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}/ratings`);
                        const ratings = await response.json();
                        if (response.ok) {
                            const totalRatings = ratings.length;
                            const sumRatings = ratings.reduce((acc, rating) => acc + rating.rating, 0);
                            const avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
                            setOverallRating(avgRating);
                        } else {
                            throw new Error('Failed to fetch ratings');
                        }
                    } catch (error) {
                        console.error('Error fetching ratings:', error);
                    }
                };

                fetchRatings();
            } else {
                throw new Error(json.error || 'Failed to rate recipe');
            }
        } catch (error) {
            console.error('Error rating recipe:', error);
        }
    };

    return (
        <div className="recipe-details-page">
            {recipe ? (
                <div>
                    <div className='titleAndRating'>
                        <h1>{recipe.title}</h1>
                        <div>
                            <div className="stars">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`material-symbols-outlined ${index < overallRating ? 'filled-star' : 'unfilled-star'}`}
                                    >
                                        star
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <small>
                        <Link to={handleEmailClick(recipe.user_id.email)} className="email-link" style={{cursor: 'pointer', textDecoration: 'underline'}}>
                            {recipe.user_id.email}
                        </Link>
                    </small>
                    <h2>Ingredients</h2>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.quantity} {ingredient.unit} {ingredient.name}
                            </li>
                        ))}
                    </ul>
                    <h2>How to guide: </h2>
                    <p>{recipe.description}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div>
                {user && (
                    <div className='review'>
                        <div className="addComment">
                            <p>Add a comment:</p>
                            <form onSubmit={handleSubmitComment}>
                                <textarea
                                    id="new-comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                <button type="submit">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </form>
                        </div>
                    
                        <div className="stars"> 
                            <p>Leave rating: </p>
                            {[...Array(5)].map((_, index) => (
                                <span
                                    key={index}
                                    className={`material-symbols-outlined ${index < userRating ? 'filled-star' : 'unfilled-star'}`}
                                    onClick={() => handleRateRecipe(index + 1)}
                                >
                                    star
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <h2>Comments:</h2>
                
                <div className="comment-view">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment">
                            <p>
                                <small>
                                    <Link to={handleEmailClick(comment.user_id.email)} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
                                        {comment.user_id.email || userEmail}
                                    </Link>
                                </small>
                            </p>
                            <p>{comment.comment}</p>
                            <p><small>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</small></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailsPage;

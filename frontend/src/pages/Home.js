import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const { user } = useAuthContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(6); 
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/`);
            const json = await response.json();

            if (response.ok) {
                setRecipes(json);
            }
        };

        fetchRecipes();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    };

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    return (
        <div className="home">
            <div className='leftBar'>
                { user && (
                    <div>
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
                        <div className='addRecipe'>
                            <Link to="/profile">
                                <div className='simbolAndP'>
                                    <span className='material-symbols-outlined addbutton'>
                                        person
                                    </span>
                                    <p>My profile</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
                { !user && (
                    <div>
                        <p>
                            By signing up or logging in you get great benefits. <br></br>
                            See your profile, add delicious recipes, comment 
                            and review recipes by being a member of Tastegy. 
                        </p>
                        <div className='loginButton'>
                            <Link to="/login">
                                <p>Log in</p>
                            </Link>
                            <p> for free now!</p>
                        </div>
                    </div>
                )}
            </div>
            <div className='rightBar'>
                <div className='search'>
                    <input 
                        type="text" 
                        placeholder="Search recipes..." 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                    />
                </div>
                <div className="recipes">
                    {currentRecipes.length > 0 ? (
                        currentRecipes.map((recipe) => (
                            <RecipeDetails key={recipe._id} recipe={recipe} />
                        ))
                    ) : (
                        <p>No recipes found</p>
                    )}
                </div>
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button key={index} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Home;

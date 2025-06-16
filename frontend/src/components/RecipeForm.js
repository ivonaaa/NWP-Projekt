import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const RecipeForm = ({ isEdit = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [error, setError] = useState(null);

  const { user } = useAuthContext();
  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id && user) {
      const fetchRecipe = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`);
          const data = await res.json();
          if (res.ok) {
            setTitle(data.title);
            setDescription(data.description);
            setImageUrl(data.imageUrl || '');
            setIngredients(data.ingredients);
          } else {
            setError(data.error || 'Failed to load recipe');
          }
        } catch (err) {
          console.error(err);
          setError('Something went wrong while loading recipe');
        }
      };

      fetchRecipe();
    }
  }, [isEdit, id, user]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.slice();
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, event) => {
    const { name, value } = event.target;
    const newIngredients = ingredients.slice();
    newIngredients[index][name] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const recipe = { title, description, ingredients, imageUrl };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/userRecipes${isEdit ? `/${id}` : ''}`,
      {
        method: isEdit ? 'PATCH' : 'POST',
        body: JSON.stringify(recipe),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    } else {
      setError(null);
      console.log(isEdit ? 'Recipe updated!' : 'Recipe created!', json);
      navigate('/');
    }
  };

  return (
    <div className='recipeForm'>
      <form onSubmit={handleSubmit}>
        <h2 className="form-heading">{isEdit ? 'Edit Recipe' : 'Create a New Recipe'}</h2>
        
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Step by step guide:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label>
            <div className='addRecipe'>
              Ingredients:
              <span onClick={handleAddIngredient} className='material-symbols-outlined addbutton'>
                add_circle
              </span>
            </div>
          </label>
          <div className='ingredients'>
            {ingredients.map((ingredient, index) => (
              <div key={index} className='ingredient-row'>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, e)}
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, e)}
                  required
                />
                <input
                  type="text"
                  name="unit"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, e)}
                  required
                />
                <span onClick={() => handleRemoveIngredient(index)} className='material-symbols-outlined removebutton'>
                  remove_circle
                </span>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">{isEdit ? 'Update Recipe' : 'Submit Recipe'}</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  );
};

export default RecipeForm;

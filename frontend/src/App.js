import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import RecipeForm from './components/RecipeForm'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RecipeDetailsPage from './pages/RecipeDetailsPage'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route 
              path='/'
              element = {<Home />}
            />
            <Route 
              path='/addRecipe'
              element = { user ? <RecipeForm /> : <Navigate to="/login" />}
            />
            <Route 
              path='/login'
              element = { !user ? <Login /> : <Navigate to="/" />}
            />
            <Route 
              path='/signup'
              element = { !user ? <Signup /> : <Navigate to="/" />}
            />
            <Route 
              path='/recipe/:id' 
              element={<RecipeDetailsPage />} 
            />
            <Route 
              path='/profile' 
              element={user ? <Profile /> : <Navigate to="/login" />} 
            /> 
            <Route 
              path='/userProfile'
              element = {<UserProfile />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

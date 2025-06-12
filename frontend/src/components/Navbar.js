import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClick = () => {
        logout();
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>
                        Tastegy
                    </h1>
                </Link>
                <nav>
                    <div className="hamburger" onClick={toggleMenu}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                        { user && (
                            <div className='loginAndSignup'>
                                <Link to="/profile">
                                    <span onClick={toggleMenu}>{ user.email }</span>
                                </Link>
                                <button onClick={handleClick}>Log out</button>
                            </div>
                        )}
                        { !user && (
                            <div className='loginAndSignup'>
                                <Link to="/login"><span onClick={toggleMenu}>Login</span></Link>
                                <Link to="/signup"><span onClick={toggleMenu}>Signup</span></Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar;

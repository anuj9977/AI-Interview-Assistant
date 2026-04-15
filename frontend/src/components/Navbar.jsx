import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import '../style/navbar.scss';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, loading, handleLogout } = useAuth();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    return (
        <header className='app-navbar'>
            <div className='app-navbar__inner'>
                <Link to='/' className='app-navbar__brand'>
                    ai-interview-assistant
                </Link>

                <nav className='app-navbar__actions' aria-label='Main navigation'>
                    {!loading && !user && (
                        <>
                            <NavLink
                                to='/login'
                                className={({ isActive }) =>
                                    `app-navbar__link ${isActive ? 'app-navbar__link--active' : ''}`
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to='/register'
                                className={({ isActive }) =>
                                    `app-navbar__link app-navbar__link--primary ${isActive ? 'app-navbar__link--active' : ''}`
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    {!loading && user && (
                        <button type='button' className='app-navbar__link app-navbar__logout' onClick={onLogout}>
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

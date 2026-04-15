import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const RootLayout = () => {
    return (
        <div className='app-shell'>
            <Navbar />
            <div className='app-content'>
                <Outlet />
            </div>
        </div>
    );
};

export default RootLayout;

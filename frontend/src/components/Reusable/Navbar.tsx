import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return(
        <nav className='navbar'>
            <div className='navbar-brand'>
                <h2>Begonia Medical</h2>
            </div>
            <ul className='navbar-links'>
                <li><Link to = "/">Home</Link></li>
                <li><Link to = "/inventory">Inventory</Link></li>
                <li><Link to = "/purchases">Purchases</Link></li>
                <li><Link to = "/services">Services</Link></li>
                <li><Link to = "/invoices">Invoices</Link></li>
            </ul>
            <button className='logout-button' onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
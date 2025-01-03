import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Login from './Login.tsx';
import Inventory from './Inventory.tsx';
import { jwtDecode } from 'jwt-decode';



const App = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // if user doesn't have token, send them to login page
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token){
            navigate('/login');
        } else {
        // if user's token expires, make sure to remove it from local storage so they can be sent to login page
            const decodedToken = jwtDecode(token);
            if (!decodedToken.exp){
                throw new Error ('Token has no expiration')
            }

            const currentTime = Date.now()/1000;

            if (decodedToken.exp < currentTime){
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [navigate]);

    return(
        <div className='app-container'>
            { location.pathname !== "/login" && < Navbar/> }
            <main className='main-content'>
            <Routes>
                <Route path = "/login" element = {<Login/>}/>
                <Route path = "/" element = {<h2>Home Page</h2>}/>
                <Route path = "/inventory" element = {<Inventory/>}/>
                <Route path = "/purchases" element = {<h2>Purchases Page</h2>}/>
                <Route path = "/invoices" element = {<h2>Invoice Page</h2>}/>
                <Route path = "/services" element = {<h2>Services Page</h2>}/>
            </Routes>
            </main>
        </div>
        
    )
}

export default App;
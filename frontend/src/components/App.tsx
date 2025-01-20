import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Reusable/Navbar.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';
import Inventory from './Inventory/Inventory.tsx';
import Purchases from './Purchases/Purchases.tsx';
import Invoices from './Invoice/Invoices.tsx'
import Services from './Services/Services.tsx'


import InventoryProvider from './SharedStates/InventoryProvider.tsx';
import { jwtDecode } from 'jwt-decode';



const App = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // if user doesn't have token, send them to login page
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token){
            if (location.pathname !== '/register'){
                navigate('/login');
            }
        } 
        else {
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
        <InventoryProvider>
            <div className='app-container'>
                { location.pathname !== "/login" && location.pathname !== "/register" && < Navbar/> }
                <main className='main-content'>
                <Routes>
                    <Route path = "/login" element = {<Login/>}/>
                    <Route path = "/register" element = {<Register/>}/>
                    {/* <Route path = "/" element = {<h2>Home Page</h2>}/> */}
                    <Route path = "/inventory" element = {<Inventory/>}/>
                    <Route path = "/purchases" element = {<Purchases/>}/>
                    <Route path = "/invoices" element = {<Invoices/>}/>
                    <Route path = "/services" element = {<Services/>}/>
                </Routes>
                </main>
            </div>
        </InventoryProvider>
        
        
    )
}

export default App;
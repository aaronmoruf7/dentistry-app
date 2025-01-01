import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Inventory from './Inventory.tsx';


const App = () => {

    return(
        <Router>
            <div className='app-container'>
                <Navbar/>
                <main className='main-content'>
                <Routes>
                    <Route path = "/" element = {<h2>Home Page</h2>}/>
                    <Route path = "/inventory" element = {<Inventory/>}/>
                    <Route path = "/purchases" element = {<h2>Purchases Page</h2>}/>
                    <Route path = "/invoices" element = {<h2>Invoice Page</h2>}/>
                    <Route path = "/services" element = {<h2>Services Page</h2>}/>
                </Routes>
                </main>
            </div>
        </Router>
        
    )
}

export default App;
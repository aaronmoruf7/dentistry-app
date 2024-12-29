import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

const App: React.FC = () => {
    return(
        <Router>
            <div>
                <h1>Begonia Medical</h1>
                <Routes>
                    <Route path = "/" element = {<h2>Home Page</h2>}/>
                    <Route path = "/inventory" element = {<h2>Inventory Page</h2>}/>
                    <Route path = "/purchases" element = {<h2>Purchases Page</h2>}/>
                    <Route path = "/invoices" element = {<h2>Invoice Page</h2>}/>
                    <Route path = "/services" element = {<h2>Services Page</h2>}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App;
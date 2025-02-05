import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = 'https://begonia-medical.onrender.com';


const Login = () => {
    const [email, setEmail] = useState ('');
    const [password, setPassword] = useState ('');
    const [error, setError] = useState ('');
    const navigate = useNavigate();

    // what happens when we submit the login form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // must specify the api call/request with the correct parameters, especially body which must match what the backend expects
            const response = await fetch (`${URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({email, password})
                }
            );

            //store token from response into storage to be used for future api calls that need verification
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/inventory');
            } else {
                const errorData = await response.json();
                setError (errorData.message || 'Login failed');
            }

        }catch(error) {
            console.error ('Login error:', error);
            setError ('An error occured, please try again')
        }
    };

    return (
        <div className='login-container'>
            <h2>Login</h2>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type = "text"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    required
                />
                <input
                    type = "password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                />
                <button type = "submit">Login</button>
            </form>
            <div className='login-register-container'>
                <span className= 'login-register-link' onClick={() => navigate('/register')}>New User? Click here to Register</span>
            </div>
        </div>
    )
};

export default Login;
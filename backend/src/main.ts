import 'dotenv/config'; //to get variables from .env

import express from 'express';
import authController from './routes/auth/auth.controller';

const app = express()

//middleware
app.use(express.json())

//routes
app.use('/auth', authController);

//set up server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
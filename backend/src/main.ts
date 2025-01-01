import 'dotenv/config'; //to get variables from .env

import express from 'express';
import cors from 'cors';
import authController from './app/routes/auth/auth.controller';
import inventoryController from './app/routes/inventory/inventory.controller';
import servicesController from './app/routes/services/services.controller';
import invoicesController from './app/routes/invoices/invoices.controller';
import purchasesController from './app/routes/purchases/purchases.controller';


const app = express()

//backend and frontend are on different servers
app.use(cors());

//middleware
app.use(express.json())

//routes
app.use('api/auth', authController);
app.use('api/inventory', inventoryController);
app.use('api/services', servicesController);
app.use('api/invoices', invoicesController);
app.use('api/purchases', purchasesController);


//set up server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
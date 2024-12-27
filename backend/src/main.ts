import 'dotenv/config'; //to get variables from .env

import express from 'express';
import authController from './app/routes/auth/auth.controller';
import inventoryController from './app/routes/inventory/inventory.controller';
import servicesController from './app/routes/services/services.controller';
import invoicesController from './app/routes/invoices/invoices.controller';
import purchasesController from './app/routes/purchases/purchases.controller';


const app = express()

//middleware
app.use(express.json())

//routes
app.use('/auth', authController);
app.use('/inventory', inventoryController);
app.use('/services', servicesController);
app.use('/invoices', invoicesController);
app.use('/purchases', purchasesController);


//set up server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import vendorRoutes from './routes/vendors.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/users/', userRoutes);
app.use('/api/vendors/', vendorRoutes);
app.use('/api/orders/', orderRoutes);

app.get('/',(req,res)=>{
    res.send('Admin Backend is running');
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



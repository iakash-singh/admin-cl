import express from 'express';
import { getTotalVendors } from '../controllers/vendorsController.js';

const router = express.Router();

router.get('/total-vendors', getTotalVendors);
export default router;

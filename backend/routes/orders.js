import express from 'express';
import { getTotalOrders, getOrderStatus } from '../controllers/ordersController.js';

const router = express.Router();

router.get('/total-orders', getTotalOrders);
router.get('/status-review', getOrderStatus);
export default router;
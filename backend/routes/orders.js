import express from 'express';
import { marketcoverage,getOrderSuccessRate ,getAverageOrderValue ,getTotalOrders,getAllOrders,getOrderDetailsById, getOrderStatus, getActiveOrders, getCompletedOrders, getTotalRevenue, getTodayRevenue } from '../controllers/ordersController.js';

const router = express.Router();

router.get('/total-orders', getTotalOrders);
router.get('/status-review', getOrderStatus);
router.get('/active-orders', getActiveOrders);
router.get('/completed-orders', getCompletedOrders);
router.get('/total-revenue', getTotalRevenue);
router.get('/today-revenue', getTodayRevenue);
router.get('/average-order-value', getAverageOrderValue);
router.get('/order-success-rate', getOrderSuccessRate);
router.get('/market-coverage', marketcoverage);
router.get('/all-orders', getAllOrders);
router.get('/:id', getOrderDetailsById);


export default router;
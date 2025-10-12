import express from 'express';
import { getTotalVendors, getPendingApprovals, getAverageRevenue, getVerificationStatus } from '../controllers/vendorsController.js';

const router = express.Router();

router.get('/total-vendors', getTotalVendors);
router.get('/pending-vendors', getPendingApprovals);
router.get('/avg-revenue', getAverageRevenue);
router.get('/verification-status', getVerificationStatus);

export default router;

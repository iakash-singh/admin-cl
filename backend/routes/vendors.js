import express from 'express';
import { getAllVendors ,getTotalVendors, getPendingApprovals, getAverageRevenue, getVerificationStatus, getOnboardingStatus } from '../controllers/vendorsController.js';

const router = express.Router();

router.get('/total-vendors', getTotalVendors);
router.get('/pending-vendors', getPendingApprovals);
router.get('/avg-revenue', getAverageRevenue);
router.get('/verification-status', getVerificationStatus);
router.get('/onboarding-status', getOnboardingStatus);
router.get('/all-vendors', getAllVendors);

export default router;

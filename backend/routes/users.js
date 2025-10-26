import express from "express";
import { getTotalUsers, getNewUsersToday, getUsersGrowth, getUserEngagement, getAllUsers, conversionRate } from "../controllers/usersController.js";

const router = express.Router();

router.get("/total-users", getTotalUsers);
router.get("/new-today", getNewUsersToday);
router.get("/growth", getUsersGrowth);
router.get("/engagement", getUserEngagement);
router.get("/users", getAllUsers);
router.get("/conversion-rate", conversionRate);

export default router;

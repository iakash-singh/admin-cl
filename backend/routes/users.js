import express from "express";
import { getTotalUsers, getNewUsersToday, getUsersGrowth, getUserEngagement, getAllUsers } from "../controllers/usersController.js";

const router = express.Router();

router.get("/total-users", getTotalUsers);
router.get("/new-today", getNewUsersToday);
router.get("/growth", getUsersGrowth);
router.get("/engagement", getUserEngagement);
router.get("/users", getAllUsers);

export default router;

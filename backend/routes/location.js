import express from "express";
import { getAllLocations, getLocationDetails } from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getAllLocations);         // → For DataTable
router.get("/:city", getLocationDetails); // → For Modal

export default router;

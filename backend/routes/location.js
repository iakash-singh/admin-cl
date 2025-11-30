import express from "express";
import { getAllLocations, getLocationDetails } from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getAllLocations);         
router.get("/:city", getLocationDetails); 

export default router;

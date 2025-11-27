import express from "express";
import {getUserDetailsById,revenueDistributionByLocation,marketPenetration ,marketOpportunity, userandVendorConcentrationByLocation , topMarketbyUserSpend ,getTotalUsers, getNewUsersToday, getUsersGrowth, getUserEngagement, getAllUsers, conversionRate, topUserLocations, getUserLocationsInsights } from "../controllers/usersController.js";

const router = express.Router();

router.get("/total-users", getTotalUsers);
router.get("/new-today", getNewUsersToday);
router.get("/growth", getUsersGrowth);
router.get("/engagement", getUserEngagement);
router.get("/users", getAllUsers);
router.get("/conversion-rate", conversionRate);
router.get("/top-locations", topUserLocations);
router.get("/location-insights", getUserLocationsInsights);
router.get("/top-market-by-user-spend", topMarketbyUserSpend);
router.get("/user-and-vendor-concentration-by-location", userandVendorConcentrationByLocation);
router.get("/market-opportunity", marketOpportunity);
router.get("/market-penetration", marketPenetration);
router.get("/revenue-distribution-by-location", revenueDistributionByLocation);
router.get("/:id", getUserDetailsById);

export default router;

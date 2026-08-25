const express = require("express");

const {
  getDashboardStats,
  getRecentTickets,
  getRecentActivities,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/stats",
  protect,
  getDashboardStats
);

router.get(
  "/recent-tickets",
  protect,
  getRecentTickets
);

router.get(
  "/recent-activities",
  protect,
  getRecentActivities
);

module.exports = router;
const express = require("express");

const {
  getTicketActivities,
} = require("../controllers/ticketActivityController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// Get ticket activity history
router.get(
  "/:ticketId",
  protect,
  authorize("admin", "agent"),
  getTicketActivities
);

module.exports = router;
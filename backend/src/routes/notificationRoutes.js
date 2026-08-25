const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================
router.get(
  "/",
  protect,
  getNotifications
);


// ==========================================
// GET UNREAD COUNT
// ==========================================
router.get(
  "/unread-count",
  protect,
  getUnreadNotificationCount
);


// ==========================================
// MARK ALL AS READ
// ==========================================
router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);


// ==========================================
// MARK ONE AS READ
// ==========================================
router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
);


module.exports = router;
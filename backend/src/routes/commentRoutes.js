const express = require("express");

const {
  createComment,
  getComments,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE COMMENT
// ==========================================
router.post(
  "/",
  protect,
  createComment
);


// ==========================================
// GET COMMENTS FOR TICKET
// ==========================================
router.get(
  "/:ticketId",
  protect,
  getComments
);


module.exports = router;
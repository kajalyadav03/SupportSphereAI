const express = require("express");

const {
  analyzeTicketWithAI,
  applyAIRecommendation,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
  "/analyze-ticket",
  protect,
  analyzeTicketWithAI
);


router.patch(
  "/tickets/:id/apply-recommendation",
  protect,
  applyAIRecommendation
);


module.exports = router;
const express = require("express");

const {
  getCompany,
  updateCompany,
  getTeamMembers,
  addTeamMember,
} = require("../controllers/companyController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// COMPANY
// ==========================================

// Get company
router.get(
  "/",
  protect,
  getCompany
);


// Update company - ADMIN ONLY
router.put(
  "/",
  protect,
  authorize("admin"),
  updateCompany
);


// ==========================================
// TEAM
// ==========================================

// Get team members
router.get(
  "/team",
  protect,
  getTeamMembers
);


// Add team member - ADMIN ONLY
router.post(
  "/team",
  protect,
  authorize("admin"),
  addTeamMember
);


module.exports = router;
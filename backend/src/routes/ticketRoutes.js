const express = require("express");

const {
  createTicket,
  getTickets,
  getTicketById,
  getMyTickets,
  updateTicket,
  assignTicket,
  getAgents,
  deleteTicket,
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE TICKET
// Admin + Agent
router.post(
  "/",
  protect,
  authorize("admin", "agent"),
  createTicket
);


// GET ALL TICKETS
// Admin + Agent
router.get(
  "/",
  protect,
  authorize("admin", "agent"),
  getTickets
);


// GET MY ASSIGNED TICKETS
// Agent only
router.get(
  "/my",
  protect,
  authorize("agent"),
  getMyTickets
);


// GET ALL AGENTS
// Admin + Agent
router.get(
  "/agents",
  protect,
  authorize("admin", "agent"),
  getAgents
);


// GET SINGLE TICKET
// Admin + Agent
router.get(
  "/:id",
  protect,
  authorize("admin", "agent"),
  getTicketById
);


// UPDATE TICKET
// Admin + Agent
router.put(
  "/:id",
  protect,
  authorize("admin", "agent"),
  updateTicket
);


// ASSIGN TICKET
// Admin only
router.put(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignTicket
);


// DELETE TICKET
// Admin only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTicket
);


module.exports = router;
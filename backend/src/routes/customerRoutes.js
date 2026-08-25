const express = require("express");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create customer
router.post(
  "/",
  protect,
  createCustomer
);


// Get customers
router.get(
  "/",
  protect,
  getCustomers
);


// Get customer by ID
router.get(
  "/:id",
  protect,
  getCustomerById
);


// Update customer
router.put(
  "/:id",
  protect,
  updateCustomer
);


// Delete customer
router.delete(
  "/:id",
  protect,
  deleteCustomer
);


module.exports = router;
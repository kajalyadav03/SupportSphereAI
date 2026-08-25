const Customer = require("../models/Customer");
const User = require("../models/User");
const Ticket = require("../models/Ticket");


// ==========================================
// CREATE CUSTOMER
// ==========================================
const createCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
      company: user.company,
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "Customer already exists",
      });
    }

    const customer = await Customer.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      company: user.company,
      createdBy: user._id,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET CUSTOMERS
// Search + Pagination
// ==========================================
const getCustomers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      company: user.company,
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const customers = await Customer.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCustomers = await Customer.countDocuments(filter);

    res.status(200).json({
      customers,
      pagination: {
        page,
        limit,
        totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
      },
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET CUSTOMER BY ID
// ==========================================
const getCustomerById = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      company: user.company,
    }).populate(
      "createdBy",
      "name email role"
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE CUSTOMER
// ==========================================
const updateCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      company: user.company,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Email update
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();

      const existingCustomer = await Customer.findOne({
        email: normalizedEmail,
        company: user.company,
        _id: { $ne: customer._id },
      });

      if (existingCustomer) {
        return res.status(409).json({
          message: "Another customer with this email already exists",
        });
      }

      customer.email = normalizedEmail;
    }

    if (name) {
      customer.name = name.trim();
    }

    if (phone) {
      customer.phone = phone.trim();
    }

    await customer.save();

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// DELETE CUSTOMER
// Prevent delete if tickets exist
// ==========================================
const deleteCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      company: user.company,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // Check existing tickets
    const ticketExists = await Ticket.exists({
      customer: customer._id,
      company: user.company,
      isDeleted: false,
    });

    if (ticketExists) {
      return res.status(409).json({
        message:
          "Customer cannot be deleted because active tickets exist",
      });
    }

    await Customer.deleteOne({
      _id: customer._id,
      company: user.company,
    });

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
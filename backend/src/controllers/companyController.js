const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Company = require("../models/Company");


// ==========================================
// GET COMPANY
// ==========================================
const getCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const company = await Company.findById(user.company);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      company,
    });
  } catch (error) {
    console.error("Get company error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE COMPANY
// ADMIN ONLY
// ==========================================
const updateCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Extra controller-level protection
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update company",
      });
    }

    const company = await Company.findById(user.company);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    if (name) {
      company.name = name.trim();
    }

    if (email) {
      company.email = email.trim().toLowerCase();
    }

    await company.save();

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update company error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET TEAM MEMBERS
// ==========================================
const getTeamMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const members = await User.find({
      company: user.company,
    }).select(
      "_id name email role company createdAt updatedAt"
    );

    res.status(200).json({
      members,
    });
  } catch (error) {
    console.error("Get team members error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// ADD TEAM MEMBER
// ADMIN ONLY
// ==========================================
const addTeamMember = async (req, res) => {
  try {
    const admin = await User.findById(req.user.userId);

    if (!admin || !admin.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Extra controller-level protection
    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can add team members",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const member = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "agent",
      company: admin.company,
    });

    res.status(201).json({
      message: "Team member added successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        company: member.company,
      },
    });
  } catch (error) {
    console.error("Add team member error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getCompany,
  updateCompany,
  getTeamMembers,
  addTeamMember,
};
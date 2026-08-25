const mongoose = require("mongoose");

const Comment = require("../models/Comment");
const User = require("../models/User");
const Ticket = require("../models/Ticket");

const createTicketActivity = require("../utils/ticketActivity");
const createNotification = require("../utils/notification");


// ==========================================
// CREATE COMMENT
// ==========================================
const createComment = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { message, ticketId } = req.body;

    if (!message || !ticketId) {
      return res.status(400).json({
        message: "Message and ticket ID are required",
      });
    }

    // Validate ticket ID
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    // Find ticket only inside user's company
    const ticket = await Ticket.findOne({
      _id: ticketId,
      company: user.company,
      isDeleted: false,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const comment = await Comment.create({
      message: message.trim(),
      ticket: ticket._id,
      user: user._id,
      company: user.company,
    });


    // ==========================================
    // TICKET ACTIVITY
    // ==========================================

    await createTicketActivity({
      ticketId: ticket._id,
      userId: user._id,
      companyId: user.company,
      action: "comment_added",
      description: "Comment added to ticket",
    });


    // ==========================================
    // NOTIFICATION TO ASSIGNED AGENT
    // ==========================================

    if (
      ticket.assignedTo &&
      ticket.assignedTo.toString() !== user._id.toString()
    ) {
      await createNotification({
        userId: ticket.assignedTo,
        companyId: user.company,
        ticketId: ticket._id,
        type: "comment_added",
        message: `New comment added to ticket "${ticket.title}"`,
      });
    }


    // Populate user information in response
    await comment.populate(
      "user",
      "name email role"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });

  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET COMMENTS
// ==========================================
const getComments = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { ticketId } = req.params;

    // Validate ticket ID
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    // Check ticket belongs to user's company
    // and is not deleted
    const ticket = await Ticket.findOne({
      _id: ticketId,
      company: user.company,
      isDeleted: false,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }


    // ==========================================
    // GET COMMENTS
    // ==========================================

    const comments = await Comment.find({
      ticket: ticket._id,
      company: user.company,
    })
      .populate("user", "name email role")
      .sort({ createdAt: 1 });


    res.status(200).json({
      comments,
    });

  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createComment,
  getComments,
};
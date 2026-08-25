const mongoose = require("mongoose");

const TicketActivity = require("../models/TicketActivity");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

const getTicketActivities = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

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

    const activities = await TicketActivity.find({
      ticket: ticket._id,
      company: user.company,
    })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      activities,
    });
  } catch (error) {
    console.error("Get ticket activities error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getTicketActivities,
};
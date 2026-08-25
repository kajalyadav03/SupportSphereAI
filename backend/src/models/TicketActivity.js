const mongoose = require("mongoose");

const ticketActivitySchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

ticketActivitySchema.index({
  ticket: 1,
  company: 1, 
  createdAt: -1,
});

ticketActivitySchema.index({
  company: 1,
  createdAt: -1,
});


module.exports = mongoose.model(
  "TicketActivity",
  ticketActivitySchema
);
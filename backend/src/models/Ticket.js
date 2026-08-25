const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in-progress",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "urgent",
      ],
      default: "medium",
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

ticketSchema.index({
  company: 1,
  isDeleted: 1,
  createdAt: -1,
});

ticketSchema.index({
  company: 1,
  status: 1,
  isDeleted: 1,
});

ticketSchema.index({
  company: 1,
  priority: 1,
  isDeleted: 1,
});

ticketSchema.index({
  company: 1,
  assignedTo: 1,
  isDeleted: 1,
});


module.exports = mongoose.model(
  "Ticket",
  ticketSchema
);
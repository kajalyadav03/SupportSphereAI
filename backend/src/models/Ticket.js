const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    // ==========================================
    // TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

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

    // ==========================================
    // PRIORITY
    // ==========================================

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

    // ==========================================
    // AI CATEGORY
    // ==========================================

    category: {
      type: String,
      enum: [
        "technical",
        "billing",
        "account",
        "general",
        "other",
      ],
      default: "general",
    },

    // ==========================================
    // AI SENTIMENT
    // ==========================================

    sentiment: {
      type: String,
      enum: [
        "positive",
        "neutral",
        "negative",
      ],
      default: "neutral",
    },

    // ==========================================
    // CUSTOMER
    // ==========================================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // ==========================================
    // ASSIGNED AGENT
    // ==========================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================================
    // COMPANY
    // ==========================================

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // ==========================================
    // CREATED BY
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // SOFT DELETE
    // ==========================================

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

// Company + deleted + newest tickets
ticketSchema.index({
  company: 1,
  isDeleted: 1,
  createdAt: -1,
});

// Company + status + deleted
ticketSchema.index({
  company: 1,
  status: 1,
  isDeleted: 1,
});

// Company + priority + deleted
ticketSchema.index({
  company: 1,
  priority: 1,
  isDeleted: 1,
});

// Company + assigned agent + deleted
ticketSchema.index({
  company: 1,
  assignedTo: 1,
  isDeleted: 1,
});

// Company + category + deleted
ticketSchema.index({
  company: 1,
  category: 1,
  isDeleted: 1,
});

// Company + sentiment + deleted
ticketSchema.index({
  company: 1,
  sentiment: 1,
  isDeleted: 1,
});


// ==========================================
// MODEL
// ==========================================

module.exports = mongoose.model(
  "Ticket",
  ticketSchema
);
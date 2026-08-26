const User = require("../models/User");
const Ticket = require("../models/Ticket");


// ==========================================
// ANALYZE TICKET WITH AI
// ==========================================
const analyzeTicketWithAI = async (req, res) => {
  try {
    const { title, description } = req.body;

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!title || !description) {
      return res.status(400).json({
        message:
          "Ticket title and description are required",
      });
    }

    // ==========================================
    // AI SERVICE URL
    // ==========================================

    const aiServiceUrl =
      process.env.AI_SERVICE_URL ||
      "http://127.0.0.1:8000";

    // ==========================================
    // CALL AI SERVICE
    // ==========================================

    const response = await fetch(
      `${aiServiceUrl}/ai/analyze-ticket`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
        }),
      }
    );

    const data = await response.json();

    // ==========================================
    // AI SERVICE ERROR
    // ==========================================

    if (!response.ok) {
      console.error(
        "AI service error:",
        data
      );

      return res.status(response.status).json({
        message:
          data.detail ||
          "AI service failed",
      });
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      message:
        "AI analysis completed",

      analysis: data,
    });

  } catch (error) {
    console.error(
      "AI controller error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to connect to AI service",
    });
  }
};


// ==========================================
// APPLY AI RECOMMENDATION
// ==========================================
const applyAIRecommendation = async (
  req,
  res
) => {
  try {
    const {
      priority,
      category,
      recommended_status,
    } = req.body;

    const { id } = req.params;


    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (
      !priority &&
      !category &&
      !recommended_status
    ) {
      return res.status(400).json({
        message:
          "Priority, category or status is required",
      });
    }


    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const user = await User.findById(
      req.user.userId
    );

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }


    // ==========================================
    // FIND TICKET
    // ==========================================

    const ticket = await Ticket.findOne({
      _id: id,
      company: user.company,
      isDeleted: false,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }


    // ==========================================
    // ALLOWED PRIORITIES
    // ==========================================

    const allowedPriorities = [
      "low",
      "medium",
      "high",
      "urgent",
    ];


    // ==========================================
    // ALLOWED CATEGORIES
    // ==========================================

    const allowedCategories = [
      "technical",
      "billing",
      "account",
      "general",
      "other",
    ];


    // ==========================================
    // ALLOWED STATUSES
    // ==========================================

    const allowedStatuses = [
      "open",
      "in-progress",
      "resolved",
    ];


    // ==========================================
    // VALIDATE PRIORITY
    // ==========================================

    if (
      priority &&
      !allowedPriorities.includes(
        priority
      )
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }


    // ==========================================
    // VALIDATE CATEGORY
    // ==========================================

    if (
      category &&
      !allowedCategories.includes(
        category
      )
    ) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }


    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    if (
      recommended_status &&
      !allowedStatuses.includes(
        recommended_status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid recommended status",
      });
    }


    // ==========================================
    // STORE OLD VALUES
    // ==========================================

    const oldPriority =
      ticket.priority;

    const oldCategory =
      ticket.category;

    const oldStatus =
      ticket.status;


    // ==========================================
    // APPLY PRIORITY
    // ==========================================

    if (priority) {
      ticket.priority = priority;
    }


    // ==========================================
    // APPLY CATEGORY
    // ==========================================

    if (category) {
      ticket.category = category;
    }


    // ==========================================
    // APPLY STATUS
    // ==========================================

    if (recommended_status) {
      ticket.status =
        recommended_status;
    }


    // ==========================================
    // SAVE TICKET
    // ==========================================

    await ticket.save();


    // ==========================================
    // CREATE ACTIVITY
    // ==========================================

    try {
      const TicketActivity = require(
        "../models/TicketActivity"
      );

      const changes = [];

      if (
        priority &&
        oldPriority !== priority
      ) {
        changes.push(
          `priority changed from ${oldPriority} to ${priority}`
        );
      }

      if (
        category &&
        oldCategory !== category
      ) {
        changes.push(
          `category changed from ${oldCategory} to ${category}`
        );
      }

      if (
        recommended_status &&
        oldStatus !== recommended_status
      ) {
        changes.push(
          `status changed from ${oldStatus} to ${recommended_status}`
        );
      }

      if (changes.length > 0) {
        await TicketActivity.create({
          ticket: ticket._id,
          user: user._id,
          company: user.company,
          action: "ai_recommendation_applied",
          description:
            `AI recommendation applied: ${changes.join(
              ", "
            )}`,
        });
      }

    } catch (activityError) {
      console.error(
        "AI activity creation error:",
        activityError
      );
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      message:
        "AI recommendation applied successfully",

      ticket,
    });

  } catch (error) {
    console.error(
      "Apply AI recommendation error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to apply AI recommendation",
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  analyzeTicketWithAI,
  applyAIRecommendation,
};
const Ticket = require("../models/Ticket");
const Customer = require("../models/Customer");
const User = require("../models/User");
const TicketActivity = require("../models/TicketActivity");


// ==========================================
// GET DASHBOARD STATS
// ==========================================
const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const companyId = user.company;

    // ==========================================
    // TICKET COUNTS
    // ==========================================

    const totalTickets = await Ticket.countDocuments({
      company: companyId,
      isDeleted: false,
    });

    const openTickets = await Ticket.countDocuments({
      company: companyId,
      status: "open",
      isDeleted: false,
    });

    const inProgressTickets =
      await Ticket.countDocuments({
        company: companyId,
        status: "in-progress",
        isDeleted: false,
      });

    const resolvedTickets =
      await Ticket.countDocuments({
        company: companyId,
        status: "resolved",
        isDeleted: false,
      });

    const closedTickets =
      await Ticket.countDocuments({
        company: companyId,
        status: "closed",
        isDeleted: false,
      });

    // ==========================================
    // PRIORITY COUNTS
    // ==========================================

    const highPriorityTickets =
      await Ticket.countDocuments({
        company: companyId,
        priority: "high",
        isDeleted: false,
      });

    const urgentTickets =
      await Ticket.countDocuments({
        company: companyId,
        priority: "urgent",
        isDeleted: false,
      });

    // ==========================================
    // CUSTOMER COUNT
    // ==========================================

    const totalCustomers =
      await Customer.countDocuments({
        company: companyId,
      });

    // ==========================================
    // AGENT COUNT
    // ==========================================

    const totalAgents =
      await User.countDocuments({
        company: companyId,
        role: "agent",
      });

    // ==========================================
    // AI CATEGORY COUNTS
    // ==========================================

    const technicalTickets =
      await Ticket.countDocuments({
        company: companyId,
        category: "technical",
        isDeleted: false,
      });

    const billingTickets =
      await Ticket.countDocuments({
        company: companyId,
        category: "billing",
        isDeleted: false,
      });

    const accountTickets =
      await Ticket.countDocuments({
        company: companyId,
        category: "account",
        isDeleted: false,
      });

    const generalTickets =
      await Ticket.countDocuments({
        company: companyId,
        category: "general",
        isDeleted: false,
      });

    const otherTickets =
      await Ticket.countDocuments({
        company: companyId,
        category: "other",
        isDeleted: false,
      });

    // ==========================================
    // AI SENTIMENT COUNTS
    // ==========================================

    const positiveSentimentTickets =
      await Ticket.countDocuments({
        company: companyId,
        sentiment: "positive",
        isDeleted: false,
      });

    const neutralSentimentTickets =
      await Ticket.countDocuments({
        company: companyId,
        sentiment: "neutral",
        isDeleted: false,
      });

    const negativeSentimentTickets =
      await Ticket.countDocuments({
        company: companyId,
        sentiment: "negative",
        isDeleted: false,
      });

    // ==========================================
    // AI SMART ALERT COUNT
    // ==========================================

    /*
     * Smart alert:
     *
     * 1. Urgent ticket
     * OR
     * 2. Negative sentiment
     */

    const smartAlertTickets =
      await Ticket.countDocuments({
        company: companyId,
        isDeleted: false,
        $or: [
          {
            priority: "urgent",
          },
          {
            sentiment: "negative",
          },
        ],
      });

    // ==========================================
    // AGENT-WISE TICKET STATISTICS
    // ==========================================

    const agentStats = await User.aggregate([
      {
        $match: {
          company: companyId,
          role: "agent",
        },
      },

      {
        $lookup: {
          from: "tickets",

          let: {
            agentId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$assignedTo",
                        "$$agentId",
                      ],
                    },

                    {
                      $eq: [
                        "$company",
                        companyId,
                      ],
                    },

                    {
                      $eq: [
                        "$isDeleted",
                        false,
                      ],
                    },
                  ],
                },
              },
            },
          ],

          as: "tickets",
        },
      },

      {
        $project: {
          _id: 0,
          agentId: "$_id",
          name: 1,
          email: 1,

          tickets: {
            $size: "$tickets",
          },
        },
      },

      {
        $sort: {
          tickets: -1,
        },
      },
    ]);

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      tickets: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
      },

      priority: {
        high: highPriorityTickets,
        urgent: urgentTickets,
      },

      customers: {
        total: totalCustomers,
      },

      agents: {
        total: totalAgents,
        statistics: agentStats,
      },

      // ==========================================
      // AI INSIGHTS
      // ==========================================

      aiInsights: {
        categories: {
          technical: technicalTickets,
          billing: billingTickets,
          account: accountTickets,
          general: generalTickets,
          other: otherTickets,
        },

        sentiment: {
          positive: positiveSentimentTickets,
          neutral: neutralSentimentTickets,
          negative: negativeSentimentTickets,
        },

        smartAlerts: smartAlertTickets,
      },
    });

  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET RECENT TICKETS
// ==========================================
const getRecentTickets = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const tickets = await Ticket.find({
      company: user.company,
      isDeleted: false,
    })
      .populate(
        "customer",
        "name email"
      )
      .populate(
        "assignedTo",
        "name email role"
      )
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      tickets,
    });

  } catch (error) {
    console.error(
      "Get recent tickets error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET RECENT ACTIVITIES
// ==========================================
const getRecentActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const activities =
      await TicketActivity.find({
        company: user.company,
      })
        .populate(
          "user",
          "name email role"
        )
        .populate(
          "ticket",
          "title status priority category sentiment isDeleted"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

    // ==========================================
    // REMOVE DELETED TICKET ACTIVITIES
    // ==========================================

    const activeActivities =
      activities.filter(
        (activity) =>
          activity.ticket &&
          activity.ticket.isDeleted !== true
      );

    res.status(200).json({
      activities: activeActivities,
    });

  } catch (error) {
    console.error(
      "Get recent activities error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getDashboardStats,
  getRecentTickets,
  getRecentActivities,
};
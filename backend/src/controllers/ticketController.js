const mongoose = require("mongoose");

const createTicketActivity = require("../utils/ticketActivity");
const createNotification = require("../utils/notification");

const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Customer = require("../models/Customer");


// ==========================================
// CREATE TICKET
// ==========================================
const createTicket = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { title, description, priority, customer } = req.body;

    if (!title || !description || !customer) {
      return res.status(400).json({
        message: "Title, description and customer are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const allowedPriorities = [
      "low",
      "medium",
      "high",
      "urgent",
    ];

    if (
      priority &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    const existingCustomer = await Customer.findOne({
      _id: customer,
      company: user.company,
    });

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || "medium",
      customer,
      company: user.company,
      createdBy: user._id,
    });

    await createTicketActivity({
      ticketId: ticket._id,
      userId: user._id,
      companyId: user.company,
      action: "ticket_created",
      description: "Ticket was created",
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET ALL TICKETS
// Search + Filter + Pagination
// ==========================================
const getTickets = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { status, priority, search } = req.query;

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {
      company: user.company,
      isDeleted: false,
    };

    const allowedStatuses = [
      "open",
      "in-progress",
      "resolved",
      "closed",
    ];

    const allowedPriorities = [
      "low",
      "medium",
      "high",
      "urgent",
    ];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      filter.status = status;
    }

    if (priority) {
      if (!allowedPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      filter.priority = priority;
    }

    if (search && search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate("customer", "name email phone")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets =
      await Ticket.countDocuments(filter);

    res.status(200).json({
      tickets,
      pagination: {
        page,
        limit,
        totalTickets,
        totalPages: Math.ceil(
          totalTickets / limit
        ),
      },
    });
  } catch (error) {
    console.error("Get tickets error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET MY ASSIGNED TICKETS
// ==========================================
const getMyTickets = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const tickets = await Ticket.find({
      company: user.company,
      assignedTo: user._id,
      isDeleted: false,
    })
      .populate("customer", "name email phone")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error("Get my tickets error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET AGENTS
// ==========================================
const getAgents = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const agents = await User.find({
      company: user.company,
      role: "agent",
    }).select("name email role");

    res.status(200).json({
      agents,
    });
  } catch (error) {
    console.error("Get agents error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET SINGLE TICKET
// ==========================================
const getTicketById = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: user.company,
      isDeleted: false,
    })
      .populate("customer", "name email phone")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE TICKET
// ==========================================
const updateTicket = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: user.company,
      isDeleted: false,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const {
      title,
      description,
      status,
      priority,
    } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      status === undefined &&
      priority === undefined
    ) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const allowedStatuses = [
      "open",
      "in-progress",
      "resolved",
      "closed",
    ];

    const allowedPriorities = [
      "low",
      "medium",
      "high",
      "urgent",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    if (
      priority &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    const oldStatus = ticket.status;

    if (title !== undefined) {
      ticket.title = title.trim();
    }

    if (description !== undefined) {
      ticket.description = description.trim();
    }

    if (status !== undefined) {
      ticket.status = status;
    }

    if (priority !== undefined) {
      ticket.priority = priority;
    }

    await ticket.save();

    await createTicketActivity({
      ticketId: ticket._id,
      userId: user._id,
      companyId: user.company,
      action: "ticket_updated",
      description:
        oldStatus !== ticket.status
          ? `Ticket status changed from ${oldStatus} to ${ticket.status}`
          : "Ticket was updated",
    });

    // Notify assigned agent only if someone else updated it
    if (
      ticket.assignedTo &&
      ticket.assignedTo.toString() !==
        user._id.toString()
    ) {
      await createNotification({
        userId: ticket.assignedTo,
        companyId: user.company,
        ticketId: ticket._id,
        type: "ticket_updated",
        message: `Ticket "${ticket.title}" has been updated`,
      });
    }

    await ticket.populate(
      "customer",
      "name email phone"
    );

    await ticket.populate(
      "assignedTo",
      "name email role"
    );

    await ticket.populate(
      "createdBy",
      "name email role"
    );

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// ASSIGN TICKET
// ==========================================
const assignTicket = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        message: "Agent ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        message: "Invalid agent ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const agent = await User.findOne({
      _id: agentId,
      company: user.company,
      role: "agent",
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: user.company,
      isDeleted: false,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const previousAgent = ticket.assignedTo;

    ticket.assignedTo = agent._id;

    await ticket.save();

    await createTicketActivity({
      ticketId: ticket._id,
      userId: user._id,
      companyId: user.company,
      action: "ticket_assigned",
      description: `Ticket assigned to ${agent.name}`,
    });

    // Notify new agent
    if (
      agent._id.toString() !== user._id.toString()
    ) {
      await createNotification({
        userId: agent._id,
        companyId: user.company,
        ticketId: ticket._id,
        type: "ticket_assigned",
        message: `Ticket "${ticket.title}" has been assigned to you`,
      });
    }

    // Notify previous agent if ticket was reassigned
    if (
      previousAgent &&
      previousAgent.toString() !==
        agent._id.toString() &&
      previousAgent.toString() !==
        user._id.toString()
    ) {
      await createNotification({
        userId: previousAgent,
        companyId: user.company,
        ticketId: ticket._id,
        type: "ticket_reassigned",
        message: `Ticket "${ticket.title}" has been reassigned`,
      });
    }

    await ticket.populate(
      "assignedTo",
      "name email role"
    );

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticket,
    });
  } catch (error) {
    console.error("Assign ticket error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// DELETE TICKET - SOFT DELETE
// ==========================================
const deleteTicket = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket = await Ticket.findOne({
      _id: req.params.id,
      company: user.company,
      isDeleted: false,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    ticket.isDeleted = true;

    await ticket.save();

    await createTicketActivity({
      ticketId: ticket._id,
      userId: user._id,
      companyId: user.company,
      action: "ticket_deleted",
      description: "Ticket was deleted",
    });

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  getMyTickets,
  updateTicket,
  assignTicket,
  getAgents,
  deleteTicket,
};
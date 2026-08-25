const mongoose = require("mongoose");
const TicketActivity = require("../models/TicketActivity");

const createTicketActivity = async ({
  ticketId,
  userId,
  companyId,
  action,
  description,
}) => {
  try {
    if (
      !ticketId ||
      !userId ||
      !companyId ||
      !action ||
      !description
    ) {
      console.error(
        "Ticket activity error: Missing required fields"
      );

      return null;
    }

    if (
      !mongoose.Types.ObjectId.isValid(ticketId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(companyId)
    ) {
      console.error(
        "Ticket activity error: Invalid ObjectId"
      );

      return null;
    }

    const activity = await TicketActivity.create({
      ticket: ticketId,
      user: userId,
      company: companyId,
      action,
      description,
    });

    return activity;
  } catch (error) {
    console.error("Ticket activity error:", error);

    return null;
  }
};

module.exports = createTicketActivity;
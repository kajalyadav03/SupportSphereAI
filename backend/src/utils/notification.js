const mongoose = require("mongoose");

const Notification = require("../models/Notification");


// ==========================================
// CREATE NOTIFICATION
// ==========================================
const createNotification = async ({
  userId,
  companyId,
  ticketId,
  type,
  message,
}) => {
  try {
    if (
      !userId ||
      !companyId ||
      !type ||
      !message
    ) {
      console.error(
        "Notification error: Missing required fields"
      );

      return null;
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(companyId)
    ) {
      console.error(
        "Notification error: Invalid user/company ID"
      );

      return null;
    }

    if (
      ticketId &&
      !mongoose.Types.ObjectId.isValid(ticketId)
    ) {
      console.error(
        "Notification error: Invalid ticket ID"
      );

      return null;
    }

    const notification =
      await Notification.create({
        user: userId,
        company: companyId,
        ticket: ticketId || null,
        type: type.trim(),
        message: message.trim(),
      });

    return notification;
  } catch (error) {
    console.error(
      "Notification error:",
      error
    );

    return null;
  }
};


module.exports = createNotification;
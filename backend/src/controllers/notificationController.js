const mongoose = require("mongoose");

const Notification = require("../models/Notification");
const User = require("../models/User");


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {
      user: user._id,
      company: user.company,
    };

    const notifications = await Notification.find(filter)
      .populate("ticket", "title status priority")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotifications =
      await Notification.countDocuments(filter);

    res.status(200).json({
      notifications,
      pagination: {
        page,
        limit,
        totalNotifications,
        totalPages: Math.ceil(
          totalNotifications / limit
        ),
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================
const markNotificationAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      user: user._id,
      company: user.company,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const result = await Notification.updateMany(
      {
        user: user._id,
        company: user.company,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// GET UNREAD COUNT
// ==========================================
const getUnreadNotificationCount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || !user.company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const count = await Notification.countDocuments({
      user: user._id,
      company: user.company,
      isRead: false,
    });

    res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    console.error(
      "Get unread notification count error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const customerRoutes = require("./routes/customerRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ticketActivityRoutes = require("./routes/ticketActivityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SupportSphere API is running 🚀",
  });
});


// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/company",
  companyRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/ticket-activities",
  ticketActivityRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    message: "Internal server error",
  });
});


module.exports = app;
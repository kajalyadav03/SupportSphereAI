import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import TicketDetails from "./pages/TicketDetails";
import Customers from "./pages/Customers";
import Team from "./pages/Team";
import Notifications from "./pages/Notifications";


import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==========================================
            PROTECTED ROUTES
            Admin + Agent
        ========================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tickets"
            element={<Tickets />}
          />

          <Route
            path="/tickets/:id"
            element={<TicketDetails />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

        </Route>


        <Route
         path="/profile"
         element={<Profile />}
       />


        {/* ==========================================
            ADMIN ONLY
        ========================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >

          <Route
            path="/team"
            element={<Team />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
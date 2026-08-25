import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          statsData,
          ticketsData,
          activitiesData,
        ] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/recent-tickets"),
          api.get("/dashboard/recent-activities"),
        ]);

        setStats(statsData);

        setRecentTickets(
          ticketsData.tickets || []
        );

        setRecentActivities(
          activitiesData.activities || []
        );
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <Sidebar />

        <main className="ml-0 min-h-screen lg:ml-64">

          <div className="flex min-h-screen items-center justify-center px-6 pt-16 lg:pt-0">

            <p className="text-slate-400">
              Loading dashboard...
            </p>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <Sidebar />

        <main className="ml-0 min-h-screen lg:ml-64">

          <div className="flex min-h-screen items-center justify-center px-6 pt-16 lg:pt-0">

            <div className="rounded-2xl border border-red-500/30 bg-slate-900 p-8 text-center">

              <h1 className="text-2xl font-bold text-red-400">
                Dashboard Error
              </h1>

              <p className="mt-3 text-slate-400">
                {error}
              </p>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // STATS
  // ==========================================

  const ticketStats = stats?.tickets || {};
  const priorityStats = stats?.priority || {};
  const customerStats = stats?.customers || {};
  const agentStats = stats?.agents || {};

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-7xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

          {/* ==========================================
              WELCOME
          ========================================== */}

          <div className="mb-8">

            <p className="text-sm text-slate-500">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold">

              Welcome back,{" "}

              <span className="text-cyan-400">
                {user?.name || "User"}
              </span>

            </h1>

            <p className="mt-2 text-slate-400">
              Here's what's happening with your
              support team.
            </p>

          </div>


          {/* ==========================================
              TICKET OVERVIEW
          ========================================== */}

          <section>

            <h2 className="mb-4 text-xl font-semibold">
              Ticket Overview
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              <StatCard
                title="Total"
                value={ticketStats.total || 0}
              />

              <StatCard
                title="Open"
                value={ticketStats.open || 0}
              />

              <StatCard
                title="In Progress"
                value={
                  ticketStats.inProgress || 0
                }
              />

              <StatCard
                title="Resolved"
                value={
                  ticketStats.resolved || 0
                }
              />

              <StatCard
                title="Closed"
                value={
                  ticketStats.closed || 0
                }
              />

            </div>

          </section>


          {/* ==========================================
              OTHER STATS
          ========================================== */}

          <section className="mt-8">

            <div className="grid gap-4 md:grid-cols-3">

              <InfoCard
                title="Customers"
                value={
                  customerStats.total || 0
                }
              />

              <InfoCard
                title="Agents"
                value={
                  agentStats.total || 0
                }
              />

              <InfoCard
                title="High + Urgent"
                value={
                  (priorityStats.high || 0) +
                  (priorityStats.urgent || 0)
                }
              />

            </div>

          </section>


          {/* ==========================================
              AGENT PERFORMANCE
          ========================================== */}

          <section className="mt-10">

            <h2 className="mb-4 text-xl font-semibold">
              Agent Performance
            </h2>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

              {agentStats.statistics?.length > 0 ? (

                <div className="divide-y divide-white/10">

                  {agentStats.statistics.map(
                    (agent) => (

                      <div
                        key={agent.agentId}
                        className="flex items-center justify-between px-6 py-4"
                      >

                        <div>

                          <p className="font-semibold">
                            {agent.name}
                          </p>

                          <p className="text-sm text-slate-400">
                            {agent.email}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-xl font-bold text-cyan-400">
                            {agent.tickets}
                          </p>

                          <p className="text-xs text-slate-500">
                            tickets
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="px-6 py-8 text-center text-slate-500">
                  No agents found.
                </p>

              )}

            </div>

          </section>


          {/* ==========================================
              RECENT TICKETS
          ========================================== */}

          <section className="mt-10">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Recent Tickets
              </h2>

              <button
                onClick={() =>
                  navigate("/tickets")
                }
                className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                View All
              </button>

            </div>


            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

              {recentTickets.length > 0 ? (

                <div className="divide-y divide-white/10">

                  {recentTickets.map(
                    (ticket) => (

                      <div
                        key={ticket._id}
                        className="px-6 py-5"
                      >

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                          {/* Ticket information */}

                          <div>

                            <h3 className="font-semibold">
                              {ticket.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                              {ticket.customer?.name ||
                                "Unknown customer"}
                            </p>

                          </div>


                          {/* Status + Priority + Open */}

                          <div className="flex flex-wrap items-center gap-3">

                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs capitalize text-slate-300">
                              {ticket.status}
                            </span>

                            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs capitalize text-cyan-400">
                              {ticket.priority}
                            </span>

                            {/* OPEN BUTTON */}

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/tickets/${ticket._id}`
                                )
                              }
                              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                              Open
                            </button>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="px-6 py-8 text-center text-slate-500">
                  No recent tickets.
                </p>

              )}

            </div>

          </section>


          {/* ==========================================
              RECENT ACTIVITIES
          ========================================== */}

          <section className="mt-10">

            <h2 className="mb-4 text-xl font-semibold">
              Recent Activity
            </h2>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

              {recentActivities.length > 0 ? (

                <div className="divide-y divide-white/10">

                  {recentActivities.map(
                    (activity) => (

                      <div
                        key={activity._id}
                        className="px-6 py-4"
                      >

                        <p className="text-sm">

                          <span className="font-semibold">
                            {activity.user?.name ||
                              "User"}
                          </span>{" "}

                          {activity.description}

                        </p>

                        <p className="mt-1 text-xs capitalize text-slate-500">
                          {activity.action}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="px-6 py-8 text-center text-slate-500">
                  No recent activities.
                </p>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}


// ==========================================
// INFO CARD
// ==========================================

function InfoCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-cyan-400">
        {value}
      </p>

    </div>
  );
}

export default Dashboard;
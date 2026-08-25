import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const loadTicket = async () => {
    try {
      const data = await api.get(
        `/tickets/${id}`
      );

      setTicket(data.ticket);
      setStatus(data.ticket.status);
      setPriority(data.ticket.priority);
    } catch (error) {
      setError(
        error.message ||
          "Failed to load ticket"
      );
    }
  };

  const loadComments = async () => {
    try {
      const data = await api.get(
        `/comments/${id}`
      );

      setComments(data.comments || []);
    } catch (error) {
      console.error(
        "Comments error:",
        error
      );
    }
  };

  const loadActivities = async () => {
    try {
      const data = await api.get(
        `/ticket-activities/${id}`
      );

      setActivities(data.activities || []);
    } catch (error) {
      console.error(
        "Activities error:",
        error
      );
    }
  };

  const loadAgents = async () => {
    try {
      const data = await api.get(
        "/tickets/agents"
      );

      setAgents(data.agents || []);
    } catch (error) {
      console.error(
        "Agents error:",
        error
      );
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          loadTicket(),
          loadComments(),
          loadActivities(),
          loadAgents(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  const handleUpdateTicket = async () => {
    try {
      setError("");
      setSuccess("");

      const data = await api.put(
        `/tickets/${id}`,
        {
          status,
          priority,
        }
      );

      setTicket(data.ticket);

      setSuccess(
        data.message ||
          "Ticket updated successfully"
      );

      await loadActivities();
    } catch (error) {
      setError(
        error.message ||
          "Failed to update ticket"
      );
    }
  };

  const handleAssignTicket = async (
    agentId
  ) => {
    if (!agentId) return;

    try {
      setError("");
      setSuccess("");

      const data = await api.put(
        `/tickets/${id}/assign`,
        { agentId }
      );

      setTicket(data.ticket);

      setSuccess(
        data.message ||
          "Ticket assigned successfully"
      );

      await loadActivities();
    } catch (error) {
      setError(
        error.message ||
          "Failed to assign ticket"
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      setError("");
      setSuccess("");

      const data = await api.post(
        "/comments",
        {
          message: comment,
          ticketId: id,
        }
      );

      setComments((previous) => [
        ...previous,
        data.comment,
      ]);

      setComment("");

      setSuccess(
        data.message ||
          "Comment added successfully"
      );

      await loadActivities();
    } catch (error) {
      setError(
        error.message ||
          "Failed to add comment"
      );
    }
  };

  const handleDeleteTicket = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tickets/${id}`);

      navigate("/tickets");
    } catch (error) {
      setError(
        error.message ||
          "Failed to delete ticket"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="ml-0 min-h-screen lg:ml-64">
          <div className="flex min-h-screen items-center justify-center pt-16 lg:pt-0">
            Loading ticket...
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="ml-0 min-h-screen lg:ml-64">
          <div className="flex min-h-screen items-center justify-center pt-16 lg:pt-0">

            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Ticket not found
              </h1>

              <button
                onClick={() =>
                  navigate("/tickets")
                }
                className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
              >
                Back to Tickets
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-6xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

          <button
            onClick={() =>
              navigate("/tickets")
            }
            className="mb-4 text-sm text-slate-400 hover:text-cyan-400"
          >
            ← Back to Tickets
          </button>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Ticket Details
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {ticket.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">

              <span className="rounded-full bg-white/5 px-4 py-2 text-sm capitalize">
                {ticket.status}
              </span>

              <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm capitalize text-cyan-400">
                {ticket.priority}
              </span>

            </div>

          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
              {success}
            </div>
          )}

          {/* TICKET INFO */}

          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Ticket Information
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              {ticket.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                <p className="text-sm text-slate-500">
                  Customer
                </p>

                <p className="mt-2 font-semibold">
                  {ticket.customer?.name ||
                    "Unknown"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {ticket.customer?.email}
                </p>

              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                <p className="text-sm text-slate-500">
                  Assigned Agent
                </p>

                <p className="mt-2 font-semibold">
                  {ticket.assignedTo?.name ||
                    "Unassigned"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {ticket.assignedTo?.email}
                </p>

              </div>

            </div>

          </section>

          {/* UPDATE */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Update Ticket
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                >
                  <option value="open">
                    Open
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="urgent">
                    Urgent
                  </option>
                </select>
              </div>

              <div className="flex items-end">

                <button
                  onClick={handleUpdateTicket}
                  className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
                >
                  Save Changes
                </button>

              </div>

            </div>

          </section>

          {/* ASSIGN */}

          {user?.role === "admin" && (
            <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                Assign Ticket
              </h2>

              <select
                value={
                  ticket.assignedTo?._id || ""
                }
                onChange={(e) =>
                  handleAssignTicket(
                    e.target.value
                  )
                }
                className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
              >
                <option value="">
                  Select Agent
                </option>

                {agents.map((agent) => (
                  <option
                    key={agent._id}
                    value={agent._id}
                  >
                    {agent.name} -{" "}
                    {agent.email}
                  </option>
                ))}
              </select>

            </section>
          )}

          {/* COMMENTS */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Comments
            </h2>

            <form
              onSubmit={handleAddComment}
              className="mt-5"
            >

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Write a comment..."
                rows="4"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
              />

              <button
                type="submit"
                className="mt-3 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
              >
                Add Comment
              </button>

            </form>

            <div className="mt-8 divide-y divide-white/10">

              {comments.length === 0 ? (
                <p className="py-6 text-slate-500">
                  No comments yet.
                </p>
              ) : (
                comments.map((item) => (
                  <div
                    key={item._id}
                    className="py-5"
                  >

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">

                      <p className="font-semibold">
                        {item.user?.name ||
                          "User"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <p className="mt-2 text-slate-400">
                      {item.message}
                    </p>

                  </div>
                ))
              )}

            </div>

          </section>

          {/* ACTIVITIES */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Activity
            </h2>

            <div className="mt-5 divide-y divide-white/10">

              {activities.length === 0 ? (
                <p className="py-6 text-slate-500">
                  No activity yet.
                </p>
              ) : (
                activities.map(
                  (activity) => (
                    <div
                      key={activity._id}
                      className="py-4"
                    >

                      <p className="text-sm">
                        <span className="font-semibold">
                          {activity.user?.name ||
                            "User"}
                        </span>{" "}
                        {activity.description}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {activity.action} ·{" "}
                        {new Date(
                          activity.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>
                  )
                )
              )}

            </div>

          </section>

          {/* DELETE */}

          {user?.role === "admin" && (
            <div className="mt-8 flex justify-end">

              <button
                onClick={handleDeleteTicket}
                className="rounded-xl border border-red-500/30 px-5 py-3 text-red-400 hover:bg-red-500/10"
              >
                Delete Ticket
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default TicketDetails;
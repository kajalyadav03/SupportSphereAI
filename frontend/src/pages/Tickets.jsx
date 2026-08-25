import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Tickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    customer: "",
  });

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalTickets: 0,
    totalPages: 1,
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.status) {
        params.append("status", filters.status);
      }

      if (filters.priority) {
        params.append(
          "priority",
          filters.priority
        );
      }

      if (filters.search) {
        params.append("search", filters.search);
      }

      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const data = await api.get(
        `/tickets?${params.toString()}`
      );

      setTickets(data.tickets || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(
        "Get tickets error:",
        error
      );

      setError(
        error.message ||
          "Failed to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await api.get("/customers");

      setCustomers(data.customers || []);
    } catch (error) {
      console.error(
        "Get customers error:",
        error
      );
    }
  };

  useEffect(() => {
    loadTickets();
  }, [
    filters.status,
    filters.priority,
    filters.search,
    filters.page,
  ]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
      page: 1,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      if (!formData.customer) {
        setError(
          "Please select a customer."
        );
        return;
      }

      const data = await api.post(
        "/tickets",
        formData
      );

      setSuccess(
        data.message ||
          "Ticket created successfully"
      );

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        customer: "",
      });

      setShowCreateForm(false);

      setFilters((previous) => ({
        ...previous,
        page: 1,
      }));

      await loadTickets();
    } catch (error) {
      console.error(
        "Create ticket error:",
        error
      );

      setError(
        error.message ||
          "Failed to create ticket"
      );
    }
  };

  const handleDeleteTicket = async (
    ticketId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const data = await api.delete(
        `/tickets/${ticketId}`
      );

      setSuccess(
        data.message ||
          "Ticket deleted successfully"
      );

      await loadTickets();
    } catch (error) {
      console.error(
        "Delete ticket error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete ticket"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-7xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Support Management
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Tickets
              </h1>

              <p className="mt-2 text-slate-400">
                Manage customer support tickets.
              </p>
            </div>

            <button
              onClick={() =>
                setShowCreateForm(
                  !showCreateForm
                )
              }
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              {showCreateForm
                ? "Close Form"
                : "+ Create Ticket"}
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
              {success}
            </div>
          )}

          {/* CREATE FORM */}

          {showCreateForm && (
            <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                Create New Ticket
              </h2>

              <form
                onSubmit={handleCreateTicket}
                className="mt-6 grid gap-5"
              >

                <div>
                  <label className="mb-2 block text-sm">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Login Problem"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe the customer's issue..."
                    required
                    rows="5"
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleFormChange}
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

                  <div>
                    <label className="mb-2 block text-sm">
                      Customer
                    </label>

                    <select
                      name="customer"
                      value={formData.customer}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                    >
                      <option value="">
                        Select customer
                      </option>

                      {customers.map(
                        (customer) => (
                          <option
                            key={customer._id}
                            value={customer._id}
                          >
                            {customer.name} -{" "}
                            {customer.email}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Create Ticket
                </button>

              </form>

            </section>
          )}

          {/* FILTERS */}

          <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-5">

            <div className="grid gap-4 md:grid-cols-4">

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Search
                </label>

                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search tickets..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Status
                </label>

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                >
                  <option value="">
                    All Statuses
                  </option>

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
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                >
                  <option value="">
                    All Priorities
                  </option>

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

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Page
                </label>

                <div className="flex items-center gap-2">

                  <button
                    disabled={
                      pagination.page <= 1
                    }
                    onClick={() =>
                      setFilters(
                        (previous) => ({
                          ...previous,
                          page:
                            previous.page - 1,
                        })
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-3 disabled:opacity-30"
                  >
                    ←
                  </button>

                  <span className="flex-1 text-center text-sm">
                    {pagination.page} /{" "}
                    {pagination.totalPages}
                  </span>

                  <button
                    disabled={
                      pagination.page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      setFilters(
                        (previous) => ({
                          ...previous,
                          page:
                            previous.page + 1,
                        })
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-3 disabled:opacity-30"
                  >
                    →
                  </button>

                </div>
              </div>

            </div>

          </section>

          {/* TICKETS */}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

            {loading ? (
              <div className="px-6 py-12 text-center text-slate-400">
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="px-6 py-12 text-center">

                <p className="text-lg font-semibold">
                  No tickets found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your filters or
                  create a new ticket.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-white/10">

                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <button
                          onClick={() =>
                            navigate(
                              `/tickets/${ticket._id}`
                            )
                          }
                          className="text-left text-lg font-semibold hover:text-cyan-400"
                        >
                          {ticket.title}
                        </button>

                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                          {ticket.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

                          <span>
                            Customer:{" "}
                            {ticket.customer?.name ||
                              "Unknown"}
                          </span>

                          <span>
                            Assigned:{" "}
                            {ticket.assignedTo?.name ||
                              "Unassigned"}
                          </span>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs capitalize">
                          {ticket.status}
                        </span>

                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs capitalize text-cyan-400">
                          {ticket.priority}
                        </span>

                        <button
                          onClick={() =>
                            navigate(
                              `/tickets/${ticket._id}`
                            )
                          }
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTicket(
                              ticket._id
                            )
                          }
                          className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default Tickets;
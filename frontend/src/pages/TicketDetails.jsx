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

  // ==========================================
  // AI STATE
  // ==========================================

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiApplyLoading, setAiApplyLoading] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // ==========================================
  // LOAD TICKET
  // ==========================================

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


  // ==========================================
  // LOAD COMMENTS
  // ==========================================

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


  // ==========================================
  // LOAD ACTIVITIES
  // ==========================================

  const loadActivities = async () => {
    try {
      const data = await api.get(
        `/ticket-activities/${id}`
      );

      setActivities(
        data.activities || []
      );

    } catch (error) {
      console.error(
        "Activities error:",
        error
      );
    }
  };


  // ==========================================
  // LOAD AGENTS
  // ==========================================

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


  // ==========================================
  // LOAD EVERYTHING
  // ==========================================

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


  // ==========================================
  // ANALYZE TICKET WITH AI
  // ==========================================

  const handleAnalyzeWithAI = async () => {
    if (!ticket) return;

    try {
      setAiLoading(true);
      setAiError("");
      setError("");
      setSuccess("");

      const data = await api.post(
        "/ai/analyze-ticket",
        {
          title: ticket.title,
          description: ticket.description,
        }
      );

      setAiAnalysis(data.analysis);

      setSuccess(
        "AI analysis completed successfully."
      );

    } catch (error) {
      console.error(
        "AI analysis error:",
        error
      );

      setAiError(
        error.message ||
          "Failed to analyze ticket with AI"
      );

    } finally {
      setAiLoading(false);
    }
  };


  // ==========================================
  // NORMALIZE AI CATEGORY
  // ==========================================

  const normalizeCategory = (category) => {
    if (!category) {
      return "general";
    }

    const value = category
      .toString()
      .trim()
      .toLowerCase();


    // Technical

    if (
      value === "technical" ||
      value.includes("technical") ||
      value.includes("technical support") ||
      value.includes("bug") ||
      value.includes("software") ||
      value.includes("hardware") ||
      value.includes("system") ||
      value.includes("error") ||
      value.includes("issue")
    ) {
      return "technical";
    }


    // Billing

    if (
      value === "billing" ||
      value.includes("billing") ||
      value.includes("payment") ||
      value.includes("invoice") ||
      value.includes("refund") ||
      value.includes("charge") ||
      value.includes("subscription")
    ) {
      return "billing";
    }


    // Account

    if (
      value === "account" ||
      value.includes("account") ||
      value.includes("login") ||
      value.includes("password") ||
      value.includes("profile") ||
      value.includes("registration") ||
      value.includes("sign in") ||
      value.includes("signin")
    ) {
      return "account";
    }


    // Other

    if (
      value === "other" ||
      value.includes("other")
    ) {
      return "other";
    }


    // General

    if (
      value === "general" ||
      value.includes("general") ||
      value.includes("inquiry") ||
      value.includes("question") ||
      value.includes("information")
    ) {
      return "general";
    }


    return "general";
  };


  // ==========================================
  // NORMALIZE AI PRIORITY
  // ==========================================

  const normalizePriority = (
    priorityValue
  ) => {
    if (!priorityValue) {
      return "medium";
    }

    const value = priorityValue
      .toString()
      .trim()
      .toLowerCase();


    if (
      value.includes("urgent") ||
      value.includes("critical") ||
      value.includes("emergency")
    ) {
      return "urgent";
    }


    if (
      value.includes("high") ||
      value.includes("important")
    ) {
      return "high";
    }


    if (
      value.includes("low") ||
      value.includes("minor")
    ) {
      return "low";
    }


    if (
      value.includes("medium") ||
      value.includes("moderate") ||
      value.includes("normal")
    ) {
      return "medium";
    }


    return "medium";
  };


  // ==========================================
  // APPLY AI RECOMMENDATION
  // ==========================================

  const handleApplyAIRecommendation =
    async () => {
      if (!aiAnalysis) {
        setError(
          "Please analyze the ticket with AI first."
        );
        return;
      }

      try {
        setAiApplyLoading(true);
        setError("");
        setAiError("");
        setSuccess("");


        const recommendedPriority =
          normalizePriority(
            aiAnalysis.priority
          );


        const recommendedCategory =
          normalizeCategory(
            aiAnalysis.category
          );


        console.log(
          "AI ORIGINAL RECOMMENDATION:",
          {
            priority:
              aiAnalysis.priority,

            category:
              aiAnalysis.category,
          }
        );


        console.log(
          "NORMALIZED RECOMMENDATION:",
          {
            priority:
              recommendedPriority,

            category:
              recommendedCategory,
          }
        );


        const data = await api.patch(
          `/ai/tickets/${id}/apply-recommendation`,
          {
            priority:
              recommendedPriority,

            category:
              recommendedCategory,

              recommended_status:
                   aiAnalysis.recommended_status,
          }
        );


        setTicket(data.ticket);

        setPriority(
          data.ticket.priority
        );


        setSuccess(
          data.message ||
            "AI recommendation applied successfully"
        );


        await loadActivities();

      } catch (error) {
        console.error(
          "Apply AI recommendation error:",
          error
        );

        setError(
          error.message ||
            "Failed to apply AI recommendation"
        );

      } finally {
        setAiApplyLoading(false);
      }
    };


  // ==========================================
  // USE AI REPLY
  // ==========================================

  const handleUseAIReply = () => {
    if (!aiAnalysis?.suggested_reply) {
      return;
    }

    setComment(
      aiAnalysis.suggested_reply
    );

    setSuccess(
      "AI reply added to comment box. Review it before sending."
    );


    setTimeout(() => {
      const commentSection =
        document.getElementById(
          "comment-section"
        );

      if (commentSection) {
        commentSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };


  // ==========================================
  // COPY AI REPLY
  // ==========================================

  const handleCopyAIReply = async () => {
    if (!aiAnalysis?.suggested_reply) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        aiAnalysis.suggested_reply
      );

      setSuccess(
        "AI reply copied to clipboard."
      );

    } catch (error) {
      console.error(
        "Copy AI reply error:",
        error
      );

      setAiError(
        "Failed to copy AI reply."
      );
    }
  };


  // ==========================================
  // REGENERATE AI REPLY
  // ==========================================

  const handleRegenerateAIReply =
    async () => {
      if (!ticket) return;

      await handleAnalyzeWithAI();
    };


  // ==========================================
  // UPDATE TICKET
  // ==========================================

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


  // ==========================================
  // ASSIGN TICKET
  // ==========================================

  const handleAssignTicket = async (
    agentId
  ) => {
    if (!agentId) return;

    try {
      setError("");
      setSuccess("");

      const data = await api.put(
        `/tickets/${id}/assign`,
        {
          agentId,
        }
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


  // ==========================================
  // ADD COMMENT
  // ==========================================

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

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


  // ==========================================
  // DELETE TICKET
  // ==========================================

  const handleDeleteTicket = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/tickets/${id}`
      );

      navigate("/tickets");

    } catch (error) {
      setError(
        error.message ||
          "Failed to delete ticket"
      );
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

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


  // ==========================================
  // TICKET NOT FOUND
  // ==========================================

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


  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-6xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">


          {/* ==========================================
              BACK
          ========================================== */}

          <button
            onClick={() =>
              navigate("/tickets")
            }
            className="mb-4 text-sm text-slate-400 hover:text-cyan-400"
          >
            ← Back to Tickets
          </button>


          {/* ==========================================
              HEADER
          ========================================== */}

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

              {ticket.category && (
                <span className="rounded-full bg-purple-500/10 px-4 py-2 text-sm capitalize text-purple-400">
                  {ticket.category}
                </span>
              )}

              {ticket.sentiment && (
                <span className="rounded-full bg-pink-500/10 px-4 py-2 text-sm capitalize text-pink-400">
                  {ticket.sentiment}
                </span>
              )}

            </div>

          </div>


          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
              {error}
            </div>
          )}


          {/* ==========================================
              SUCCESS
          ========================================== */}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
              {success}
            </div>
          )}


          {/* ==========================================
              TICKET INFO
          ========================================== */}

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


          {/* ==========================================
              AI SUPPORT
          ========================================== */}

          <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-medium text-cyan-400">
                  AI ASSIST
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  SupportSphereAI
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Analyze this ticket and get an AI-powered
                  summary, category, priority, sentiment,
                  resolution, and suggested reply.
                </p>

              </div>


              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={aiLoading}
                className="shrink-0 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {aiLoading
                  ? "Analyzing..."
                  : "✨ Analyze with AI"}
              </button>

            </div>


            {/* ==========================================
                AI ERROR
            ========================================== */}

            {aiError && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                {aiError}
              </div>
            )}


            {/* ==========================================
                AI RESULT
            ========================================== */}

            {aiAnalysis && (
              <div className="mt-6 space-y-5">


                {/* ==========================================
                    SUMMARY
                ========================================== */}

                <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                  <p className="text-sm text-slate-500">
                    Summary
                  </p>

                  <p className="mt-2 leading-7 text-slate-300">
                    {aiAnalysis.summary ||
                      "No summary available."}
                  </p>

                </div>


                {/* ==========================================
                    METADATA
                ========================================== */}

                <div className="grid gap-4 md:grid-cols-3">

                  <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                    <p className="text-sm text-slate-500">
                      Category
                    </p>

                    <p className="mt-2 font-semibold capitalize text-cyan-400">
                      {aiAnalysis.category ||
                        "General"}
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                    <p className="text-sm text-slate-500">
                      AI Priority
                    </p>

                    <p className="mt-2 font-semibold capitalize text-cyan-400">
                      {aiAnalysis.priority ||
                        "Medium"}
                    </p>

                  </div>


                  <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                    <p className="text-sm text-slate-500">
                      Sentiment
                    </p>

                    <p className="mt-2 font-semibold capitalize text-cyan-400">
                      {aiAnalysis.sentiment ||
                        "Neutral"}
                    </p>

                  </div>

                </div>


                {/* ==========================================
                    APPLY AI RECOMMENDATION
                ========================================== */}

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="font-semibold text-white">
                        AI Recommendation
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Apply the AI-suggested category and
                        priority to this ticket.
                      </p>


                      <div className="mt-3 flex flex-wrap gap-2">

                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium capitalize text-cyan-400">
                          Category:{" "}
                          {normalizeCategory(
                            aiAnalysis.category
                          )}
                        </span>


                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium capitalize text-cyan-400">
                          Priority:{" "}
                          {normalizePriority(
                            aiAnalysis.priority
                          )}
                        </span>

                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium capitalize text-cyan-400">
                             Status:{" "}
                            {aiAnalysis.recommended_status ||
                                        "in-progress"}
                                  </span>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={
                        handleApplyAIRecommendation
                      }
                      disabled={aiApplyLoading}
                      className="shrink-0 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {aiApplyLoading
                        ? "Applying..."
                        : "✓ Apply AI Recommendation"}
                    </button>

                  </div>

                </div>


                {/* ==========================================
                    RESOLUTION
                ========================================== */}

                <div className="rounded-xl border border-white/10 bg-slate-950 p-5">

                  <p className="text-sm text-slate-500">
                    AI Resolution
                  </p>

                  <p className="mt-2 leading-7 text-slate-300">
                    {aiAnalysis.resolution ||
                      "No resolution available."}
                  </p>

                </div>


                {/* ==========================================
                    SUGGESTED REPLY
                ========================================== */}

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-sm font-semibold text-cyan-400">
                        🤖 Suggested Reply
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        AI-generated response for the customer
                      </p>

                    </div>


                    {/* ==========================================
                        AI REPLY ACTIONS
                    ========================================== */}

                    <div className="flex flex-wrap gap-2">

                      {/* COPY */}

                      <button
                        type="button"
                        onClick={
                          handleCopyAIReply
                        }
                        disabled={
                          !aiAnalysis?.suggested_reply
                        }
                        className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        📋 Copy
                      </button>


                      {/* USE */}

                      <button
                        type="button"
                        onClick={
                          handleUseAIReply
                        }
                        disabled={
                          !aiAnalysis?.suggested_reply
                        }
                        className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ✨ Use AI Reply
                      </button>


                      {/* REGENERATE */}

                      <button
                        type="button"
                        onClick={
                          handleRegenerateAIReply
                        }
                        disabled={aiLoading}
                        className="rounded-lg border border-cyan-500/30 px-3 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {aiLoading
                          ? "Generating..."
                          : "🔄 Regenerate"}
                      </button>

                    </div>

                  </div>


                  {/* REPLY */}

                  <div className="mt-4 rounded-xl border border-white/10 bg-slate-950 p-4">

                    <p className="whitespace-pre-wrap leading-7 text-slate-300">
                      {aiAnalysis.suggested_reply ||
                        "No suggested reply available."}
                    </p>

                  </div>


                  <p className="mt-3 text-xs text-slate-500">
                    Review the AI-generated response before sending it to the customer.
                  </p>

                </div>

              </div>
            )}

          </section>


          {/* ==========================================
              UPDATE TICKET
          ========================================== */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Update Ticket
            </h2>


            <div className="mt-5 grid gap-5 md:grid-cols-3">

              {/* STATUS */}

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


              {/* PRIORITY */}

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


              {/* SAVE */}

              <div className="flex items-end">

                <button
                  onClick={
                    handleUpdateTicket
                  }
                  className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
                >
                  Save Changes
                </button>

              </div>

            </div>

          </section>


          {/* ==========================================
              ASSIGN
          ========================================== */}

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


          {/* ==========================================
              COMMENTS
          ========================================== */}

          <section
            id="comment-section"
            className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6"
          >

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
                  setComment(
                    e.target.value
                  )
                }
                placeholder="Write a comment..."
                rows="5"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
              />


              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

                <p className="text-xs text-slate-500">
                  You can edit the AI reply before sending.
                </p>


                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add Comment
                </button>

              </div>

            </form>


            {/* COMMENTS LIST */}

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

                    <p className="mt-2 whitespace-pre-wrap text-slate-400">
                      {item.message}
                    </p>

                  </div>

                ))

              )}

            </div>

          </section>


          {/* ==========================================
              ACTIVITIES
          ========================================== */}

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


          {/* ==========================================
              DELETE
          ========================================== */}

          {user?.role === "admin" && (
            <div className="mt-8 flex justify-end">

              <button
                onClick={
                  handleDeleteTicket
                }
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
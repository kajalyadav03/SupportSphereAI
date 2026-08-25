import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Team() {
  const [members, setMembers] =
    useState([]);

  const [company, setCompany] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        teamData,
        companyData,
      ] = await Promise.all([
        api.get("/company/team"),
        api.get("/company"),
      ]);

      setMembers(
        teamData.members || []
      );

      setCompany(
        companyData.company || null
      );
    } catch (error) {
      console.error(
        "Get team error:",
        error
      );

      setError(
        error.message ||
          "Failed to load team"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const data = await api.post(
        "/company/team",
        formData
      );

      setSuccess(
        data.message ||
          "Team member added successfully"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setShowForm(false);

      await loadTeam();
    } catch (error) {
      console.error(
        "Add team member error:",
        error
      );

      setError(
        error.message ||
          "Failed to add team member"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-7xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Company Management
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Team
              </h1>

              <p className="mt-2 text-slate-400">
                Manage your support team.
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() =>
                  setShowForm(!showForm)
                }
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
              >
                {showForm
                  ? "Close Form"
                  : "+ Add Agent"}
              </button>
            )}

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

          {company && (
            <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

              <p className="text-sm text-slate-500">
                Company
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {company.name}
              </h2>

              <p className="mt-1 text-slate-400">
                {company.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs capitalize text-cyan-400">
                  {company.plan}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    company.isActive
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {company.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            </section>
          )}

          {showForm &&
            user?.role === "admin" && (
              <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                  Add Team Member
                </h2>

                <form
                  onSubmit={handleAddMember}
                  className="mt-6 grid gap-5 md:grid-cols-3"
                >

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Agent Name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="agent@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    minLength={6}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                  />

                  <div className="md:col-span-3">

                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
                    >
                      Add Agent
                    </button>

                  </div>

                </form>

              </section>
            )}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

            <div className="border-b border-white/10 px-6 py-5">

              <h2 className="text-xl font-semibold">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {members.length} member
                {members.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-slate-400">
                Loading team...
              </div>
            ) : members.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500">
                No team members found.
              </div>
            ) : (
              <div className="divide-y divide-white/10">

                {members.map((member) => (
                  <div
                    key={member._id}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >

                    <div>
                      <h3 className="font-semibold">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {member.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs capitalize ${
                          member.role === "admin"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-cyan-500/10 text-cyan-400"
                        }`}
                      >
                        {member.role}
                      </span>

                      {member.isVerified && (
                        <span className="text-xs text-green-400">
                          Verified
                        </span>
                      )}

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

export default Team;
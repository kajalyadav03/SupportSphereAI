import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
  });

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==========================================
  // LOAD PROFILE + COMPANY
  // ==========================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profileResponse =
        await api.get("/auth/profile");

      setProfile(
        profileResponse.user || null
      );

      const companyResponse =
        await api.get("/company");

      const companyResult =
        companyResponse.company || null;

      setCompany(companyResult);

      if (companyResult) {
        setCompanyData({
          name: companyResult.name || "",
          email: companyResult.email || "",
        });
      }
    } catch (error) {
      console.error(
        "Profile load error:",
        error
      );

      setError(
        error.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ==========================================
  // PASSWORD FORM
  // ==========================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // COMPANY FORM
  // ==========================================

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;

    setCompanyData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const data = await api.post(
        "/auth/change-password",
        passwordData
      );

      setSuccess(
        data.message ||
          "Password changed successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        error.message ||
          "Failed to change password"
      );
    }
  };

  // ==========================================
  // UPDATE COMPANY
  // ADMIN ONLY
  // ==========================================

  const handleUpdateCompany = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const data = await api.put(
        "/company",
        companyData
      );

      setCompany(data.company);

      setSuccess(
        data.message ||
          "Company updated successfully"
      );

      // Update local user object if needed
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (savedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(savedUser)
        );
      }
    } catch (error) {
      console.error(
        "Update company error:",
        error
      );

      setError(
        error.message ||
          "Failed to update company"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <Sidebar />

        <main className="ml-0 min-h-screen lg:ml-64">

          <div className="flex min-h-screen items-center justify-center pt-16 lg:pt-0">
            <p className="text-slate-400">
              Loading profile...
            </p>
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="ml-0 min-h-screen lg:ml-64">

        <div className="mx-auto max-w-5xl px-4 py-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <p className="text-sm text-slate-500">
              Account
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your account and company
              settings.
            </p>

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


          {/* USER PROFILE */}

          <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Account Information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <div>
                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="mt-2 font-semibold">
                  {profile?.name || user?.name || "User"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-2 font-semibold break-all">
                  {profile?.email ||
                    user?.email ||
                    ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Role
                </p>

                <p className="mt-2 font-semibold capitalize text-cyan-400">
                  {profile?.role ||
                    user?.role ||
                    "user"}
                </p>
              </div>

            </div>

          </section>


          {/* CHANGE PASSWORD */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Change Password
            </h2>

            <form
              onSubmit={handleChangePassword}
              className="mt-6 max-w-2xl space-y-5"
            >

              <div>

                <label className="mb-2 block text-sm text-slate-400">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm text-slate-400">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>


              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Change Password
              </button>

            </form>

          </section>


          {/* COMPANY SETTINGS */}

          {user?.role === "admin" && (
            <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                Company Settings
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Only administrators can update
                company information.
              </p>

              <form
                onSubmit={handleUpdateCompany}
                className="mt-6 max-w-2xl space-y-5"
              >

                <div>

                  <label className="mb-2 block text-sm text-slate-400">
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm text-slate-400">
                    Company Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={companyData.email}
                    onChange={handleCompanyChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />

                </div>


                {company && (
                  <div className="flex flex-wrap gap-3">

                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs capitalize text-cyan-400">
                      Plan: {company.plan}
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
                )}


                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Save Company Changes
                </button>

              </form>

            </section>
          )}

        </div>

      </main>

    </div>
  );
}

export default Profile;
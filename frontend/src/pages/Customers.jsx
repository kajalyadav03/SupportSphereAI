import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Customers() {
  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        "/customers"
      );

      setCustomers(
        data.customers || []
      );
    } catch (error) {
      console.error(
        "Get customers error:",
        error
      );

      setError(
        error.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      if (editingCustomer) {
        const data = await api.put(
          `/customers/${editingCustomer._id}`,
          formData
        );

        setSuccess(
          data.message ||
            "Customer updated successfully"
        );
      } else {
        const data = await api.post(
          "/customers",
          formData
        );

        setSuccess(
          data.message ||
            "Customer created successfully"
        );
      }

      resetForm();

      await loadCustomers();
    } catch (error) {
      console.error(
        "Customer save error:",
        error
      );

      setError(
        error.message ||
          "Failed to save customer"
      );
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (
    customerId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const data = await api.delete(
        `/customers/${customerId}`
      );

      setSuccess(
        data.message ||
          "Customer deleted successfully"
      );

      await loadCustomers();
    } catch (error) {
      console.error(
        "Delete customer error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete customer"
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
                Support Management
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Customers
              </h1>

              <p className="mt-2 text-slate-400">
                Manage your company's customers.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setShowForm(true);
                }
              }}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
            >
              {showForm
                ? "Close Form"
                : "+ Add Customer"}
            </button>

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

          {showForm && (
            <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                {editingCustomer
                  ? "Edit Customer"
                  : "Add Customer"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-5 md:grid-cols-3"
              >

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
                  />
                </div>

                <div className="flex gap-3 md:col-span-3">

                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
                  >
                    {editingCustomer
                      ? "Update Customer"
                      : "Create Customer"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/10 px-6 py-3"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

            <div className="border-b border-white/10 px-6 py-5">

              <h2 className="text-xl font-semibold">
                Customer List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {customers.length} customer
                {customers.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-slate-400">
                Loading customers...
              </div>
            ) : customers.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500">
                No customers found.
              </div>
            ) : (
              <div className="divide-y divide-white/10">

                {customers.map((customer) => (
                  <div
                    key={customer._id}
                    className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >

                    <div>
                      <h3 className="font-semibold">
                        {customer.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {customer.email}
                      </p>

                      {customer.phone && (
                        <p className="mt-1 text-sm text-slate-500">
                          {customer.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          handleEdit(customer)
                        }
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            customer._id
                          )
                        }
                        className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400"
                      >
                        Delete
                      </button>

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

export default Customers;
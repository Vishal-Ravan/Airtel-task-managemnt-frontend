import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";

import { createUser } from "../../services/users.api";

const CreateUser = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "vendor_executive",
    password: "",
    zone: "",
    state: "",
    site_codes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError(
        "Name, email, phone and password are required."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
        zone: formData.zone.trim(),
        state: formData.state.trim(),

        site_codes: formData.site_codes
          ? formData.site_codes
              .split(",")
              .map((code) => code.trim())
              .filter(Boolean)
          : [],
      };

      await createUser(payload);

      setSuccess("User created successfully.");

      setTimeout(() => {
        navigate("/users");
      }, 700);
    } catch (err) {
      console.error("Create user error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <button
          type="button"
          onClick={() => navigate("/users")}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create User
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new user and assign their role.
          </p>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-5 p-4 rounded-lg border border-green-200 bg-green-50 text-green-700">
          {success}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* NAME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* ROLE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="vendor_executive">
                Vendor Executive
              </option>

              <option value="vendor">
                Vendor
              </option>

              <option value="state_head">
                State Head
              </option>

              <option value="client">
                Client
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* ZONE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone
            </label>

            <input
              type="text"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              placeholder="e.g. West"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* STATE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* SITE CODES */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Codes
            </label>

            <input
              type="text"
              name="site_codes"
              value={formData.site_codes}
              onChange={handleChange}
              placeholder="SITE-001, SITE-002"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />

            <p className="text-xs text-gray-500 mt-1">
              Separate multiple site codes with commas.
            </p>
          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3 mt-7">

          <button
            type="button"
            onClick={() => navigate("/users")}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create User
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateUser;
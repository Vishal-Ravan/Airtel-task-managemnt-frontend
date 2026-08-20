import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  getUserById,
  updateUser,
} from "../../services/users.api";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "vendor_executive",
    zone: "",
    state: "",
    site_codes: "",
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUserById(id);

      const user =
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (!user) {
        setError("User not found.");
        return;
      }

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role:
          user?.role ||
          "vendor_executive",
        zone: user?.zone || "",
        state: user?.state || "",

        site_codes: Array.isArray(
          user?.site_codes
        )
          ? user.site_codes.join(", ")
          : "",
      });
    } catch (err) {
      console.error(
        "Get user error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load user."
      );
    } finally {
      setLoading(false);
    }
  };

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
      !formData.phone
    ) {
      setError(
        "Name, email and phone are required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        zone: formData.zone.trim(),
        state: formData.state.trim(),

        site_codes: formData.site_codes
          ? formData.site_codes
              .split(",")
              .map((code) =>
                code.trim()
              )
              .filter(Boolean)
          : [],
      };

      await updateUser(id, payload);

      setSuccess(
        "User updated successfully."
      );

      setTimeout(() => {
        navigate("/users");
      }, 700);
    } catch (err) {
      console.error(
        "Update user error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">

        <div className="flex items-center gap-2 text-gray-500">

          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading user...

        </div>

      </div>
    );
  }

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
            Edit User
          </h1>

          <p className="text-gray-500 mt-1">
            Update user information.
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

          <div className="md:col-span-2">

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
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default EditUser;
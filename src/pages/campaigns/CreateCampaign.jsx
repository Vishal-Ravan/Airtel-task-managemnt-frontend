import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Plus,
} from "lucide-react";

import {
  createCampaign,
} from "../../services/campaigns.api";

const CreateCampaign = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      code: "",
      description: "",
      start_date: "",
      end_date: "",
      is_active: true,
    });

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.code.trim()
    ) {
      setError(
        "Campaign name and code are required."
      );

      return;
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >
        formData.end_date
    ) {
      setError(
        "Start date cannot be after end date."
      );

      return;
    }

    try {
      setLoading(true);

      await createCampaign({
        name: formData.name.trim(),

        code: formData.code
          .trim()
          .toUpperCase(),

        description:
          formData.description.trim(),

        start_date:
          formData.start_date || null,

        end_date:
          formData.end_date || null,

        is_active:
          formData.is_active,
      });

      navigate("/campaigns");
    } catch (err) {
      console.error(
        "Create campaign error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to create campaign."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <button
          type="button"
          onClick={() =>
            navigate("/campaigns")
          }
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft size={19} />
        </button>

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Campaign
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new campaign.
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6"
      >

        <div className="space-y-5">

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Maharashtra Campaign"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />

          </div>

          {/* CODE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Code *
            </label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. MH-CAMP-2026"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg uppercase outline-none focus:ring-2 focus:ring-gray-900"
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              rows={4}
              placeholder="Enter campaign description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />

          </div>

          {/* DATES */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={
                  formData.start_date
                }
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={
                  formData.end_date
                }
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
              />

            </div>

          </div>

          {/* ACTIVE */}

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={
                formData.is_active
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active:
                    e.target.checked,
                }))
              }
              className="w-4 h-4"
            />

            <span className="text-sm text-gray-700">
              Campaign is active
            </span>

          </label>

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3 mt-7">

          <button
            type="button"
            onClick={() =>
              navigate("/campaigns")
            }
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                <Plus size={18} />
                Create Campaign
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default CreateCampaign;
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  getCampaignById,
  updateCampaign,
} from "../../services/campaigns.api";

const EditCampaign = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
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

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getCampaignById(id);

      const campaign =
        response?.data?.campaign;

      if (!campaign) {
        setError(
          "Campaign not found."
        );

        return;
      }

      setFormData({
        name:
          campaign.name || "",

        code:
          campaign.code || "",

        description:
          campaign.description || "",

        start_date:
          campaign.start_date
            ? campaign.start_date.substring(
                0,
                10
              )
            : "",

        end_date:
          campaign.end_date
            ? campaign.end_date.substring(
                0,
                10
              )
            : "",

        is_active:
          campaign.is_active ??
          true,
      });
    } catch (err) {
      console.error(
        "Get campaign error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load campaign."
      );
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);

      await updateCampaign(id, {
        name:
          formData.name.trim(),

        code:
          formData.code
            .trim()
            .toUpperCase(),

        description:
          formData.description.trim(),

        start_date:
          formData.start_date ||
          null,

        end_date:
          formData.end_date ||
          null,

        is_active:
          formData.is_active,
      });

      navigate("/campaigns");
    } catch (err) {
      console.error(
        "Update campaign error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update campaign."
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

          Loading campaign...

        </div>

      </div>
    );
  }

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
            Edit Campaign
          </h1>

          <p className="text-gray-500 mt-1">
            Update campaign information.
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
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
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

export default EditCampaign;
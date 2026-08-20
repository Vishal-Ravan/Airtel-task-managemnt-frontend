import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Loader2,
  MapPin,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  getCampaignById,
} from "../../services/campaigns.api";

const CampaignDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [campaign, setCampaign] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getCampaignById(id);

      const data =
        response?.data?.campaign;

      if (!data) {
        setError(
          "Campaign not found."
        );

        return;
      }

      setCampaign(data);
    } catch (err) {
      console.error(
        "Campaign details error:",
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

  if (error || !campaign) {
    return (
      <div className="max-w-7xl mx-auto">

        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error ||
            "Campaign not found."}
        </div>

        <button
          onClick={() =>
            navigate("/campaigns")
          }
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <ArrowLeft size={17} />
          Back to Campaigns
        </button>

      </div>
    );
  }

  const sites =
    Array.isArray(campaign.sites)
      ? campaign.sites
      : [];

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

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

            <div className="flex items-center gap-3">

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {campaign.name}
              </h1>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {campaign.is_active
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

            <p className="text-gray-500 mt-1">
              {campaign.code}
            </p>

          </div>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchCampaign}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            to={`/campaigns/${id}/sites/create`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Site
          </Link>

        </div>

      </div>

      {/* CAMPAIGN INFO */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white border rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Total Sites
          </p>

          <p className="text-2xl font-bold mt-1">
            {campaign.site_count ??
              sites.length}
          </p>

        </div>

        <div className="bg-white border rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Start Date
          </p>

          <p className="font-semibold mt-1">
            {campaign.start_date
              ? new Date(
                  campaign.start_date
                ).toLocaleDateString()
              : "-"}
          </p>

        </div>

        <div className="bg-white border rounded-xl p-5">

          <p className="text-sm text-gray-500">
            End Date
          </p>

          <p className="font-semibold mt-1">
            {campaign.end_date
              ? new Date(
                  campaign.end_date
                ).toLocaleDateString()
              : "-"}
          </p>

        </div>

        <div className="bg-white border rounded-xl p-5">

          <p className="text-sm text-gray-500">
            Status
          </p>

          <p className="font-semibold mt-1">
            {campaign.is_active
              ? "Active"
              : "Inactive"}
          </p>

        </div>

      </div>

      {/* DESCRIPTION */}

      {campaign.description && (
        <div className="bg-white border rounded-xl p-5 mb-6">

          <h2 className="font-semibold text-gray-900 mb-2">
            Description
          </h2>

          <p className="text-gray-600">
            {campaign.description}
          </p>

        </div>
      )}

      {/* SITES */}

      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b flex items-center justify-between">

          <div>

            <h2 className="font-semibold text-gray-900">
              Campaign Sites
            </h2>

            <p className="text-sm text-gray-500">
              All sites belonging to this campaign.
            </p>

          </div>

          <Link
            to={`/campaigns/${id}/sites/create`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
          >
            <Plus size={16} />
            Add Site
          </Link>

        </div>

        {sites.length === 0 ? (
          <div className="p-12 text-center">

            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">

              <MapPin
                size={25}
                className="text-gray-400"
              />

            </div>

            <h3 className="font-semibold">
              No sites added
            </h3>

            <p className="text-gray-500 mt-1 mb-4">
              Add the first site to this campaign.
            </p>

            <Link
              to={`/campaigns/${id}/sites/create`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
            >
              <Plus size={17} />
              Add Site
            </Link>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Site Code
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    State
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Zone
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Location
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {sites.map((site) => (

                  <tr
                    key={site._id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-5 py-4 font-semibold text-sm">
                      {site.site_code ||
                        "-"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {site.state || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {site.zone || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {site.location || "-"}
                    </td>

                    <td className="px-5 py-4">

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">
                        {site.status ||
                          "-"}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end">

                        <Link
                          to={`/sites/${site._id}`}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          title="View Site"
                        >
                          <Eye size={16} />
                        </Link>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default CampaignDetails;
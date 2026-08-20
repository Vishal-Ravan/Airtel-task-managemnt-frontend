import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Megaphone,
  Power,
} from "lucide-react";

import {
  getCampaigns,
  deleteCampaign,
  updateCampaignStatus,
} from "../../services/campaigns.api";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCampaigns();

      const data =
        response?.data?.campaigns ||
        response?.data?.data ||
        response?.data ||
        [];

      setCampaigns(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Campaigns error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load campaigns."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this campaign?"
      );

    if (!confirmDelete) return;

    try {
      await deleteCampaign(id);

      setCampaigns((prev) =>
        prev.filter(
          (campaign) =>
            campaign._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete campaign error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to delete campaign."
      );
    }
  };

  // ==========================================
  // STATUS
  // ==========================================

  const handleStatus = async (
    campaign
  ) => {
    try {
      await updateCampaignStatus(
        campaign._id,
        {
          is_active:
            !campaign.is_active,
        }
      );

      setCampaigns((prev) =>
        prev.map((item) =>
          item._id === campaign._id
            ? {
                ...item,
                is_active:
                  !item.is_active,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Campaign status error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to update campaign status."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredCampaigns =
    campaigns.filter((campaign) => {
      const text =
        search.toLowerCase();

      return (
        String(
          campaign?.name || ""
        )
          .toLowerCase()
          .includes(text) ||
        String(
          campaign?.code || ""
        )
          .toLowerCase()
          .includes(text) ||
        String(
          campaign?.description || ""
        )
          .toLowerCase()
          .includes(text)
      );
    });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading campaigns...
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Campaigns
          </h1>

          <p className="text-gray-500 mt-1">
            Manage campaigns and their sites.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchCampaigns}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            to="/campaigns/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Campaign
          </Link>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="bg-white border rounded-xl p-4 mb-5">

        <div className="relative max-w-lg">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search campaign..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
          />

        </div>

      </div>

      {/* EMPTY */}

      {filteredCampaigns.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">

          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone
              size={25}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-lg font-semibold">
            No campaigns found
          </h2>

          <p className="text-gray-500 mt-1">
            Create a campaign to get started.
          </p>

        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Campaign
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Code
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Sites
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Start Date
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    End Date
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

                {filteredCampaigns.map(
                  (campaign) => {

                    const id =
                      campaign?._id;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-gray-50"
                      >

                        {/* CAMPAIGN */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                              <Megaphone
                                size={18}
                                className="text-gray-500"
                              />

                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {campaign?.name ||
                                  "-"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {campaign?.description ||
                                  "No description"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CODE */}

                        <td className="px-5 py-4">

                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                            {campaign?.code ||
                              "-"}
                          </span>

                        </td>

                        {/* SITES */}

                        <td className="px-5 py-4 text-sm font-medium">
                          {campaign?.site_count ??
                            0}
                        </td>

                        {/* START DATE */}

                        <td className="px-5 py-4 text-sm">

                          {campaign?.start_date
                            ? new Date(
                                campaign.start_date
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* END DATE */}

                        <td className="px-5 py-4 text-sm">

                          {campaign?.end_date
                            ? new Date(
                                campaign.end_date
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              handleStatus(
                                campaign
                              )
                            }
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                              campaign?.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >

                            <span className="w-2 h-2 rounded-full bg-current" />

                            {campaign?.is_active
                              ? "Active"
                              : "Inactive"}

                          </button>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/campaigns/${id}`}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              to={`/campaigns/${id}/edit`}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  id
                                )
                              }
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
};

export default Campaigns;
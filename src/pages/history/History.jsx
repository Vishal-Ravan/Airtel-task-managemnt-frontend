import { useEffect, useState } from "react";
import {
  Search,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  Loader2,
} from "lucide-react";

import { getHistory } from "../../services/history.api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getHistory();

      const data =
        response?.data?.data ||
        response?.data?.history ||
        response?.data ||
        [];

      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("History error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load history"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item?.site?.site_code
        ?.toLowerCase()
        .includes(searchText) ||
      item?.site_code
        ?.toLowerCase()
        .includes(searchText) ||
      item?.person_name
        ?.toLowerCase()
        .includes(searchText) ||
      item?.action
        ?.toLowerCase()
        .includes(searchText) ||
      item?.status
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const getStatusIcon = (status) => {
    const value = status?.toLowerCase();

    if (
      value === "approved" ||
      value === "approve"
    ) {
      return (
        <CheckCircle
          size={17}
          className="text-green-600"
        />
      );
    }

    if (
      value === "rejected" ||
      value === "reject"
    ) {
      return (
        <XCircle
          size={17}
          className="text-red-600"
        />
      );
    }

    return (
      <Clock
        size={17}
        className="text-yellow-600"
      />
    );
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (
      value === "approved" ||
      value === "approve"
    ) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      value === "rejected" ||
      value === "reject"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading history...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Site History
          </h1>

          <p className="text-gray-500 mt-1">
            Track every submission, upload and
            approval activity.
          </p>
        </div>

        {/* Search */}

        <div className="relative w-full md:w-80">

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
            placeholder="Search site, user..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
          />

        </div>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}

      {!error &&
        filteredHistory.length === 0 && (
          <div className="bg-white border rounded-xl p-12 text-center">

            <Clock
              size={45}
              className="mx-auto text-gray-400 mb-4"
            />

            <h2 className="text-lg font-semibold">
              No History Found
            </h2>

            <p className="text-gray-500 mt-1">
              No site activity is available.
            </p>

          </div>
        )}

      {/* History */}

      {filteredHistory.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Site
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Action
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Performed By
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Date & Time
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold">
                    Photos
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredHistory.map(
                  (item, index) => {

                    const siteCode =
                      item?.site?.site_code ||
                      item?.site_code ||
                      "N/A";

                    const personName =
                      item?.person_name ||
                      item?.performedBy?.name ||
                      item?.user?.name ||
                      "Unknown";

                    const status =
                      item?.status ||
                      "pending";

                    const action =
                      item?.action ||
                      "Submission";

                    const date =
                      item?.createdAt ||
                      item?.updatedAt;

                    const photos =
                      item?.site_images ||
                      item?.images ||
                      [];

                    return (
                      <tr
                        key={
                          item?._id ||
                          index
                        }
                        className="hover:bg-gray-50"
                      >

                        {/* Site */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-gray-900">
                            {siteCode}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item?.site?.location ||
                              item?.location ||
                              "-"}
                          </p>

                        </td>

                        {/* Action */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <Upload
                              size={16}
                              className="text-gray-500"
                            />

                            <span className="text-sm font-medium">
                              {action}
                            </span>

                          </div>

                        </td>

                        {/* User */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">

                              <User
                                size={15}
                                className="text-gray-500"
                              />

                            </div>

                            <div>

                              <p className="text-sm font-medium">
                                {personName}
                              </p>

                              {item?.performedBy
                                ?.role && (
                                <p className="text-xs text-gray-500">
                                  {
                                    item
                                      .performedBy
                                      .role
                                  }
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusClass(
                              status
                            )}`}
                          >

                            {getStatusIcon(
                              status
                            )}

                            {status}

                          </span>

                        </td>

                        {/* Date */}

                        <td className="px-5 py-4">

                          {date ? (
                            <div>

                              <p className="text-sm font-medium">
                                {new Date(
                                  date
                                ).toLocaleDateString()}
                              </p>

                              <p className="text-xs text-gray-500">
                                {new Date(
                                  date
                                ).toLocaleTimeString()}
                              </p>

                            </div>
                          ) : (
                            "-"
                          )}

                        </td>

                        {/* Photos */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end">

                            {photos.length > 0 ? (
                              <button
                                type="button"
                                onClick={() =>
                                  window.open(
                                    photos[0]?.url ||
                                      photos[0],
                                    "_blank"
                                  )
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                              >

                                <Eye size={16} />

                                View

                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No photos
                              </span>
                            )}

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

export default History;
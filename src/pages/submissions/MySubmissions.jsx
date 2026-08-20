import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { getSubmissions } from "../../services/submissions.api";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ========================================
  // FETCH MY SUBMISSIONS
  // ========================================

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSubmissions();

      console.log(
        "MY SUBMISSIONS RESPONSE:",
        response?.data
      );

      // Backend response:
      // {
      //   success: true,
      //   count: 1,
      //   submissions: [...]
      // }

      const data =
        response?.data?.submissions || [];

      setSubmissions(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Submissions error:",
        err
      );

      console.error(
        "Submissions error response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load submissions"
      );

      setSubmissions([]);

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SEARCH / FILTER
  // ========================================

  const filteredSubmissions =
    submissions.filter((item) => {

      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      const siteCode =
        String(
          item?.site?.site_code ||
          item?.site_code ||
          ""
        ).toLowerCase();

      const siteName =
        String(
          item?.site?.site_name ||
          ""
        ).toLowerCase();

      const location =
        String(
          item?.site?.location ||
          item?.site?.town ||
          item?.location ||
          ""
        ).toLowerCase();

      const personName =
        String(
          item?.person_name ||
          item?.submitted_by?.name ||
          item?.user?.name ||
          ""
        ).toLowerCase();

      const status =
        String(
          item?.status ||
          ""
        ).toLowerCase();

      return (
        siteCode.includes(searchText) ||
        siteName.includes(searchText) ||
        location.includes(searchText) ||
        personName.includes(searchText) ||
        status.includes(searchText)
      );
    });

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status) => {

    const normalizedStatus =
      String(status || "")
        .toLowerCase();

    switch (normalizedStatus) {

      case "approved":
      case "approve":
      case "vendor_approved":
      case "state_head_approved":
        return "bg-green-50 text-green-700 border-green-200";

      case "rejected":
      case "reject":
      case "vendor_rejected":
      case "state_head_rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  // ========================================
  // STATUS ICON
  // ========================================

  const getStatusIcon = (status) => {

    const normalizedStatus =
      String(status || "")
        .toLowerCase();

    switch (normalizedStatus) {

      case "approved":
      case "approve":
      case "vendor_approved":
      case "state_head_approved":
        return (
          <CheckCircle size={15} />
        );

      case "rejected":
      case "reject":
      case "vendor_rejected":
      case "state_head_rejected":
        return (
          <XCircle size={15} />
        );

      default:
        return (
          <Clock size={15} />
        );
    }
  };

  // ========================================
  // FORMAT STATUS
  // ========================================

  const formatStatus = (status) => {

    if (!status) {
      return "Pending";
    }

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">

        <div className="flex items-center gap-2 text-gray-500">

          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading submissions...

        </div>

      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="max-w-7xl mx-auto">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Submissions
          </h1>

          <p className="text-gray-500 mt-1">
            View and track your submitted sites.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={fetchSubmissions}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />

            Refresh
          </button>

          <Link
            to="/submissions/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={18} />

            New Submission
          </Link>

        </div>

      </div>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={fetchSubmissions}
            className="text-sm font-medium underline"
          >
            Try Again
          </button>

        </div>
      )}

      {/* ================================= */}
      {/* SUMMARY */}
      {/* ================================= */}

      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

          <div className="bg-white border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Total Submissions
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {submissions.length}
            </p>

          </div>

          <div className="bg-white border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {
                submissions.filter(
                  (item) =>
                    ![
                      "approved",
                      "approve",
                      "rejected",
                      "reject",
                    ].includes(
                      String(
                        item?.status || ""
                      ).toLowerCase()
                    )
                ).length
              }
            </p>

          </div>

          <div className="bg-white border rounded-xl p-5">

            <p className="text-sm text-gray-500">
              Approved
            </p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {
                submissions.filter(
                  (item) =>
                    [
                      "approved",
                      "approve",
                      "vendor_approved",
                      "state_head_approved",
                    ].includes(
                      String(
                        item?.status || ""
                      ).toLowerCase()
                    )
                ).length
              }
            </p>

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

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
            placeholder="Search site code, site name, location, name or status..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
          />

        </div>

      </div>

      {/* ================================= */}
      {/* EMPTY */}
      {/* ================================= */}

      {!error &&
        filteredSubmissions.length === 0 && (

          <div className="bg-white border rounded-xl p-12 text-center">

            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">

              <Search
                size={24}
                className="text-gray-400"
              />

            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              {search
                ? "No matching submissions"
                : "No submissions found"}
            </h2>

            <p className="text-gray-500 mt-1">

              {search
                ? "Try changing your search."
                : "You haven't submitted any site yet."}

            </p>

            {!search && (
              <Link
                to="/submissions/create"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-black text-white rounded-lg"
              >
                <Plus size={17} />

                Create Submission

              </Link>
            )}

          </div>
        )}

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      {!error &&
        filteredSubmissions.length > 0 && (

          <div className="bg-white border rounded-xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                {/* TABLE HEADER */}

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                      Site
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                      Submitted By
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                      Submitted At
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody className="divide-y">

                  {filteredSubmissions.map(
                    (item, index) => {

                      // -------------------------
                      // SITE
                      // -------------------------

                      const siteCode =
                        item?.site?.site_code ||
                        item?.site_code ||
                        "N/A";

                      const siteName =
                        item?.site?.site_name ||
                        "";

                      // -------------------------
                      // LOCATION
                      // -------------------------

                      const location =
                        item?.site?.location ||
                        item?.site?.town ||
                        item?.location ||
                        "-";

                      // -------------------------
                      // STATE
                      // -------------------------

                      const state =
                        item?.site?.state ||
                        "";

                      // -------------------------
                      // PERSON
                      // -------------------------

                      const personName =
                        item?.person_name ||
                        item?.submitted_by?.name ||
                        item?.user?.name ||
                        "Unknown";

                      // -------------------------
                      // STATUS
                      // -------------------------

                      const status =
                        item?.status ||
                        "pending";

                      // -------------------------
                      // DATE
                      // -------------------------

                      const date =
                        item?.createdAt ||
                        item?.created_at;

                      return (

                        <tr
                          key={
                            item?._id ||
                            index
                          }
                          className="hover:bg-gray-50 transition"
                        >

                          {/* SITE */}

                          <td className="px-5 py-4">

                            <p className="font-semibold text-gray-900">
                              {siteCode}
                            </p>

                            {siteName && (
                              <p className="text-xs text-gray-500 mt-1">
                                {siteName}
                              </p>
                            )}

                            {state && (
                              <p className="text-xs text-gray-400 mt-1">
                                {state}
                              </p>
                            )}

                          </td>

                          {/* LOCATION */}

                          <td className="px-5 py-4">

                            <p className="text-sm text-gray-700">
                              {location}
                            </p>

                          </td>

                          {/* USER */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-medium text-gray-900">
                              {personName}
                            </p>

                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">

                            {date ? (

                              <div>

                                <p className="text-sm text-gray-900">

                                  {new Date(
                                    date
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )}

                                </p>

                                <p className="text-xs text-gray-500 mt-1">

                                  {new Date(
                                    date
                                  ).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}

                                </p>

                              </div>

                            ) : (
                              "-"
                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusClass(
                                status
                              )}`}
                            >

                              {getStatusIcon(
                                status
                              )}

                              {formatStatus(
                                status
                              )}

                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end">

                              <Link
                                to={`/submissions/${item._id}`}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700"
                              >

                                <Eye
                                  size={16}
                                />

                                View

                              </Link>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* RESULT COUNT */}

            <div className="border-t px-5 py-3 text-sm text-gray-500">

              Showing{" "}
              <span className="font-medium text-gray-700">
                {filteredSubmissions.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {submissions.length}
              </span>{" "}
              submissions

            </div>

          </div>

        )}

    </div>
  );
};

export default MySubmissions;
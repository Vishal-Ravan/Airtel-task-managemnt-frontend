import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { getSites } from "../../services/sites.api";

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSites();

      const data =
        response?.data?.data ||
        response?.data?.sites ||
        response?.data ||
        [];

      setSites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Sites error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load sites."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter((site) => {
    const searchText = search.toLowerCase();

    return (
      String(site?.site_code || "")
        .toLowerCase()
        .includes(searchText) ||
      String(site?.state || "")
        .toLowerCase()
        .includes(searchText) ||
      String(site?.zone || "")
        .toLowerCase()
        .includes(searchText) ||
      String(site?.location || "")
        .toLowerCase()
        .includes(searchText) ||
      String(site?.media_type || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const formatDate = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "-";
    }

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading sites...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Sites
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and view all assigned sites.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={fetchSites}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {/* <Link
            to="/sites/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Site
          </Link> */}

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

        <div className="relative max-w-md">

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
            placeholder="Search site code, state, zone..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
          />

        </div>

      </div>

      {/* EMPTY */}

      {!error &&
        filteredSites.length === 0 && (
          <div className="bg-white border rounded-xl p-12 text-center">

            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin
                size={25}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              No sites found
            </h2>

            <p className="text-gray-500 mt-1">
              No sites match your search.
            </p>

          </div>
        )}

      {/* TABLE */}

      {filteredSites.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">

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
                    Media Type
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Dimensions
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Start Date
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredSites.map(
                  (site, index) => {

                    return (
                      <tr
                        key={
                          site?._id ||
                          site?.id ||
                          index
                        }
                        className="hover:bg-gray-50"
                      >

                        {/* SITE CODE */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-gray-900">
                            {site?.site_code ||
                              "-"}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {site?.type || "-"}
                          </p>

                        </td>

                        {/* STATE */}

                        <td className="px-5 py-4 text-sm">
                          {site?.state || "-"}
                        </td>

                        {/* ZONE */}

                        <td className="px-5 py-4 text-sm">
                          {site?.zone || "-"}
                        </td>

                        {/* LOCATION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm">

                            <MapPin
                              size={15}
                              className="text-gray-400"
                            />

                            <span>
                              {site?.location ||
                                "-"}
                            </span>

                          </div>

                        </td>

                        {/* MEDIA */}

                        <td className="px-5 py-4 text-sm">
                          {site?.media_type ||
                            "-"}
                        </td>

                        {/* DIMENSIONS */}

                        <td className="px-5 py-4">

                          <p className="text-sm">
                            {site?.width || "-"} ×{" "}
                            {site?.height || "-"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {site?.total_sqr_ft ||
                              "-"}{" "}
                            sq.ft
                          </p>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm">
                          {formatDate(
                            site?.start_date
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end">

                            <Link
                              to={`/sites/${
                                site?._id ||
                                site?.id
                              }`}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                            >
                              <Eye size={16} />
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

        </div>
      )}

    </div>
  );
};

export default Sites;
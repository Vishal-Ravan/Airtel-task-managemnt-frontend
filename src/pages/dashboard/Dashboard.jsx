import { useEffect, useState } from "react";

import {
  MapPin,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Upload,
  Building2,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { getDashboardStats } from "../../services/approvals.api";


// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // FETCH DASHBOARD
  // ===================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      setError("");

      const response =
        await getDashboardStats();

      if (response.data?.success) {
        setData(response.data);
      } else {
        setError(
          response.data?.message ||
            "Failed to load dashboard"
        );
      }
    } catch (err) {
      console.error(
        "Dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={35}
            className="animate-spin text-red-500"
          />

          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle
            className="mx-auto text-red-500 mb-3"
            size={35}
          />

          <h2 className="font-semibold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="text-red-500 mt-1">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // ===================================================
  // DATA
  // ===================================================

  const role = data.role;

  const counts = data.counts || {};

  const chartData =
    data.chartData || {};

  const sites =
    data.sites || [];

  // ===================================================
  // ROLE TITLE
  // ===================================================

  const roleTitle = {
    vendor: "Vendor Dashboard",
    state_head: "State Head Dashboard",
    client: "Client Dashboard",
  };

  // ===================================================
  // STATS CARDS
  // ===================================================

  const stats = [
    {
      title: "Total Sites",
      value: counts.totalSites || 0,
      icon: MapPin,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },

    {
      title: "Images Uploaded",
      value: counts.imageUploaded || 0,
      icon: Upload,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700",
    },

    {
      title: "Pending Images",
      value: counts.imagePending || 0,
      icon: ImageIcon,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
      valueColor: "text-orange-700",
    },

    {
      title: "Vendor Pending",
      value: counts.vendorPending || 0,
      icon: Clock,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-700",
    },

    {
      title: "Vendor Approved",
      value: counts.vendorApproved || 0,
      icon: CheckCircle,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },

    {
      title: "Vendor Rejected",
      value: counts.vendorRejected || 0,
      icon: XCircle,
      bg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-700",
    },

    {
      title: "State Head Pending",
      value: counts.stateHeadPending || 0,
      icon: Clock,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-700",
    },

    {
      title: "State Head Approved",
      value: counts.stateHeadApproved || 0,
      icon: CheckCircle,
      bg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
    },

    {
      title: "State Head Rejected",
      value: counts.stateHeadRejected || 0,
      icon: XCircle,
      bg: "bg-rose-100",
      iconColor: "text-rose-600",
      valueColor: "text-rose-700",
    },
  ];

  // ===================================================
  // VENDOR PIE
  // ===================================================

  const vendorChart = [
    {
      name: "Pending",
      value:
        chartData.vendor?.pending || 0,
    },

    {
      name: "Approved",
      value:
        chartData.vendor?.approved || 0,
    },

    {
      name: "Rejected",
      value:
        chartData.vendor?.rejected || 0,
    },
  ];

  // ===================================================
  // STATE HEAD PIE
  // ===================================================

  const stateHeadChart = [
    {
      name: "Pending",
      value:
        chartData.stateHead?.pending || 0,
    },

    {
      name: "Approved",
      value:
        chartData.stateHead?.approved || 0,
    },

    {
      name: "Rejected",
      value:
        chartData.stateHead?.rejected || 0,
    },
  ];

  // ===================================================
  // IMAGE CHART
  // ===================================================

  const imageChart = [
    {
      name: "Uploaded",
      value:
        chartData.images?.uploaded || 0,
    },

    {
      name: "Pending",
      value:
        chartData.images?.pending || 0,
    },
  ];

  // ===================================================
  // BAR CHART
  // ===================================================

  const comparisonChart = [
    {
      name: "Vendor",
      Pending:
        chartData.vendor?.pending || 0,
      Approved:
        chartData.vendor?.approved || 0,
      Rejected:
        chartData.vendor?.rejected || 0,
    },

    {
      name: "State Head",
      Pending:
        chartData.stateHead?.pending || 0,
      Approved:
        chartData.stateHead?.approved || 0,
      Rejected:
        chartData.stateHead?.rejected || 0,
    },
  ];

  // ===================================================
  // PIE COLORS
  // ===================================================

  const COLORS = [
    "#F59E0B",
    "#22C55E",
    "#EF4444",
  ];

  const IMAGE_COLORS = [
    "#8B5CF6",
    "#F97316",
  ];

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {roleTitle[role] || "Dashboard"}
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome,{" "}
          <span className="font-medium text-gray-700">
            {data.user?.name}
          </span>
        </p>
      </div>


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2
                    className={`text-3xl font-bold mt-2 ${item.valueColor}`}
                  >
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}
                >
                  <Icon
                    size={23}
                    className={item.iconColor}
                  />
                </div>

              </div>
            </div>
          );
        })}

      </div>


      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ===============================================
            VENDOR CHART
        =============================================== */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Vendor Status
            </h2>

            <p className="text-sm text-gray-500">
              Vendor approval overview
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={vendorChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {vendorChart.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>


        {/* ===============================================
            STATE HEAD CHART
        =============================================== */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              State Head Status
            </h2>

            <p className="text-sm text-gray-500">
              State Head approval overview
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={stateHeadChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {stateHeadChart.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>


        {/* ===============================================
            IMAGE CHART
        =============================================== */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Image Upload Status
            </h2>

            <p className="text-sm text-gray-500">
              Site image upload overview
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={imageChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {imageChart.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          IMAGE_COLORS[
                            index
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>


        {/* ===============================================
            COMPARISON BAR CHART
        =============================================== */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">

          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Approval Comparison
            </h2>

            <p className="text-sm text-gray-500">
              Vendor vs State Head
            </p>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={comparisonChart}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="Pending"
                  fill="#F59E0B"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                />

                <Bar
                  dataKey="Approved"
                  fill="#22C55E"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                />

                <Bar
                  dataKey="Rejected"
                  fill="#EF4444"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>


      {/* =================================================
          CLIENT / ALL SITE DETAILS
      ================================================= */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-lg">
                Site Details
              </h2>

              <p className="text-sm text-gray-500">
                {sites.length} sites found
              </p>
            </div>

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-4">
                  Site
                </th>

                <th className="text-left px-5 py-4">
                  Location
                </th>

                <th className="text-left px-5 py-4">
                  Images
                </th>

                <th className="text-left px-5 py-4">
                  Vendor
                </th>

                <th className="text-left px-5 py-4">
                  State Head
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {sites.map((site) => (

                <tr
                  key={site._id}
                  className="hover:bg-gray-50"
                >

                  {/* SITE */}

                  <td className="px-5 py-4">

                    <div className="font-semibold text-gray-900">
                      {site.site_name}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {site.site_code}
                    </div>

                  </td>


                  {/* LOCATION */}

                  <td className="px-5 py-4">

                    <div>
                      {site.town || "-"}
                    </div>

                    <div className="text-xs text-gray-500">
                      {site.state || "-"}
                    </div>

                  </td>


                  {/* IMAGES */}

                  <td className="px-5 py-4">

                    {site.imageUploaded ? (

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <CheckCircle
                          size={14}
                        />

                        Uploaded (
                        {site.imageCount}
                        )
                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                        <Clock
                          size={14}
                        />

                        Pending
                      </span>

                    )}

                  </td>


                  {/* VENDOR */}

                  <td className="px-5 py-4">

                    <StatusBadge
                      status={
                        site.vendorStatus
                      }
                    />

                  </td>


                  {/* STATE HEAD */}

                  <td className="px-5 py-4">

                    <StatusBadge
                      status={
                        site.stateHeadStatus
                      }
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* EMPTY */}

          {sites.length === 0 && (

            <div className="py-12 text-center text-gray-500">
              No sites found
            </div>

          )}

        </div>

      </div>

    </div>
  );
};


// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
}) => {

  const config = {

    pending: {
      text: "Pending",
      className:
        "bg-yellow-100 text-yellow-700",
    },

    approved: {
      text: "Approved",
      className:
        "bg-green-100 text-green-700",
    },

    rejected: {
      text: "Rejected",
      className:
        "bg-red-100 text-red-700",
    },

  };

  const item =
    config[status] ||
    config.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.className}`}
    >
      {item.text}
    </span>
  );
};


export default Dashboard;
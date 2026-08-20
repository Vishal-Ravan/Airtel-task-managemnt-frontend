import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Edit,
  Loader2,
  UserRound,
  Mail,
  Phone,
  Shield,
  MapPin,
  Globe,
  Hash,
  CheckCircle2,
  XCircle,
  Briefcase,
} from "lucide-react";

import { getUserById } from "../../services/users.api";

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH USER
  // =====================================================

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

      const data =
        response?.data?.user ||
        response?.data?.data ||
        response?.data;

      if (!data) {
        setError("User not found.");
        return;
      }

      setUser(data);
    } catch (err) {
      console.error(
        "User details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load user details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ROLE LABEL
  // =====================================================

  const roleLabel = (role) => {
    if (!role) return "-";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // =====================================================
  // ROLE COLOR
  // =====================================================

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "vendor":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "vendor_executive":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "state_head":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "client":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const isActive =
    user?.is_active === true ||
    user?.isActive === true ||
    user?.status === "active";

  // =====================================================
  // CAMPAIGN ACCESS
  // =====================================================

  const campaignAccess =
    Array.isArray(user?.campaign_access)
      ? user.campaign_access
      : [];

  // =====================================================
  // TOTAL STATES
  // =====================================================

  const totalStates = campaignAccess.reduce(
    (total, campaign) =>
      total +
      (Array.isArray(
        campaign?.locations
      )
        ? campaign.locations.length
        : 0),
    0
  );

  // =====================================================
  // TOTAL ZONES
  // =====================================================

  const totalZones = campaignAccess.reduce(
    (total, campaign) => {
      if (
        !Array.isArray(
          campaign?.locations
        )
      ) {
        return total;
      }

      return (
        total +
        campaign.locations.reduce(
          (locationTotal, location) =>
            locationTotal +
            (Array.isArray(
              location?.zones
            )
              ? location.zones.length
              : 0),
          0
        )
      );
    },
    0
  );

  // =====================================================
  // TOTAL SITE CODES
  // =====================================================

  const totalSiteCodes =
    campaignAccess.reduce(
      (total, campaign) =>
        total +
        (Array.isArray(
          campaign?.site_codes
        )
          ? campaign.site_codes.length
          : 0),
      0
    );

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !user) {
    return (
      <div className="max-w-5xl mx-auto">

        <button
          type="button"
          onClick={() =>
            navigate("/users")
          }
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mb-6"
        >
          <ArrowLeft size={18} />

          Back to Users
        </button>

        <div className="bg-white border rounded-xl p-10 text-center">

          <XCircle
            size={42}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-semibold">
            Unable to load user
          </h2>

          <p className="text-gray-500 mt-2">
            {error || "User not found."}
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="max-w-6xl mx-auto pb-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/users")
            }
            className="p-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
            title="Back"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              User Details
            </h1>

            <p className="text-gray-500 mt-1">
              View user information and campaign access.
            </p>
          </div>

        </div>

        <Link
          to={`/users/${id}/edit`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Edit size={17} />

          Edit User
        </Link>

      </div>

      {/* =================================================
          USER PROFILE
      ================================================= */}

      <div className="bg-white border rounded-xl p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shrink-0">

              <UserRound
                size={30}
                className="text-gray-500"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                {user?.name || "-"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {user?.email || "-"}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">

                <span
                  className={`inline-flex px-3 py-1 rounded-full border text-xs font-medium ${getRoleClass(
                    user?.role
                  )}`}
                >
                  {roleLabel(
                    user?.role
                  )}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle2
                      size={13}
                    />
                  ) : (
                    <XCircle
                      size={13}
                    />
                  )}

                  {isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <div className="bg-white border rounded-xl p-6 mb-6">

        <div className="flex items-center gap-2 mb-5">

          <UserRound
            size={19}
            className="text-gray-600"
          />

          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* NAME */}

          <div className="p-4 bg-gray-50 rounded-lg">

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <UserRound size={14} />

              Name
            </div>

            <p className="font-medium text-gray-900">
              {user?.name || "-"}
            </p>

          </div>

          {/* EMAIL */}

          <div className="p-4 bg-gray-50 rounded-lg">

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Mail size={14} />

              Email
            </div>

            <p className="font-medium text-gray-900 break-all">
              {user?.email || "-"}
            </p>

          </div>

          {/* PHONE */}

          <div className="p-4 bg-gray-50 rounded-lg">

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Phone size={14} />

              Phone
            </div>

            <p className="font-medium text-gray-900">
              {user?.phone || "-"}
            </p>

          </div>

          {/* ROLE */}

          <div className="p-4 bg-gray-50 rounded-lg">

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Shield size={14} />

              Role
            </div>

            <p className="font-medium text-gray-900">
              {roleLabel(
                user?.role
              )}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          ACCESS SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* CAMPAIGNS */}

        <div className="bg-white border rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Campaigns
              </p>

              <p className="text-2xl font-bold mt-1">
                {campaignAccess.length}
              </p>

            </div>

            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">

              <Briefcase
                size={20}
                className="text-indigo-600"
              />

            </div>

          </div>

        </div>

        {/* STATES */}

        <div className="bg-white border rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                States
              </p>

              <p className="text-2xl font-bold mt-1">
                {totalStates}
              </p>

            </div>

            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">

              <MapPin
                size={20}
                className="text-orange-600"
              />

            </div>

          </div>

        </div>

        {/* ZONES */}

        <div className="bg-white border rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Zones
              </p>

              <p className="text-2xl font-bold mt-1">
                {totalZones}
              </p>

            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">

              <Globe
                size={20}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* SITE CODES */}

        <div className="bg-white border rounded-xl p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Site Codes
              </p>

              <p className="text-2xl font-bold mt-1">
                {totalSiteCodes}
              </p>

            </div>

            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">

              <Hash
                size={20}
                className="text-green-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          CAMPAIGN ACCESS
      ================================================= */}

      <div className="bg-white border rounded-xl p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Campaign Access
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Campaign-wise states, zones and site codes assigned to this user.
            </p>

          </div>

          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
            {campaignAccess.length}{" "}
            {campaignAccess.length ===
            1
              ? "Campaign"
              : "Campaigns"}
          </span>

        </div>

        {/* NO CAMPAIGN */}

        {campaignAccess.length ===
        0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">

            <Briefcase
              size={35}
              className="mx-auto text-gray-300 mb-3"
            />

            <p className="font-medium text-gray-700">
              No campaign access assigned.
            </p>

            <p className="text-sm text-gray-500 mt-1">
              This user does not have any campaign access.
            </p>

          </div>
        ) : (

          <div className="space-y-5">

            {campaignAccess.map(
              (
                campaign,
                campaignIndex
              ) => (

                <div
                  key={
                    campaign?._id ||
                    campaign?.campaign ||
                    campaignIndex
                  }
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >

                  {/* =================================================
                      CAMPAIGN HEADER
                  ================================================= */}

                  <div className="bg-gray-50 border-b px-5 py-4">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">

                            <Briefcase
                              size={17}
                              className="text-indigo-600"
                            />

                          </div>

                          <div>

                            <h3 className="font-semibold text-gray-900">
                              {campaign?.campaign_name ||
                                "Unnamed Campaign"}
                            </h3>

                            <p className="text-xs text-gray-500 mt-0.5">
                              Campaign ID:{" "}
                              {campaign?.campaign ||
                                "-"}
                            </p>

                          </div>

                        </div>

                      </div>

                      <div className="flex items-center gap-2 text-xs">

                        <span className="px-2.5 py-1 rounded-md bg-white border text-gray-600">
                          {Array.isArray(
                            campaign?.locations
                          )
                            ? campaign
                                .locations
                                .length
                            : 0}{" "}
                          States
                        </span>

                        <span className="px-2.5 py-1 rounded-md bg-white border text-gray-600">
                          {Array.isArray(
                            campaign?.site_codes
                          )
                            ? campaign
                                .site_codes
                                .length
                            : 0}{" "}
                          Sites
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      CAMPAIGN BODY
                  ================================================= */}

                  <div className="p-5">

                    {/* LOCATIONS */}

                    <div>

                      <div className="flex items-center gap-2 mb-3">

                        <MapPin
                          size={17}
                          className="text-gray-600"
                        />

                        <h4 className="font-semibold text-gray-800">
                          States & Zones
                        </h4>

                      </div>

                      {!Array.isArray(
                        campaign?.locations
                      ) ||
                      campaign.locations
                        .length ===
                        0 ? (

                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                          No specific location assigned.
                        </div>

                      ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                          {campaign.locations.map(
                            (
                              location,
                              locationIndex
                            ) => (

                              <div
                                key={
                                  locationIndex
                                }
                                className="border border-gray-200 rounded-lg p-4"
                              >

                                {/* STATE */}

                                <div className="flex items-center gap-2 mb-3">

                                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">

                                    <MapPin
                                      size={
                                        15
                                      }
                                      className="text-orange-600"
                                    />

                                  </div>

                                  <div>

                                    <p className="text-xs text-gray-500">
                                      State
                                    </p>

                                    <p className="font-semibold text-gray-900">
                                      {location?.state ||
                                        "-"}
                                    </p>

                                  </div>

                                </div>

                                {/* ZONES */}

                                <div>

                                  <p className="text-xs text-gray-500 mb-2">
                                    Zones
                                  </p>

                                  {Array.isArray(
                                    location?.zones
                                  ) &&
                                  location
                                    .zones
                                    .length >
                                    0 ? (

                                    <div className="flex flex-wrap gap-2">

                                      {location.zones.map(
                                        (
                                          zone,
                                          zoneIndex
                                        ) => (

                                          <span
                                            key={
                                              zoneIndex
                                            }
                                            className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                                          >
                                            {zone}
                                          </span>

                                        )
                                      )}

                                    </div>

                                  ) : (

                                    <span className="text-sm text-gray-400">
                                      All zones
                                    </span>

                                  )}

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>

                    {/* SITE CODES */}

                    <div className="mt-6 pt-5 border-t">

                      <div className="flex items-center gap-2 mb-3">

                        <Hash
                          size={17}
                          className="text-gray-600"
                        />

                        <h4 className="font-semibold text-gray-800">
                          Site Codes
                        </h4>

                      </div>

                      {Array.isArray(
                        campaign?.site_codes
                      ) &&
                      campaign.site_codes
                        .length > 0 ? (

                        <div className="flex flex-wrap gap-2">

                          {campaign.site_codes.map(
                            (
                              code,
                              codeIndex
                            ) => (

                              <span
                                key={
                                  codeIndex
                                }
                                className="inline-flex items-center px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                              >
                                {code}
                              </span>

                            )
                          )}

                        </div>

                      ) : (

                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                          No specific site codes assigned.
                          User can access sites according to the assigned campaign locations.
                        </div>

                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default UserDetails;
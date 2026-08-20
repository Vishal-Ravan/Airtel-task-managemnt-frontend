import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Calendar,
  Ruler,
  User,
  Building2,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  History,
} from "lucide-react";

import { getSiteById } from "../../services/sites.api";

const SiteDetailsPage = () => {
  const { id } = useParams();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH SITE
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchSite();
    }
  }, [id]);

  const fetchSite = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSiteById(id);

      console.log("SITE DETAILS RESPONSE:", response);

      const data =
        response?.data?.site ||
        response?.data?.data ||
        response?.data;

      console.log("SITE DETAILS DATA:", data);

      setSite(data);
    } catch (err) {
      console.error("Site details error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load site details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACKEND URL
  // =====================================================

  const getBackendUrl = () => {
    let apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000";

    apiUrl = apiUrl.replace(/\/+$/, "");

    // Example:
    // http://localhost:5000/api
    // becomes
    // http://localhost:5000

    apiUrl = apiUrl.replace(/\/api$/, "");

    return apiUrl;
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

 const getImageUrl = (image) => {
  if (!image) return "";

  let imagePath = "";

  // String
  if (typeof image === "string") {
    imagePath = image;
  }

  // Object
  else if (typeof image === "object") {
    imagePath =
      image.url ||
      image.path ||
      image.filePath ||
      image.image ||
      image.src ||
      "";
  }

  if (!imagePath) return "";

  imagePath = String(imagePath).trim();

  if (!imagePath) return "";

  // Already full URL
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  // Windows absolute path:
  // E:/site-management-system/backend/uploads/abc.jpg
  if (/^[A-Za-z]:[\\/]/.test(imagePath)) {
    const uploadsIndex = imagePath
      .toLowerCase()
      .indexOf("uploads");

    if (uploadsIndex !== -1) {
      imagePath =
        imagePath.substring(uploadsIndex);
    }
  }

  // Convert Windows slash to URL slash
  imagePath = imagePath.replace(/\\/g, "/");

  // Remove leading slash
  imagePath = imagePath.replace(/^\/+/, "");

  return `${getBackendUrl()}/${imagePath}`;
};

  // =====================================================
  // DATE
  // =====================================================

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

  // =====================================================
  // DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "-";
    }

    return value.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const statusIcon = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("approved") ||
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
      value.includes("rejected") ||
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

  // =====================================================
  // ACTION LABEL
  // =====================================================

  const getActionLabel = (action) => {
    const labels = {
      site_created: "Site Created",
      submission_uploaded: "Submission Uploaded",
      vendor_approved: "Vendor Approved",
      vendor_rejected: "Vendor Rejected",
      state_head_approved: "State Head Approved",
      state_head_rejected: "State Head Rejected",
    };

    if (labels[action]) {
      return labels[action];
    }

    return (
      String(action || "")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ) || "Unknown Action"
    );
  };

  // =====================================================
  // ACTION STYLE
  // =====================================================

  const getActionStyle = (action) => {
    switch (action) {
      case "site_created":
        return "bg-blue-50 border-blue-200 text-blue-700";

      case "submission_uploaded":
        return "bg-purple-50 border-purple-200 text-purple-700";

      case "vendor_approved":
      case "state_head_approved":
        return "bg-green-50 border-green-200 text-green-700";

      case "vendor_rejected":
      case "state_head_rejected":
        return "bg-red-50 border-red-200 text-red-700";

      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  // =====================================================
  // GET HISTORY
  // =====================================================

  const history = Array.isArray(site?.history)
    ? [...site.history].sort((a, b) => {
        const dateA = new Date(
          a?.createdAt ||
            a?.created_at ||
            a?.updatedAt ||
            0
        ).getTime();

        const dateB = new Date(
          b?.createdAt ||
            b?.created_at ||
            b?.updatedAt ||
            0
        ).getTime();

        return dateB - dateA;
      })
    : [];

  // =====================================================
  // GET SUBMISSION SNAPSHOT
  // =====================================================

  const getSubmissionSnapshot = (item) => {
    if (!item) return null;

    return (
      item.submission_snapshot ||
      item.submissionSnapshot ||
      item.submission ||
      item.snapshot ||
      null
    );
  };

  // =====================================================
  // GET HISTORY IMAGES
  // =====================================================

  const getHistoryImages = (item) => {
    const submission =
      getSubmissionSnapshot(item);

    if (!submission) {
      return [];
    }

    if (
      Array.isArray(submission.site_images)
    ) {
      return submission.site_images;
    }

    if (
      Array.isArray(submission.images)
    ) {
      return submission.images;
    }

    return [];
  };

  // =====================================================
  // GET CURRENT IMAGES
  // =====================================================

  const getCurrentImages = () => {
    // Current populated submission
    if (
      site?.current_submission &&
      typeof site.current_submission === "object"
    ) {
      const current =
        site.current_submission;

      if (
        Array.isArray(current.site_images) &&
        current.site_images.length > 0
      ) {
        return current.site_images;
      }

      if (
        Array.isArray(current.images) &&
        current.images.length > 0
      ) {
        return current.images;
      }
    }

    // Fallback latest history
    for (const item of history) {
      const images = getHistoryImages(item);

      if (images.length > 0) {
        return images;
      }
    }

    return [];
  };

  // =====================================================
  // CURRENT IMAGES
  // =====================================================

  const currentImages = getCurrentImages();

  // =====================================================
  // CURRENT SUBMISSION
  // =====================================================

  const currentSubmission =
    site?.current_submission &&
    typeof site.current_submission === "object"
      ? site.current_submission
      : null;

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
          Loading site...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">

        <Link
          to="/sites"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-5"
        >
          <ArrowLeft size={17} />
          Back to Sites
        </Link>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
          {error}
        </div>

      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!site) {
    return (
      <div className="max-w-5xl mx-auto">

        <Link
          to="/sites"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-5"
        >
          <ArrowLeft size={17} />
          Back to Sites
        </Link>

        <div className="bg-white border rounded-xl p-10 text-center">
          Site not found.
        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-6xl mx-auto pb-10">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <Link
            to="/sites"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-3"
          >
            <ArrowLeft size={16} />
            Back to Sites
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {site.site_code || "Site Details"}
          </h1>

          <p className="text-gray-500 mt-1">
            Complete information about this site.
          </p>

        </div>

        {site.status && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium capitalize">

            {statusIcon(site.status)}

            {String(site.status).replaceAll(
              "_",
              " "
            )}

          </span>
        )}

      </div>

      {/* ================================================= */}
      {/* SITE INFORMATION */}
      {/* ================================================= */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">
            Site Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Info
            icon={<Building2 size={18} />}
            label="Site Code"
            value={site.site_code}
          />

          <Info
            icon={<MapPin size={18} />}
            label="State"
            value={site.state}
          />

          <Info
            icon={<MapPin size={18} />}
            label="Zone"
            value={site.zone}
          />

          <Info
            icon={<MapPin size={18} />}
            label="Location"
            value={site.location}
          />

          <Info
            label="Media Type"
            value={site.media_type}
          />

          <Info
            label="Type"
            value={site.type}
          />

          <Info
            label="Unit"
            value={site.unit}
          />

          <Info
            icon={<Ruler size={18} />}
            label="Width"
            value={site.width}
          />

          <Info
            icon={<Ruler size={18} />}
            label="Height"
            value={site.height}
          />

          <Info
            label="Total Sq. Ft."
            value={site.total_sqr_ft}
          />

          <Info
            label="Latitude"
            value={site.lat}
          />

          <Info
            label="Longitude"
            value={site.long}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* DURATION */}
      {/* ================================================= */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">
            Duration & Availability
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <Info
            icon={<Calendar size={18} />}
            label="Duration"
            value={site.duration}
          />

          <Info
            icon={<Calendar size={18} />}
            label="Start Date"
            value={formatDate(site.start_date)}
          />

          <Info
            icon={<Calendar size={18} />}
            label="End Date"
            value={formatDate(site.end_date)}
          />

          <Info
            label="Availability"
            value={site.availability}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* VENDOR */}
      {/* ================================================= */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">
            Vendor Information
          </h2>
        </div>

        <div className="p-6">

          {typeof site.vendor === "object" &&
          site.vendor !== null ? (

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={19} />
              </div>

              <div>

                <p className="font-medium">
                  {site.vendor.name ||
                    site.vendor.vendor_name ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500">
                  {site.vendor.email || ""}
                </p>

              </div>

            </div>

          ) : (

            <p className="text-gray-700">
              {site.vendor || site.vendor_name || "-"}
            </p>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* CURRENT SUBMISSION */}
      {/* ================================================= */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <ImageIcon size={19} />

              <div>

                <h2 className="text-lg font-semibold">
                  Current Submission Images
                </h2>

                {currentSubmission && (
                  <p className="text-sm text-gray-500 mt-1">
                    Updated{" "}
                    {formatDateTime(
                      currentSubmission.createdAt ||
                        currentSubmission.updatedAt
                    )}
                  </p>
                )}

              </div>

            </div>

            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {currentImages.length} Images
            </span>

          </div>

        </div>

        <div className="p-6">

          {currentImages.length > 0 ? (

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {currentImages.map(
                (image, index) => {

                  const imageUrl =
                    getImageUrl(image);

                  if (!imageUrl) {
                    return null;
                  }

                  return (
                    <div
                      key={index}
                      className="group"
                    >

                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-square overflow-hidden rounded-xl border bg-gray-100"
                      >

                        <img
                          src={imageUrl}
                          alt={`Current site image ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            console.error(
                              "IMAGE LOAD FAILED:",
                              imageUrl
                            );

                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      </a>

                      <p className="text-xs text-gray-500 mt-2">
                        Image {index + 1}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            <div className="py-10 text-center">

              <ImageIcon
                size={35}
                className="mx-auto text-gray-300 mb-3"
              />

              <p className="text-gray-500">
                No current submission images available.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* IMAGE UPDATE HISTORY */}
      {/* ================================================= */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div className="flex items-center gap-2">

              <History size={20} />

              <div>

                <h2 className="text-lg font-semibold">
                  Image Update History
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  All previous image uploads
                </p>

              </div>

            </div>

            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">

              {
                history.filter(
                  (item) =>
                    getHistoryImages(item).length > 0
                ).length
              }{" "}
              Updates

            </span>

          </div>

        </div>

        <div className="p-6">

          {history.filter(
            (item) =>
              getHistoryImages(item).length > 0
          ).length === 0 ? (

            <div className="py-10 text-center">

              <ImageIcon
                size={35}
                className="mx-auto text-gray-300 mb-3"
              />

              <p className="text-gray-500">
                No image update history available.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {history
                .filter(
                  (item) =>
                    getHistoryImages(item).length > 0
                )
                .map((item, index) => {

                  const submission =
                    getSubmissionSnapshot(item);

                  const images =
                    getHistoryImages(item);

                  const uploadedBy =
                    submission?.uploaded_by;

                  const uploaderName =
                    item.action_by_name ||
                    uploadedBy?.name ||
                    submission?.person_name ||
                    "Unknown";

                  const uploaderRole =
                    item.action_by_role ||
                    uploadedBy?.role ||
                    submission?.uploader_role ||
                    "-";

                  const updateDate =
                    submission?.uploaded_at ||
                    submission?.createdAt ||
                    submission?.created_at ||
                    item.createdAt ||
                    item.created_at ||
                    item.updatedAt;

                  return (

                    <div
                      key={
                        item._id ||
                        `history-${index}`
                      }
                      className="border rounded-xl overflow-hidden"
                    >

                      {/* HISTORY HEADER */}

                      <div className="p-5 bg-gray-50 border-b">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                          <div>

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">

                                <Upload
                                  size={18}
                                  className="text-gray-600"
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-gray-900">
                                  Image Update #{index + 1}
                                </p>

                                <span
                                  className={`inline-flex px-2 py-1 mt-1 text-xs rounded-full border capitalize ${getActionStyle(
                                    item.action
                                  )}`}
                                >
                                  {getActionLabel(
                                    item.action
                                  )}
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* UPDATE DATE */}

                          <div className="lg:text-right">

                            <p className="text-xs text-gray-500">
                              Updated On
                            </p>

                            <p className="font-semibold text-gray-900">
                              {formatDateTime(
                                updateDate
                              )}
                            </p>

                          </div>

                        </div>

                        {/* UPLOADER */}

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">

                          <div className="flex items-center gap-2">

                            <User
                              size={15}
                              className="text-gray-500"
                            />

                            <span className="text-gray-500">
                              Uploaded By:
                            </span>

                            <span className="font-medium">
                              {uploaderName}
                            </span>

                          </div>

                          <div>

                            <span className="text-gray-500">
                              Role:
                            </span>{" "}

                            <span className="font-medium capitalize">
                              {String(
                                uploaderRole
                              ).replaceAll(
                                "_",
                                " "
                              )}
                            </span>

                          </div>

                          <div>

                            <span className="text-gray-500">
                              Total Images:
                            </span>{" "}

                            <span className="font-semibold">
                              {images.length}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* SELFIE */}

                      {submission?.selfie && (

                        <div className="p-5 border-b">

                          <div className="flex items-center gap-2 mb-3">

                            <User size={17} />

                            <h3 className="font-semibold">
                              Selfie
                            </h3>

                          </div>

                          {getImageUrl(
                            submission.selfie
                          ) && (

                            <a
                              href={getImageUrl(
                                submission.selfie
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block"
                            >

                              <img
                                src={getImageUrl(
                                  submission.selfie
                                )}
                                alt="Uploaded selfie"
                                className="w-28 h-28 object-cover rounded-xl border hover:scale-105 transition"
                              />

                            </a>

                          )}

                        </div>

                      )}

                      {/* ALL HISTORY IMAGES */}

                      <div className="p-5">

                        <div className="flex items-center justify-between mb-4">

                          <div className="flex items-center gap-2">

                            <ImageIcon size={18} />

                            <h3 className="font-semibold">
                              Site Images
                            </h3>

                          </div>

                          <span className="text-sm text-gray-500">
                            {images.length} Images
                          </span>

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                          {images.map(
                            (image, imageIndex) => {

                              const imageUrl =
                                getImageUrl(
                                  image
                                );

                              if (!imageUrl) {
                                return null;
                              }

                              return (

                                <div
                                  key={
                                    imageIndex
                                  }
                                  className="group"
                                >

                                  <a
                                    href={
                                      imageUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block aspect-square rounded-xl overflow-hidden border bg-gray-100"
                                  >

                                    <img
                                      src={
                                        imageUrl
                                      }
                                      alt={`History image ${
                                        imageIndex + 1
                                      }`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                      onError={(
                                        e
                                      ) => {
                                        console.error(
                                          "HISTORY IMAGE LOAD FAILED:",
                                          imageUrl
                                        );

                                        
                                      }}
                                    />

                                  </a>

                                  <p className="text-xs text-gray-500 mt-2">
                                    Image{" "}
                                    {imageIndex + 1}
                                  </p>

                                </div>

                              );
                            }
                          )}

                        </div>

                      </div>

                      {/* REMARKS */}

                      {item.remarks && (

                        <div className="px-5 pb-5">

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

                            <p className="text-xs font-semibold text-yellow-700 mb-1">
                              Remarks
                            </p>

                            <p className="text-sm text-gray-700">
                              {item.remarks}
                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                  );
                })}

            </div>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* COMPLETE ACTIVITY HISTORY */}
      {/* ================================================= */}

      {/* <div className="bg-white border rounded-xl">

        <div className="px-6 py-5 border-b">

          <div className="flex items-center gap-2">

            <Clock size={19} />

            <div>

              <h2 className="text-lg font-semibold">
                Activity History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Complete site approval and submission history
              </p>

            </div>

          </div>

        </div>

        <div className="p-6">

          {history.length === 0 ? (

            <p className="text-center text-gray-500 py-8">
              No activity history available.
            </p>

          ) : (

            <div className="space-y-4">

              {history.map((item, index) => (

                <div
                  key={
                    item._id ||
                    `activity-${index}`
                  }
                  className="border rounded-xl p-4"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <div className="flex items-center gap-3">

                      {statusIcon(
                        item.new_status ||
                          item.newStatus ||
                          item.status
                      )}

                      <div>

                        <p className="font-semibold capitalize">
                          {getActionLabel(
                            item.action
                          )}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.action_by_name ||
                            item.actionByName ||
                            "Unknown User"}
                        </p>

                      </div>

                    </div>

                    <p className="text-sm text-gray-500">
                      {formatDateTime(
                        item.createdAt ||
                          item.created_at ||
                          item.updatedAt
                      )}
                    </p>

                  </div>

                  {item.remarks && (

                    <div className="mt-3 bg-gray-50 rounded-lg p-3">

                      <p className="text-xs text-gray-500 mb-1">
                        Remarks
                      </p>

                      <p className="text-sm">
                        {item.remarks}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div> */}

    </div>
  );
};

// =====================================================
// INFO COMPONENT
// =====================================================

const Info = ({
  icon,
  label,
  value,
}) => {
  return (
    <div>

      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">

        {icon}

        <span>
          {label}
        </span>

      </div>

      <p className="font-medium text-gray-900 capitalize">

        {value !== undefined &&
        value !== null &&
        value !== ""
          ? String(value)
          : "-"}

      </p>

    </div>
  );
};

export default SiteDetailsPage;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
  MapPin,
  User,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

import {
  getSubmissionById,
} from "../../services/submissions.api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL =
  API_BASE_URL.replace(/\/api\/?$/, "");

// ========================================
// IMAGE URL
// ========================================

const getImageUrl = (image) => {

  if (!image) {
    return null;
  }

  let value = "";

  if (typeof image === "string") {
    value = image;
  } else {
    value =
      image?.url ||
      image?.path ||
      "";
  }

  if (!value) {
    return null;
  }

  // Already full URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  // Windows path
  if (
    value.includes("\\") ||
    /^[A-Za-z]:\//.test(value)
  ) {

    const filename =
      value
        .split(/[\\/]/)
        .pop();

    return `${SERVER_URL}/uploads/${filename}`;
  }

  // /uploads/filename.jpg
  if (
    value.startsWith("/uploads/")
  ) {

    return `${SERVER_URL}${value}`;
  }

  // uploads/filename.jpg
  if (
    value.startsWith("uploads/")
  ) {

    return `${SERVER_URL}/${value}`;
  }

  // filename only
  return `${SERVER_URL}/uploads/${value}`;
};


// ========================================
// COMPONENT
// ========================================

const SubmissionDetailsPage = () => {

  const { id } = useParams();

  const [
    submission,
    setSubmission,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ========================================
  // FETCH
  // ========================================

  useEffect(() => {

    if (id) {
      fetchSubmission();
    }

  }, [id]);


  const fetchSubmission = async () => {

    try {

      setLoading(true);
      setError("");

      console.log(
        "FETCH SUBMISSION ID:",
        id
      );

      const response =
        await getSubmissionById(id);

      console.log(
        "SUBMISSION DETAIL RESPONSE:",
        response?.data
      );

      const data =
        response?.data?.submission ||
        response?.data?.data ||
        response?.data;

      setSubmission(data);

    } catch (err) {

      console.error(
        "SUBMISSION DETAILS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load submission."
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // DATE
  // ========================================

  const formatDateTime = (date) => {

    if (!date) {
      return "-";
    }

    const value =
      new Date(date);

    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return "-";
    }

    return value.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ========================================
  // STATUS LABEL
  // ========================================

  const getStatusLabel = (
    status
  ) => {

    switch (
      status?.toLowerCase()
    ) {

      case "pending_vendor_approval":
        return "Pending Vendor Approval";

      case "vendor_approved":
        return "Vendor Approved";

      case "pending_state_head_approval":
        return "Pending State Head Approval";

      case "state_head_approved":
        return "State Head Approved";

      case "pending_client_approval":
        return "Pending Client Approval";

      case "client_approved":
        return "Client Approved";

      case "approved":
        return "Approved";

      case "rejected":
      case "reject":
        return "Rejected";

      case "approve":
        return "Approved";

      default:
        return status || "Pending";
    }
  };


  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (
    status
  ) => {

    switch (
      status?.toLowerCase()
    ) {

      case "approved":
      case "approve":
      case "client_approved":
        return (
          "bg-green-50 text-green-700 border-green-200"
        );

      case "rejected":
      case "reject":
        return (
          "bg-red-50 text-red-700 border-red-200"
        );

      case "vendor_approved":
      case "state_head_approved":
        return (
          "bg-blue-50 text-blue-700 border-blue-200"
        );

      default:
        return (
          "bg-yellow-50 text-yellow-700 border-yellow-200"
        );
    }
  };


  // ========================================
  // STATUS ICON
  // ========================================

  const getStatusIcon = (
    status
  ) => {

    switch (
      status?.toLowerCase()
    ) {

      case "approved":
      case "approve":
      case "client_approved":
        return (
          <CheckCircle size={17} />
        );

      case "rejected":
      case "reject":
        return (
          <XCircle size={17} />
        );

      default:
        return (
          <Clock size={17} />
        );
    }
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

          Loading submission...

        </div>

      </div>

    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <div className="max-w-6xl mx-auto">

        <Link
          to="/submissions"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-5"
        >

          <ArrowLeft size={17} />

          Back to Submissions

        </Link>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-600">

          {error}

        </div>

      </div>
    );
  }


  // ========================================
  // NOT FOUND
  // ========================================

  if (!submission) {

    return (

      <div className="max-w-6xl mx-auto">

        <Link
          to="/submissions"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-5"
        >

          <ArrowLeft size={17} />

          Back to Submissions

        </Link>

        <div className="bg-white border rounded-xl p-10 text-center">

          Submission not found.

        </div>

      </div>
    );
  }


  // ========================================
  // DATA
  // ========================================

  const site =
    submission.site || {};

  const status =
    submission.status ||
    "pending";

  const siteCode =
    site.site_code ||
    submission.site_code ||
    "N/A";

  const personName =
    submission.person_name ||
    submission.uploaded_by?.name ||
    "Unknown";

  const images =
    submission.site_images ||
    submission.images ||
    [];

  const selfie =
    submission.selfie ||
    submission.selfie_image;

  const selfieUrl =
    getImageUrl(selfie);


  // ========================================
  // RETURN
  // ========================================

  return (

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="mb-6">

        <Link
          to="/submissions"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-3"
        >

          <ArrowLeft size={16} />

          Back to Submissions

        </Link>


        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Submission Details
            </h1>

            <p className="text-gray-500 mt-1">

              Site Code:

              <span className="font-semibold text-gray-700 ml-1">
                {siteCode}
              </span>

            </p>

          </div>


          {/* STATUS */}

          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${getStatusClass(
              status
            )}`}
          >

            {getStatusIcon(status)}

            {getStatusLabel(status)}

          </span>

        </div>

      </div>


      {/* SITE INFORMATION */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">

          <h2 className="text-lg font-semibold">
            Site Information
          </h2>

        </div>


        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Info
            label="Site Code"
            value={siteCode}
          />

          <Info
            label="Site Name"
            value={site.site_name}
          />

          <Info
            label="State"
            value={site.state}
          />

          <Info
            label="Town"
            value={site.town}
          />

          <Info
            label="Zone"
            value={site.zone}
          />

          <Info
            icon={<MapPin size={17} />}
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
            label="Width"
            value={site.width}
          />

          <Info
            label="Height"
            value={site.height}
          />

          <Info
            label="Total Sq. Ft."
            value={site.total_sqr_ft}
          />

          <Info
            label="Availability"
            value={site.availability}
          />

        </div>

      </div>


      {/* SUBMISSION INFORMATION */}

      <div className="bg-white border rounded-xl mb-5">

        <div className="px-6 py-5 border-b">

          <h2 className="text-lg font-semibold">
            Submission Information
          </h2>

        </div>


        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Info
            icon={<User size={17} />}
            label="Submitted By"
            value={personName}
          />

          <Info
            label="Role"
            value={
              submission.uploaded_by?.role
            }
          />

          <Info
            label="Submitted At"
            value={formatDateTime(
              submission.createdAt
            )}
          />

          <Info
            label="Updated At"
            value={formatDateTime(
              submission.updatedAt
            )}
          />

          <Info
            label="Current Status"
            value={getStatusLabel(
              status
            )}
          />

        </div>

      </div>


      {/* REMARKS */}

      {(submission.remarks ||
        submission.vendor_remarks ||
        submission.state_head_remarks ||
        submission.client_remarks) && (

        <div className="bg-white border rounded-xl mb-5">

          <div className="px-6 py-5 border-b">

            <h2 className="text-lg font-semibold">
              Remarks
            </h2>

          </div>

          <div className="p-6 space-y-4">

            {submission.remarks && (

              <Remark
                label="Remarks"
                value={submission.remarks}
              />

            )}

            {submission.vendor_remarks && (

              <Remark
                label="Vendor Remarks"
                value={
                  submission.vendor_remarks
                }
              />

            )}

            {submission.state_head_remarks && (

              <Remark
                label="State Head Remarks"
                value={
                  submission.state_head_remarks
                }
              />

            )}

            {submission.client_remarks && (

              <Remark
                label="Client Remarks"
                value={
                  submission.client_remarks
                }
              />

            )}

          </div>

        </div>
      )}


      {/* SELFIE */}

      {selfieUrl && (

        <div className="bg-white border rounded-xl mb-5">

          <div className="px-6 py-5 border-b">

            <h2 className="text-lg font-semibold">
              Executive Selfie
            </h2>

          </div>

          <div className="p-6">

            <a
              href={selfieUrl}
              target="_blank"
              rel="noreferrer"
            >

              <img
                src={selfieUrl}
                alt="Executive selfie"
                className="w-48 h-48 object-cover rounded-xl border hover:opacity-90"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </a>

          </div>

        </div>
      )}


      {/* SITE PHOTOS */}

      <div className="bg-white border rounded-xl">

        <div className="px-6 py-5 border-b flex items-center gap-2">

          <ImageIcon size={19} />

          <h2 className="text-lg font-semibold">
            Submitted Site Photos
          </h2>

          <span className="text-sm text-gray-500">
            ({images.length})
          </span>

        </div>


        <div className="p-6">

          {images.length > 0 ? (

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {images.map(
                (image, index) => {

                  const url =
                    getImageUrl(image);

                  if (!url) {
                    return null;
                  }

                  return (

                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-square rounded-xl overflow-hidden border bg-gray-100"
                    >

                      <img
                        src={url}
                        alt={`Site photo ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.style.opacity =
                            "0.3";
                        }}
                      />

                    </a>

                  );
                }
              )}

            </div>

          ) : (

            <div className="py-10 text-center text-gray-500">

              No site photos available.

            </div>

          )}

        </div>

      </div>

    </div>
  );
};


// ========================================
// INFO COMPONENT
// ========================================

const Info = ({
  icon,
  label,
  value,
}) => {

  return (

    <div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">

        {icon}

        <span>
          {label}
        </span>

      </div>

      <p className="font-medium text-gray-900">

        {value !== undefined &&
        value !== null &&
        value !== ""
          ? String(value)
          : "-"}

      </p>

    </div>
  );
};


// ========================================
// REMARK COMPONENT
// ========================================

const Remark = ({
  label,
  value,
}) => {

  return (

    <div className="bg-gray-50 rounded-lg p-4">

      <p className="text-xs font-medium text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm text-gray-800">
        {value}
      </p>

    </div>
  );
};


export default SubmissionDetailsPage;
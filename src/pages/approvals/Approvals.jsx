import { useEffect, useState } from "react";

import {
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  MapPin,
  User,
  Image as ImageIcon,
  Building2,
  Maximize,
  CalendarDays,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  getVendorPendingApprovals,
  vendorApprove,
  vendorReject,
  getStateHeadPendingApprovals,
  stateHeadApprove,
  stateHeadReject,
} from "../../services/approvals.api";

import StatusBadge from "../../components/common/StatusBadge";


const Approvals = () => {

  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState(null);

  const [rejectId, setRejectId] = useState(null);

  const [remarks, setRemarks] = useState("");


  // =====================================================
  // GET LOGGED IN USER
  // =====================================================

  const getCurrentUser = () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      return user;

    } catch (error) {

      console.error(
        "USER PARSE ERROR:",
        error
      );

      return null;
    }
  };


  const currentUser =
    getCurrentUser();

  const role =
    currentUser?.role;

  const isStateHead =
    role === "state_head";

  const isVendor =
    role === "vendor";


  // =====================================================
  // IMAGE URL
  // =====================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const SERVER_URL =
    API_BASE_URL.replace(
      /\/api\/?$/,
      ""
    );


  const getImageUrl = (image) => {

    if (!image) {
      return null;
    }

    let value = "";


    // ===================================================
    // STRING
    // ===================================================

    if (typeof image === "string") {

      value = image;

    }


    // ===================================================
    // OBJECT
    // ===================================================

    else if (
      typeof image === "object"
    ) {

      value =
        image.url ||
        image.secure_url ||
        image.path ||
        image.location ||
        image.src ||
        image.filename ||
        image.file ||
        "";

    }


    if (!value) {
      return null;
    }


    value =
      String(value).trim();


    // ===================================================
    // FULL URL
    // ===================================================

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {

      return value;

    }


    // ===================================================
    // WINDOWS PATH
    // ===================================================

    if (
      /^[A-Za-z]:[\\/]/.test(value) ||
      value.includes("\\")
    ) {

      const filename =
        value.split(/[\\/]/).pop();

      return `${SERVER_URL}/uploads/${filename}`;

    }


    // ===================================================
    // /uploads/file.jpg
    // ===================================================

    if (
      value.startsWith("/uploads/")
    ) {

      return `${SERVER_URL}${value}`;

    }


    // ===================================================
    // uploads/file.jpg
    // ===================================================

    if (
      value.startsWith("uploads/")
    ) {

      return `${SERVER_URL}/${value}`;

    }


    // ===================================================
    // FILENAME ONLY
    // ===================================================

    return `${SERVER_URL}/uploads/${value}`;

  };


  // =====================================================
  // GET SITE IMAGES
  // =====================================================

  const getSiteImages = (
    submission
  ) => {

    const images =
      submission?.site_images ||
      submission?.images ||
      submission?.photos ||
      submission?.submission_snapshot?.site_images ||
      submission?.submission_snapshot?.images ||
      [];

    if (
      !Array.isArray(images)
    ) {

      return [];

    }

    return images;

  };


  // =====================================================
  // GET SELFIE
  // =====================================================

  const getSelfie = (
    submission
  ) => {

    return (
      submission?.selfie ||
      submission?.submission_snapshot?.selfie ||
      null
    );

  };


  // =====================================================
  // FETCH APPROVALS
  // ROLE BASED
  // =====================================================

  const fetchApprovals = async () => {

    try {

      setLoading(true);

      setError("");


      console.log(
        "================================="
      );

      console.log(
        "APPROVALS ROLE:",
        role
      );

      console.log(
        "================================="
      );


      let response;


      // =================================================
      // STATE HEAD
      // =================================================

      if (isStateHead) {

        console.log(
          "FETCHING STATE HEAD APPROVALS"
        );

        response =
          await getStateHeadPendingApprovals();

      }


      // =================================================
      // VENDOR
      // =================================================

      else if (isVendor) {

        console.log(
          "FETCHING VENDOR APPROVALS"
        );

        response =
          await getVendorPendingApprovals();

      }


      // =================================================
      // INVALID ROLE
      // =================================================

      else {

        setError(
          `Unauthorized role: ${
            role || "Unknown"
          }`
        );

        setSubmissions([]);

        return;

      }


      console.log(
        "APPROVAL RESPONSE:",
        response
      );

      console.log(
        "APPROVAL DATA:",
        response?.data
      );


      const data =
        response?.data?.submissions ||
        response?.data?.data ||
        [];


      console.log(
        "SUBMISSIONS:",
        data
      );


      setSubmissions(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "GET APPROVALS ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err?.response?.status
      );

      console.error(
        "MESSAGE:",
        err?.response?.data
      );


      const message =
        err?.response?.data?.message ||
        "Failed to load approvals";


      setError(message);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchApprovals();

  }, [role]);


  // =====================================================
  // APPROVE
  // ROLE BASED
  // =====================================================

  const handleApprove = async (
    submissionId
  ) => {


    // ===================================================
    // SWEET ALERT CONFIRMATION
    // ===================================================

    const result =
      await Swal.fire({

        title: "Approve Submission?",

        text:
          "Are you sure you want to approve this submission?",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Yes, Approve",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#16a34a",

        cancelButtonColor:
          "#6b7280",

        reverseButtons: true,

      });


    if (
      !result.isConfirmed
    ) {

      return;

    }


    try {

      setProcessingId(
        submissionId
      );

      setError("");


      let response;


      // =================================================
      // STATE HEAD APPROVE
      // =================================================

      if (isStateHead) {

        console.log(
          "STATE HEAD APPROVE:",
          submissionId
        );

        response =
          await stateHeadApprove(
            submissionId,
            ""
          );

      }


      // =================================================
      // VENDOR APPROVE
      // =================================================

      else if (isVendor) {

        console.log(
          "VENDOR APPROVE:",
          submissionId
        );

        response =
          await vendorApprove(
            submissionId,
            ""
          );

      }


      // =================================================
      // UNAUTHORIZED
      // =================================================

      else {

        setError(
          "You are not authorized to approve."
        );

        return;

      }


      console.log(
        "APPROVE RESPONSE:",
        response
      );


      if (
        response?.data?.success ||
        response?.status === 200
      ) {


        // ===============================================
        // REMOVE FROM LIST
        // ===============================================

        setSubmissions(
          (prev) =>
            prev.filter(
              (item) =>
                item._id !==
                submissionId
            )
        );


        // ===============================================
        // SUCCESS ALERT
        // ===============================================

        await Swal.fire({

          title: "Approved!",

          text:
            "Submission has been approved successfully.",

          icon: "success",

          confirmButtonText:
            "OK",

          confirmButtonColor:
            "#16a34a",

        });

      }


    } catch (err) {

      console.error(
        "APPROVE ERROR:",
        err
      );


      const message =
        err?.response?.data?.message ||
        "Failed to approve submission";


      setError(message);


      // ===============================================
      // ERROR ALERT
      // ===============================================

      await Swal.fire({

        title: "Approval Failed",

        text: message,

        icon: "error",

        confirmButtonText:
          "OK",

        confirmButtonColor:
          "#dc2626",

      });


    } finally {

      setProcessingId(null);

    }

  };


  // =====================================================
  // OPEN REJECT
  // =====================================================

  const openReject = (
    submissionId
  ) => {

    setRejectId(
      submissionId
    );

    setRemarks("");

    setError("");

  };


  // =====================================================
  // CANCEL REJECT
  // =====================================================

  const cancelReject = () => {

    setRejectId(null);

    setRemarks("");

  };


  // =====================================================
  // REJECT
  // ROLE BASED
  // =====================================================

  const handleReject = async () => {


    if (!rejectId) {

      return;

    }


    // ===================================================
    // REMARK VALIDATION
    // ===================================================

    if (!remarks.trim()) {

      await Swal.fire({

        title:
          "Remarks Required",

        text:
          "Please enter rejection remarks before rejecting the submission.",

        icon:
          "warning",

        confirmButtonText:
          "OK",

        confirmButtonColor:
          "#dc2626",

      });

      return;

    }


    try {

      setProcessingId(
        rejectId
      );

      setError("");


      let response;


      // =================================================
      // STATE HEAD REJECT
      // =================================================

      if (isStateHead) {

        console.log(
          "STATE HEAD REJECT:",
          rejectId
        );

        response =
          await stateHeadReject(
            rejectId,
            remarks.trim()
          );

      }


      // =================================================
      // VENDOR REJECT
      // =================================================

      else if (isVendor) {

        console.log(
          "VENDOR REJECT:",
          rejectId
        );

        response =
          await vendorReject(
            rejectId,
            remarks.trim()
          );

      }


      // =================================================
      // UNAUTHORIZED
      // =================================================

      else {

        setError(
          "You are not authorized to reject."
        );

        return;

      }


      console.log(
        "REJECT RESPONSE:",
        response
      );


      if (
        response?.data?.success ||
        response?.status === 200
      ) {


        // ===============================================
        // REMOVE FROM LIST
        // ===============================================

        setSubmissions(
          (prev) =>
            prev.filter(
              (item) =>
                item._id !==
                rejectId
            )
        );


        // ===============================================
        // RESET
        // ===============================================

        setRejectId(null);

        setRemarks("");


        // ===============================================
        // SUCCESS ALERT
        // ===============================================

        await Swal.fire({

          title:
            "Rejected!",

          text:
            "Submission has been rejected successfully.",

          icon:
            "success",

          confirmButtonText:
            "OK",

          confirmButtonColor:
            "#dc2626",

        });

      }


    } catch (err) {

      console.error(
        "REJECT ERROR:",
        err
      );


      const message =
        err?.response?.data?.message ||
        "Failed to reject submission";


      setError(message);


      // ===============================================
      // ERROR ALERT
      // ===============================================

      await Swal.fire({

        title:
          "Rejection Failed",

        text:
          message,

        icon:
          "error",

        confirmButtonText:
          "OK",

        confirmButtonColor:
          "#dc2626",

      });

    } finally {

      setProcessingId(
        null
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-[400px] flex items-center justify-center">

        <div className="flex items-center gap-3 text-gray-500">

          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Loading approvals...
          </span>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="max-w-7xl mx-auto">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-7">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">

              {isStateHead
                ? "State Head Approvals"
                : "Vendor Approvals"}

            </h1>


            <p className="text-gray-500 mt-1">

              {isStateHead
                ? "Review site submissions approved by vendors."
                : "Review and manage pending site submissions."}

            </p>

          </div>


          <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">

            <span className="text-sm text-orange-700">

              Pending:{" "}

              <strong>
                {submissions.length}
              </strong>

            </span>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (

        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3">

          {error}

        </div>

      )}


      {/* ================================================= */}
      {/* EMPTY */}
      {/* ================================================= */}

      {!error &&
        submissions.length === 0 && (

          <div className="bg-white border rounded-xl p-12 text-center">

            <CheckCircle
              size={55}
              className="mx-auto text-green-500 mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-900">

              No Pending Approvals

            </h2>

            <p className="text-gray-500 mt-2">

              {isStateHead
                ? "There are no submissions waiting for State Head approval."
                : "There are no submissions waiting for vendor approval."}

            </p>

          </div>

        )}


      {/* ================================================= */}
      {/* SUBMISSIONS */}
      {/* ================================================= */}

      {submissions.length > 0 && (

        <div className="space-y-6">

          {submissions.map(
            (submission) => {

              const site =
                submission?.site || {};


              // =========================================
              // SITE DETAILS
              // =========================================

              const siteCode =
                site.site_code ||
                submission.site_code ||
                "N/A";


              const siteName =
                site.site_name ||
                submission.site_name ||
                "Site";


              const location =
                site.location ||
                submission.location ||
                site.town ||
                "-";


              const state =
                site.state ||
                submission.state ||
                "-";


              const zone =
                site.zone ||
                submission.zone ||
                "-";


              const mediaType =
                site.media_type ||
                submission.media_type ||
                "-";


              const siteType =
                site.type ||
                submission.type ||
                "-";


              const width =
                site.width ||
                submission.width ||
                0;


              const height =
                site.height ||
                submission.height ||
                0;


              const totalSqft =
                site.total_sqr_ft ||
                site.total_sqft ||
                submission.total_sqr_ft ||
                submission.total_sqft ||
                0;


              // =========================================
              // SUBMISSION DETAILS
              // =========================================

              const personName =
                submission.person_name ||
                submission.uploaded_by?.name ||
                submission.submittedBy?.name ||
                submission.createdBy?.name ||
                "Unknown";


              const uploader =
                submission.uploaded_by?.name ||
                submission.submittedBy?.name ||
                "Unknown";


              const status =
                submission.status ||
                "pending";


              // =========================================
              // IMAGES
              // =========================================

              const images =
                getSiteImages(
                  submission
                );


              // =========================================
              // SELFIE
              // =========================================

              const selfie =
                getSelfie(
                  submission
                );


              return (

                <div
                  key={
                    submission._id
                  }
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                >


                  {/* =================================== */}
                  {/* CARD HEADER */}
                  {/* =================================== */}

                  <div className="px-6 py-5 border-b bg-gray-50">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-bold text-gray-900">

                            {siteCode}

                          </h2>


                          <StatusBadge
                            status={status}
                          />

                        </div>


                        <p className="text-sm text-gray-500 mt-1">

                          {siteName}

                        </p>


                        <p className="text-xs text-gray-400 mt-1 break-all">

                          Submission ID:{" "}

                          {submission._id}

                        </p>

                      </div>


                      <button
                        onClick={() =>
                          window.location.href =
                            `/submissions/${submission._id}`
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border hover:bg-gray-100 text-sm font-medium"
                      >

                        <Eye size={16} />

                        View Details

                      </button>

                    </div>

                  </div>


                  {/* =================================== */}
                  {/* SITE DETAILS */}
                  {/* =================================== */}

                  <div className="p-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


                      {/* LOCATION */}

                      <div className="border rounded-xl p-4">

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                          <MapPin
                            size={17}
                          />

                          Location

                        </div>


                        <p className="font-semibold text-gray-900">

                          {location}

                        </p>


                        <p className="text-sm text-gray-500 mt-1">

                          {state}

                        </p>

                      </div>


                      {/* VENDOR */}

                      <div className="border rounded-xl p-4">

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                          <Building2
                            size={17}
                          />

                          Vendor

                        </div>


                        <p className="font-semibold text-gray-900">

                          {site.vendor ||
                            site.vendor_name ||
                            submission.vendor_name ||
                            "DENTSU COMMUNICATIONS"}

                        </p>

                      </div>


                      {/* EXECUTIVE */}

                      <div className="border rounded-xl p-4">

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                          <User
                            size={17}
                          />

                          Uploaded By

                        </div>


                        <p className="font-semibold text-gray-900">

                          {personName}

                        </p>


                        <p className="text-xs text-gray-500 mt-1">

                          {uploader}

                        </p>

                      </div>


                      {/* DATE */}

                      <div className="border rounded-xl p-4">

                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">

                          <CalendarDays
                            size={17}
                          />

                          Submitted At

                        </div>


                        <p className="font-semibold text-gray-900 text-sm">

                          {submission.createdAt
                            ? new Date(
                                submission.createdAt
                              ).toLocaleString(
                                "en-IN"
                              )
                            : "-"}

                        </p>

                      </div>

                    </div>


                    {/* ================================= */}
                    {/* ADDITIONAL DETAILS */}
                    {/* ================================= */}

                    <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">


                      <div className="bg-gray-50 rounded-lg p-3">

                        <p className="text-xs text-gray-500">
                          Zone
                        </p>

                        <p className="font-semibold">
                          {zone}
                        </p>

                      </div>


                      <div className="bg-gray-50 rounded-lg p-3">

                        <p className="text-xs text-gray-500">
                          Media Type
                        </p>

                        <p className="font-semibold">
                          {mediaType}
                        </p>

                      </div>


                      <div className="bg-gray-50 rounded-lg p-3">

                        <p className="text-xs text-gray-500">
                          Type
                        </p>

                        <p className="font-semibold">
                          {siteType}
                        </p>

                      </div>


                      <div className="bg-gray-50 rounded-lg p-3">

                        <div className="flex items-center gap-1">

                          <Maximize
                            size={14}
                          />

                          <p className="text-xs text-gray-500">
                            Size
                          </p>

                        </div>


                        <p className="font-semibold">

                          {width} × {height}

                        </p>


                        {totalSqft > 0 && (

                          <p className="text-xs text-gray-500">

                            {totalSqft} sq.ft.

                          </p>

                        )}

                      </div>

                    </div>


                    {/* ================================= */}
                    {/* SITE IMAGES */}
                    {/* ================================= */}

                    <div className="mt-7">

                      <div className="flex items-center justify-between mb-3">

                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">

                          <ImageIcon
                            size={18}
                          />

                          Submitted Site Photos

                        </h3>


                        <span className="text-sm text-gray-500">

                          {images.length} Photos

                        </span>

                      </div>


                      {images.length === 0 ? (

                        <div className="border border-dashed rounded-xl p-8 text-center">

                          <ImageIcon
                            size={35}
                            className="mx-auto text-gray-300 mb-2"
                          />

                          <p className="text-gray-500">

                            No site photos available.

                          </p>

                        </div>

                      ) : (

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                          {images.map(
                            (
                              image,
                              index
                            ) => {

                              const imageUrl =
                                getImageUrl(
                                  image
                                );


                              if (!imageUrl) {

                                return (

                                  <div
                                    key={
                                      index
                                    }
                                    className="h-32 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400"
                                  >

                                    Invalid image

                                  </div>

                                );

                              }


                              return (

                                <a
                                  key={
                                    index
                                  }
                                  href={
                                    imageUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative block overflow-hidden rounded-xl border"
                                >

                                  <img
                                    src={
                                      imageUrl
                                    }
                                    alt={`Site Photo ${
                                      index + 1
                                    }`}
                                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(
                                      e
                                    ) => {

                                      console.error(
                                        "IMAGE LOAD ERROR:",
                                        imageUrl
                                      );

                                      e.currentTarget.style.display =
                                        "none";

                                    }}
                                  />


                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1">

                                    Photo{" "}

                                    {index + 1}

                                  </div>

                                </a>

                              );

                            }
                          )}

                        </div>

                      )}

                    </div>


                    {/* ================================= */}
                    {/* SELFIE */}
                    {/* ================================= */}

                    {selfie && (

                      <div className="mt-7">

                        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">

                          <User
                            size={18}
                          />

                          Executive Selfie

                        </h3>


                        {getImageUrl(
                          selfie
                        ) && (

                          <a
                            href={
                              getImageUrl(
                                selfie
                              )
                            }
                            target="_blank"
                            rel="noreferrer"
                          >

                            <img
                              src={
                                getImageUrl(
                                  selfie
                                )
                              }
                              alt="Executive Selfie"
                              className="w-36 h-36 object-cover rounded-xl border hover:opacity-80"
                            />

                          </a>

                        )}

                      </div>

                    )}


                    {/* ================================= */}
                    {/* REJECT FORM */}
                    {/* ================================= */}

                    {rejectId ===
                      submission._id && (

                      <div className="mt-7 p-5 bg-red-50 border border-red-200 rounded-xl">

                        <label className="block text-sm font-semibold text-red-700 mb-2">

                          Rejection Remarks

                        </label>


                        <textarea
                          value={
                            remarks
                          }
                          onChange={(
                            e
                          ) =>
                            setRemarks(
                              e.target.value
                            )
                          }
                          rows={4}
                          placeholder="Enter reason for rejection..."
                          className="w-full border border-red-200 bg-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-300 resize-none"
                        />


                        <div className="flex justify-end gap-3 mt-3">


                          {/* CANCEL */}

                          <button
                            onClick={
                              cancelReject
                            }
                            disabled={
                              processingId ===
                              submission._id
                            }
                            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
                          >

                            Cancel

                          </button>


                          {/* CONFIRM REJECT */}

                          <button
                            onClick={
                              handleReject
                            }
                            disabled={
                              processingId ===
                              submission._id
                            }
                            className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                          >

                            {processingId ===
                              submission._id && (

                              <Loader2
                                size={16}
                                className="animate-spin"
                              />

                            )}


                            {processingId ===
                            submission._id
                              ? "Rejecting..."
                              : "Confirm Reject"}

                          </button>

                        </div>

                      </div>

                    )}


                    {/* ================================= */}
                    {/* ACTION BUTTONS */}
                    {/* ================================= */}

                    {rejectId !==
                      submission._id && (

                      <div className="mt-7 pt-5 border-t flex flex-col sm:flex-row justify-end gap-3">


                        {/* REJECT */}

                        <button
                          onClick={() =>
                            openReject(
                              submission._id
                            )
                          }
                          disabled={
                            processingId ===
                            submission._id
                          }
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 font-medium"
                        >

                          <XCircle
                            size={18}
                          />

                          Reject

                        </button>


                        {/* APPROVE */}

                        <button
                          onClick={() =>
                            handleApprove(
                              submission._id
                            )
                          }
                          disabled={
                            processingId ===
                            submission._id
                          }
                          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                        >

                          {processingId ===
                          submission._id ? (

                            <Loader2
                              size={18}
                              className="animate-spin"
                            />

                          ) : (

                            <CheckCircle
                              size={18}
                            />

                          )}


                          {processingId ===
                          submission._id
                            ? "Processing..."
                            : "Approve"}

                        </button>

                      </div>

                    )}

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};


export default Approvals;
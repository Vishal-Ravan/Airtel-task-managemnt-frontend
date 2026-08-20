import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  ImagePlus,
  MapPin,
  Upload,
  X,
  Loader2,
} from "lucide-react";

import Swal from "sweetalert2";

import { getSites } from "../../services/sites.api";
import { createSubmission } from "../../services/submissions.api";

const CreateSubmission = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  const [loadingSites, setLoadingSites] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    siteId: "",
    personName: "",
    remarks: "",
  });

  const [siteImages, setSiteImages] = useState([]);
  const [selfie, setSelfie] = useState(null);

  // --------------------------------------------------
  // GET ASSIGNED SITES
  // --------------------------------------------------

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoadingSites(true);
      setError("");

      const response = await getSites();

      const data =
        response?.data?.data ||
        response?.data?.sites ||
        response?.data ||
        [];

      setSites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch sites error:", err);

      const message =
        err?.response?.data?.message ||
        "Unable to load assigned sites";

      setError(message);

      Swal.fire({
        title: "Unable to Load Sites",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoadingSites(false);
    }
  };

  // --------------------------------------------------
  // SITE SELECT
  // --------------------------------------------------

  const handleSiteChange = (e) => {
    const siteId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      siteId,
    }));

    const site = sites.find(
      (item) => item._id === siteId
    );

    setSelectedSite(site || null);

    setError("");
  };

  // --------------------------------------------------
  // IMAGE COMPRESSION
  // --------------------------------------------------

  const compressImage = (
    file,
    maxWidth = 1600,
    quality = 0.75
  ) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height =
              (height * maxWidth) / width;

            width = maxWidth;
          }

          const canvas =
            document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx =
            canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(
                  new Error(
                    "Image compression failed"
                  )
                );

                return;
              }

              const compressedFile =
                new File(
                  [blob],
                  file.name.replace(
                    /\.[^/.]+$/,
                    ".jpg"
                  ),
                  {
                    type: "image/jpeg",
                    lastModified:
                      Date.now(),
                  }
                );

              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => {
          reject(
            new Error("Invalid image")
          );
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read image"
          )
        );
      };

      reader.readAsDataURL(file);
    });
  };

  // --------------------------------------------------
  // SITE IMAGE UPLOAD
  // --------------------------------------------------

  const handleSiteImages = async (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    try {
      setError("");

      const compressedImages = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const compressed =
          await compressImage(file);

        compressedImages.push(
          compressed
        );
      }

      setSiteImages((prev) => [
        ...prev,
        ...compressedImages,
      ]);
    } catch (err) {
      console.error(err);

      const message =
        "Unable to process selected images";

      setError(message);

      Swal.fire({
        title: "Image Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }

    e.target.value = "";
  };

  // --------------------------------------------------
  // SELFIE
  // --------------------------------------------------

  const handleSelfie = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    try {
      setError("");

      const compressed =
        await compressImage(
          file,
          1000,
          0.7
        );

      setSelfie(compressed);
    } catch (err) {
      console.error(err);

      const message =
        "Unable to process selfie";

      setError(message);

      Swal.fire({
        title: "Selfie Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }

    e.target.value = "";
  };

  // --------------------------------------------------
  // REMOVE SITE IMAGE
  // --------------------------------------------------

  const removeSiteImage = (index) => {
    setSiteImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ------------------------------------------------
    // VALIDATION
    // ------------------------------------------------

    if (!formData.siteId) {
      await Swal.fire({
        title: "Site Required",
        text: "Please select a site.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });

      return;
    }

    if (!formData.personName.trim()) {
      await Swal.fire({
        title: "Name Required",
        text: "Please enter your name.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });

      return;
    }

    if (!siteImages.length) {
      await Swal.fire({
        title: "Site Photos Required",
        text: "Please upload at least one site image.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });

      return;
    }

    if (!selfie) {
      await Swal.fire({
        title: "Selfie Required",
        text: "Please upload your selfie.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });

      return;
    }

    // ------------------------------------------------
    // CONFIRM SUBMISSION
    // ------------------------------------------------

    const result = await Swal.fire({
      title: "Submit Site?",
      text:
        "Are you sure you want to submit this site for verification?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#111827",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    // ------------------------------------------------
    // API SUBMISSION
    // ------------------------------------------------

    try {
      setSubmitting(true);

      const payload =
        new FormData();

      payload.append(
        "site_id",
        formData.siteId
      );

      payload.append(
        "person_name",
        formData.personName.trim()
      );

      payload.append(
        "remarks",
        formData.remarks.trim()
      );

      // Site images
      siteImages.forEach(
        (image) => {
          payload.append(
            "site_images",
            image
          );
        }
      );

      // Selfie
      payload.append(
        "selfie",
        selfie
      );

      await createSubmission(
        payload
      );

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      setFormData({
        siteId: "",
        personName: "",
        remarks: "",
      });

      setSelectedSite(null);
      setSiteImages([]);
      setSelfie(null);

      await Swal.fire({
        title: "Submission Successful!",
        text:
          "Site submission has been created successfully.",
        icon: "success",
        confirmButtonText: "View Submissions",
        confirmButtonColor: "#16a34a",
      });

      navigate("/submissions");

    } catch (err) {
      console.error(
        "Create submission error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Failed to create submission";

      setError(message);

      // ------------------------------------------------
      // ERROR ALERT
      // ------------------------------------------------

      await Swal.fire({
        title: "Submission Failed",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });

    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingSites) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">

          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading assigned sites...

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Submission
          </h1>

          <p className="text-gray-500 mt-1">
            Upload site photos and submit
            the site for verification.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/submissions")
          }
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >

          <ArrowLeft size={18} />

          Back

        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      )}


      <form onSubmit={handleSubmit}>

        {/* SITE SELECTION */}

        <div className="bg-white border rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-5">
            Select Site
          </h2>

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Site

              <span className="text-red-500 ml-1">
                *
              </span>

            </label>

            <select
              value={formData.siteId}
              onChange={
                handleSiteChange
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            >

              <option value="">
                Select assigned site
              </option>

              {sites.map((site) => (

                <option
                  key={site._id}
                  value={site._id}
                >

                  {site.site_code}{" "}

                  {site.location
                    ? `- ${site.location}`
                    : ""}

                </option>

              ))}

            </select>


            {!sites.length && (

              <p className="text-sm text-gray-500 mt-2">

                No sites are currently
                assigned to you.

              </p>

            )}

          </div>

        </div>


        {/* SITE DETAILS */}

        {selectedSite && (

          <div className="bg-white border rounded-xl p-6 mb-6">

            <h2 className="text-lg font-semibold mb-5">
              Site Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <Detail
                label="Site Code"
                value={
                  selectedSite.site_code
                }
              />

              <Detail
                label="State"
                value={
                  selectedSite.state
                }
              />

              <Detail
                label="Zone"
                value={
                  selectedSite.zone
                }
              />

              <Detail
                label="Media Type"
                value={
                  selectedSite.media_type
                }
              />

              <Detail
                label="Location"
                value={
                  selectedSite.location
                }
              />

              <Detail
                label="Type"
                value={
                  selectedSite.type
                }
              />

              <Detail
                label="Unit"
                value={
                  selectedSite.unit
                }
              />

              <Detail
                label="Duration"
                value={
                  selectedSite.duration
                }
              />

              <Detail
                label="Width"
                value={
                  selectedSite.width
                }
              />

              <Detail
                label="Height"
                value={
                  selectedSite.height
                }
              />

              <Detail
                label="Total Sq. Ft."
                value={
                  selectedSite.total_sqr_ft
                }
              />

              <Detail
                label="Vendor"
                value={
                  selectedSite.vendor
                }
              />

            </div>


            {selectedSite.lat &&
              selectedSite.long && (

                <div className="mt-5">

                  <a
                    href={`https://www.google.com/maps?q=${selectedSite.lat},${selectedSite.long}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >

                    <MapPin size={16} />

                    Open location in Google
                    Maps

                  </a>

                </div>

              )}

          </div>

        )}


        {/* PERSON DETAILS */}

        <div className="bg-white border rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-5">
            Executive Details
          </h2>

          <div className="max-w-xl">

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Your Name

              <span className="text-red-500 ml-1">
                *
              </span>

            </label>

            <input
              type="text"
              value={
                formData.personName
              }
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    personName:
                      e.target.value,
                  })
                )
              }
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
            />

          </div>

        </div>


        {/* SITE IMAGES */}

        <div className="bg-white border rounded-xl p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-lg font-semibold">
                Site Photos
              </h2>

              <p className="text-sm text-gray-500 mt-1">

                Images will be optimized before
                upload to save storage.

              </p>

            </div>

            <Camera
              size={22}
              className="text-gray-500"
            />

          </div>


          <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">

            <ImagePlus
              size={35}
              className="text-gray-400 mb-3"
            />

            <span className="font-medium">
              Click to upload site photos
            </span>

            <span className="text-sm text-gray-500 mt-1">
              JPG, PNG, WEBP
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleSiteImages
              }
              className="hidden"
            />

          </label>


          {siteImages.length > 0 && (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

              {siteImages.map(
                (image, index) => (

                  <div
                    key={`${image.name}-${index}`}
                    className="relative group"
                  >

                    <img
                      src={
                        URL.createObjectURL(
                          image
                        )
                      }
                      alt={`Site ${
                        index + 1
                      }`}
                      className="w-full h-40 object-cover rounded-lg border"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        removeSiteImage(
                          index
                        )
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5"
                    >

                      <X size={16} />

                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* SELFIE */}

        <div className="bg-white border rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-1">
            Selfie
          </h2>

          <p className="text-sm text-gray-500 mb-5">

            Upload your selfie for verification.

          </p>


          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">

            <Camera size={18} />

            {selfie
              ? "Change Selfie"
              : "Upload Selfie"}


            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={
                handleSelfie
              }
              className="hidden"
            />

          </label>


          {selfie && (

            <div className="mt-5 relative w-48">

              <img
                src={
                  URL.createObjectURL(
                    selfie
                  )
                }
                alt="Selfie"
                className="w-48 h-48 object-cover rounded-xl border"
              />


              <button
                type="button"
                onClick={() =>
                  setSelfie(null)
                }
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5"
              >

                <X size={16} />

              </button>

            </div>

          )}

        </div>


        {/* REMARKS */}

        <div className="bg-white border rounded-xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-4">
            Remarks
          </h2>

          <textarea
            value={
              formData.remarks
            }
            onChange={(e) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  remarks:
                    e.target.value,
                })
              )
            }
            rows={4}
            placeholder="Enter any additional remarks..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />

        </div>


        {/* SUBMIT */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/submissions")
            }
            className="px-5 py-3 border rounded-lg hover:bg-gray-50"
          >

            Cancel

          </button>


          <button
            type="submit"
            disabled={
              submitting ||
              !selectedSite
            }
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {submitting ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Submitting...
              </>

            ) : (

              <>
                <Upload size={18} />

                Submit Site
              </>

            )}

          </button>

        </div>

      </form>

    </div>
  );
};


// --------------------------------------------------
// DETAIL COMPONENT
// --------------------------------------------------

const Detail = ({
  label,
  value,
}) => {

  return (

    <div>

      <p className="text-xs text-gray-500 uppercase tracking-wide">

        {label}

      </p>

      <p className="font-medium text-gray-900 mt-1">

        {value || "-"}

      </p>

    </div>

  );
};


export default CreateSubmission;
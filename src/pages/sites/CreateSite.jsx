import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const CreateSite = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    site_code: "",
    state: "",
    zone: "",
    media_type: "",
    duration: "",
    location: "",
    type: "",
    unit: "",
    width: "",
    height: "",
    total_sqr_ft: "",
    lat: "",
    long: "",
    vendor: "",
    availability: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // API baad mein connect karenge
      console.log("CREATE SITE:", formData);

      alert("Site data ready");

      // API success ke baad:
      // navigate("/sites");

    } catch (error) {
      console.error("Create site error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Site
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new site to the system.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/sites")}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
          Back
        </button>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6"
      >

        {/* Basic Information */}
        <div className="mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            <Input
              label="Site Code"
              name="site_code"
              value={formData.site_code}
              onChange={handleChange}
              required
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />

            <Input
              label="Zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              required
            />

            <Input
              label="Media Type"
              name="media_type"
              value={formData.media_type}
              onChange={handleChange}
            />

            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <Input
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            />

            <Input
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Dimensions */}
        <div className="mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Dimensions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <Input
              label="Width"
              name="width"
              type="number"
              value={formData.width}
              onChange={handleChange}
            />

            <Input
              label="Height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
            />

            <Input
              label="Total Sq. Ft."
              name="total_sqr_ft"
              type="number"
              value={formData.total_sqr_ft}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Location */}
        <div className="mb-8">

          <h2 className="text-lg font-semibold mb-4">
            GPS Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Input
              label="Latitude"
              name="lat"
              type="number"
              value={formData.lat}
              onChange={handleChange}
            />

            <Input
              label="Longitude"
              name="long"
              type="number"
              value={formData.long}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Vendor */}
        <div className="mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Vendor & Availability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Input
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
            />

            <Input
              label="Availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            />

            <Input
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />

            <Input
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 border-t pt-5">

          <button
            type="button"
            onClick={() => navigate("/sites")}
            className="px-5 py-2.5 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >

            <Save size={18} />

            {loading ? "Saving..." : "Create Site"}

          </button>

        </div>

      </form>

    </div>
  );
};


/* Reusable Input */

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />

    </div>
  );
};


/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
*/

export default CreateSite;
import {
  useState
} from "react";

const SelfieCapture = ({
  onChange
}) => {

  const [preview, setPreview] =
    useState(null);

  const handleChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const url =
      URL.createObjectURL(file);

    setPreview(url);

    onChange(file);
  };

  return (
    <div>

      <label className="block font-medium mb-3">
        Selfie
      </label>

      <label className="border-2 border-dashed border-gray-300 rounded-xl min-h-40 flex items-center justify-center cursor-pointer hover:border-red-500">

        {preview ? (

          <img
            src={preview}
            alt="Selfie"
            className="w-full h-48 object-cover rounded-xl"
          />

        ) : (

          <div className="text-center">

            <p className="font-semibold">
              Take / Upload Selfie
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Camera will open on mobile
            </p>

          </div>

        )}

        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleChange}
          className="hidden"
        />

      </label>

    </div>
  );
};

export default SelfieCapture;
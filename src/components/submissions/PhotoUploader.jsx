import {
  useState
} from "react";

import imageCompression from
  "browser-image-compression";

const PhotoUploader = ({
  onChange,
  maxFiles = 5
}) => {

  const [previews, setPreviews] =
    useState([]);

  const [processing, setProcessing] =
    useState(false);

  const handleFiles =
    async (e) => {

      const files =
        Array.from(
          e.target.files
        ).slice(0, maxFiles);

      if (!files.length) return;

      try {

        setProcessing(true);

        const optimizedFiles = [];

        for (
          const file of files
        ) {

          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.8
          };

          const compressed =
            await imageCompression(
              file,
              options
            );

          optimizedFiles.push(
            compressed
          );
        }

        const urls =
          optimizedFiles.map(
            (file) =>
              URL.createObjectURL(
                file
              )
          );

        setPreviews(urls);

        onChange(
          optimizedFiles
        );

      } catch (error) {

        console.error(
          "Image compression failed",
          error
        );

      } finally {

        setProcessing(false);

      }
    };

  return (
    <div>

      <label className="block font-medium mb-3">
        Site Photos
      </label>

      <label className="border-2 border-dashed border-gray-300 rounded-xl min-h-40 flex items-center justify-center cursor-pointer hover:border-red-500 transition">

        <div className="text-center px-4">

          <p className="font-semibold">
            {processing
              ? "Optimizing images..."
              : "Click to upload photos"}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Maximum {maxFiles} images
          </p>

        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleFiles}
          className="hidden"
        />

      </label>

      {previews.length > 0 && (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

          {previews.map(
            (url, index) => (

              <img
                key={index}
                src={url}
                alt={`Site ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />

            )
          )}

        </div>

      )}

    </div>
  );
};

export default PhotoUploader;
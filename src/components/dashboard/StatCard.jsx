const StatCard = ({
  title,
  value,
  icon: Icon,
  description
}) => {

  return (
    <div className="bg-white border rounded-xl p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          {description && (
            <p className="text-xs text-gray-500 mt-2">
              {description}
            </p>
          )}

        </div>

        <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
          <Icon size={22} />
        </div>

      </div>

    </div>
  );
};

export default StatCard;
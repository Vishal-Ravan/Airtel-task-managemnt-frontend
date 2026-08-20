const StatusBadge = ({
  status
}) => {

  const styles = {

    approved:
      "bg-green-100 text-green-700",

    pending:
      "bg-yellow-100 text-yellow-700",

    rejected:
      "bg-red-100 text-red-700",

    submitted:
      "bg-blue-100 text-blue-700"

  };

  return (
    <span
      className={`
        inline-flex
        px-2.5 py-1
        rounded-full
        text-xs
        font-semibold
        ${styles[status] ||
        "bg-gray-100 text-gray-700"}
      `}
    >
      {status
        ?.replaceAll("_", " ")
        ?.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
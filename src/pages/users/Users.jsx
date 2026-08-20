import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  UserRound,
} from "lucide-react";

import {
  getUsers,
  deleteUser,
} from "../../services/users.api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsers();

      const data =
        response?.data?.data ||
        response?.data?.users ||
        response?.data ||
        [];

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Users error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter(
          (user) =>
            user._id !== id &&
            user.id !== id
        )
      );
    } catch (err) {
      console.error("Delete user error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      String(user?.name || "")
        .toLowerCase()
        .includes(text) ||
      String(user?.email || "")
        .toLowerCase()
        .includes(text) ||
      String(user?.phone || "")
        .toLowerCase()
        .includes(text) ||
      String(user?.role || "")
        .toLowerCase()
        .includes(text) ||
      String(user?.zone || "")
        .toLowerCase()
        .includes(text) ||
      String(user?.state || "")
        .toLowerCase()
        .includes(text) ||
      String(user?.site_code || "")
        .toLowerCase()
        .includes(text)
    );
  });

  const roleLabel = (role) => {
    if (!role) return "-";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700";

      case "vendor":
        return "bg-blue-50 text-blue-700";

      case "vendor_executive":
        return "bg-indigo-50 text-indigo-700";

      case "state_head":
        return "bg-orange-50 text-orange-700";

      case "client":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusClass = (status) => {
    if (
      status === true ||
      status === "active"
    ) {
      return "bg-green-50 text-green-700";
    }

    return "bg-red-50 text-red-700";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all users and their access.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            to="/users/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={18} />
            Create User
          </Link>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 p-4 rounded-lg border border-red-200 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="bg-white border rounded-xl p-4 mb-5">

        <div className="relative max-w-lg">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search name, email, role, zone..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
          />

        </div>

      </div>

      {/* EMPTY */}

      {filteredUsers.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">

          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserRound
              size={25}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-lg font-semibold">
            No users found
          </h2>

          <p className="text-gray-500 mt-1">
            No users match your search.
          </p>

        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    User
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Phone
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Role
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Zone
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    State
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Site Code
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredUsers.map(
                  (user, index) => {

                    const id =
                      user?._id ||
                      user?.id;

                    const isActive =
                      user?.isActive ??
                      user?.status === "active";

                    return (
                      <tr
                        key={id || index}
                        className="hover:bg-gray-50"
                      >

                        {/* USER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserRound
                                size={18}
                                className="text-gray-500"
                              />
                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {user?.name || "-"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {user?.email || "-"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PHONE */}

                        <td className="px-5 py-4 text-sm">
                          {user?.phone || "-"}
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleClass(
                              user?.role
                            )}`}
                          >
                            {roleLabel(
                              user?.role
                            )}
                          </span>

                        </td>

                        {/* ZONE */}

                        <td className="px-5 py-4 text-sm">
                          {user?.zone || "-"}
                        </td>

                        {/* STATE */}

                        <td className="px-5 py-4 text-sm">
                          {user?.state || "-"}
                        </td>

                        {/* SITE CODE */}

                        <td className="px-5 py-4 text-sm">
                          {user?.site_code || "-"}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                              isActive
                            )}`}
                          >
                            {isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/users/${id}`}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>

                            <Link
                              to={`/users/${id}/edit`}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(id)
                              }
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
};

export default Users;
import {
  Navigate,
  Outlet
} from "react-router-dom";

import {
  useAuth
} from "../../hooks/useAuth";

const ProtectedRoute = ({
  roles
}) => {

  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    roles &&
    !roles.includes(user.role)
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
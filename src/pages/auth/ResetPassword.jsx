import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

import { resetPassword } from "../../services/auth.api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // ========================================
  // TOKEN CHECK
  // ========================================

  if (!token) {
    setError("Invalid or missing reset token.");
    return;
  }

  // ========================================
  // PASSWORD CHECK
  // ========================================

  if (!password.trim()) {
    setError("Please enter your new password.");
    return;
  }

  if (password.length < 6) {
    setError(
      "Password must be at least 6 characters."
    );
    return;
  }

  // ========================================
  // CONFIRM PASSWORD
  // ========================================

  if (!confirmPassword.trim()) {
    setError(
      "Please confirm your new password."
    );
    return;
  }

  if (password !== confirmPassword) {
    setError(
      "Password and confirm password do not match."
    );
    return;
  }

  // ========================================
  // API
  // ========================================

  try {
    setLoading(true);

    const response = await resetPassword(
      token,
      {
        new_password: password,
      }
    );

    console.log(
      "RESET PASSWORD RESPONSE:",
      response
    );

    setSuccess(
      response?.data?.message ||
        "Password reset successfully."
    );

    // Clear fields
    setPassword("");
    setConfirmPassword("");

    // Redirect
    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {

    console.error(
      "RESET PASSWORD ERROR:",
      err
    );

    console.error(
      "RESET PASSWORD RESPONSE:",
      err?.response?.data
    );

    setError(
      err?.response?.data?.message ||
        "Unable to reset password. The link may have expired."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 md:p-8">

          {/* ICON */}

          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-5">
            {success ? (
              <CheckCircle
                size={27}
                className="text-green-600"
              />
            ) : (
              <Lock
                size={25}
                className="text-gray-800"
              />
            )}
          </div>

          {/* HEADING */}

          <div className="text-center mb-7">

            <h1 className="text-2xl font-bold text-gray-900">
              Reset Password
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Enter your new password below.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
              <p className="mt-1 text-xs">
                Redirecting to login...
              </p>
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}

              </button>

            </form>
          )}

          {/* BACK LOGIN */}

          <div className="mt-6 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ResetPassword;
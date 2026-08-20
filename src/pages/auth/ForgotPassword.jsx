import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

import { forgotPassword } from "../../services/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: email.trim(),
      });

      setMessage(
        response?.data?.message ||
          "If this email exists, a password reset link has been sent."
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to process your request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Card */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7 md:p-8">

          {/* Icon */}

          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Mail size={25} className="text-gray-800" />
          </div>

          {/* Heading */}

          <div className="text-center mb-7">

            <h1 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Enter your registered email address and
              we'll send you a password reset link.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Success */}

          {message && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />

              </div>

            </div>

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

                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}

            </button>

          </form>

          {/* Back to Login */}

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

export default ForgotPassword;
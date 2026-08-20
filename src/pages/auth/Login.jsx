import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  loginUser,
} from "../../services/auth.api";

import {
  useAuth,
} from "../../hooks/useAuth";

import logo from "../../assets/logo.png";


const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);


  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ========================================
  // LOGIN
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();
    e.stopPropagation();

    console.log("LOGIN FORM SUBMITTED");


    // ======================================
    // VALUES
    // ======================================

    const email = form.email.trim();

    const password = form.password;


    // ======================================
    // EMAIL VALIDATION
    // ======================================

    if (!email) {

      Swal.fire({
        title: "Email Required",
        text: "Please enter your email address.",
        icon: "warning",
        confirmButtonColor: "#dc2626",
      });

      return;
    }


    // ======================================
    // PASSWORD VALIDATION
    // ======================================

    if (!password) {

      Swal.fire({
        title: "Password Required",
        text: "Please enter your password.",
        icon: "warning",
        confirmButtonColor: "#dc2626",
      });

      return;
    }


    // ======================================
    // EMAIL FORMAT
    // ======================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        icon: "warning",
        confirmButtonColor: "#dc2626",
      });

      return;
    }


    try {

      setLoading(true);


      console.log(
        "CALLING LOGIN API"
      );


      // ====================================
      // LOGIN API
      // ====================================

      const response =
        await loginUser({
          email,
          password,
        });


      console.log(
        "LOGIN RESPONSE:",
        response
      );


      const data =
        response?.data;


      console.log(
        "LOGIN DATA:",
        data
      );


      // ====================================
      // TOKEN CHECK
      // ====================================

      if (!data?.token) {

        Swal.fire({
          title: "Login Failed",
          text:
            data?.message ||
            "Invalid email or password.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });

        return;
      }


      // ====================================
      // USER CHECK
      // ====================================

      if (!data?.user) {

        Swal.fire({
          title: "Login Failed",
          text: "User data was not received.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });

        return;
      }


      // ====================================
      // GET ROLE
      // ====================================

      const userRole =
        data.user?.role;


      console.log(
        "LOGGED IN USER ROLE:",
        userRole
      );


      // ====================================
      // SAVE AUTH
      // ====================================

      login(
        data.token,
        data.user
      );


      // ====================================
      // SUCCESS MESSAGE
      // ====================================

      await Swal.fire({
        title: "Login Successful!",
        text: data.user?.name
          ? `Welcome back, ${data.user.name}!`
          : "Welcome back!",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#16a34a",
      });


      // ====================================
      // ROLE BASED REDIRECT
      // ====================================

      if (
        userRole === "vendor_executive"
      ) {

        navigate(
          "/sites",
          {
            replace: true,
          }
        );

      } else {

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

      }


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error?.response
      );

      console.error(
        "DATA:",
        error?.response?.data
      );


      // ====================================
      // ERROR MESSAGE
      // ====================================

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please try again.";


      // ====================================
      // NETWORK ERROR
      // ====================================

      if (
        error?.message ===
        "Network Error"
      ) {

        Swal.fire({
          title: "Server Error",
          text:
            "Unable to connect to the server. Please check whether your backend server is running.",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });

        return;
      }


      // ====================================
      // API ERROR
      // ====================================

      Swal.fire({
        title: "Login Failed",
        text: message,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#dc2626",
      });


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-8">


          {/* ========================================
              LOGO
          ======================================== */}

          <div className="flex justify-center mb-8">

            <img
              src={logo}
              alt="Site Management"
              className="w-64 h-auto"
            />

          </div>


          {/* ========================================
              TITLE
          ======================================== */}

          <h1 className="text-2xl font-bold text-center">

            Welcome Back

          </h1>


          <p className="text-gray-500 text-center mt-2 mb-8">

            Sign in to Site Management

          </p>


          {/* ========================================
              FORM
          ======================================== */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Email

              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                autoComplete="email"
                disabled={loading}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                  disabled:bg-gray-100
                "
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Password

              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                  disabled:bg-gray-100
                "
              />

            </div>


            {/* FORGOT PASSWORD */}

            <div className="text-right">

              <Link
                to="/forgot-password"
                className="
                  text-sm
                  text-red-600
                  hover:underline
                "
              >
                Forgot Password?
              </Link>

            </div>


            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-red-600
                hover:bg-red-700
                text-white
                font-semibold
                py-3
                rounded-lg
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

            </button>

          </form>

        </div>

      </div>

    </div>

  );

};


export default Login;
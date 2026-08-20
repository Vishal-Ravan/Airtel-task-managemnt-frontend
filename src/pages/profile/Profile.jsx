import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  Shield,
  MapPin,
  Building2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getUserById } from "../../services/users.api";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // USER ID
  // ========================================

  const userId =
    user?.id ||
    user?._id;

  // ========================================
  // GET PROFILE
  // ========================================

  useEffect(() => {

    if (!userId) {
      setError("User information not found.");
      setLoading(false);
      return;
    }

    fetchProfile();

  }, [userId]);


  const fetchProfile = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getUserById(userId);

      console.log(
        "PROFILE RESPONSE:",
        response
      );

      const data =
        response?.data?.user ||
        response?.user ||
        response?.data;

      if (!data) {

        setError(
          "Unable to load user profile."
        );

        return;
      }

      setProfile(data);

    } catch (err) {

      console.error(
        "PROFILE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load profile."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // FORMAT ROLE
  // ========================================

  const formatRole = (role) => {

    if (!role) {
      return "-";
    }

    return role.replace(
      /_/g,
      " "
    );

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="min-h-[400px] flex items-center justify-center">

        <div className="flex items-center gap-3 text-gray-500">

          <Loader2
            size={22}
            className="animate-spin"
          />

          Loading profile...

        </div>

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <div className="max-w-5xl mx-auto">

        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">

          {error}

        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >

          <ArrowLeft size={17} />

          Back

        </button>

      </div>

    );

  }


  // ========================================
  // UI
  // ========================================

  return (

    <div className="max-w-5xl mx-auto">

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="flex items-center justify-between mb-7">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-500 mt-1">
            View your account information.
          </p>

        </div>


        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >

          <ArrowLeft size={17} />

          Back

        </button>

      </div>


      {/* ================================== */}
      {/* PROFILE CARD */}
      {/* ================================== */}

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">

        {/* ================================== */}
        {/* PROFILE HEADER */}
        {/* ================================== */}

        <div className="bg-gray-50 border-b px-6 py-8">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">

              <UserCircle
                size={58}
                className="text-gray-400"
              />

            </div>


            <div>

              <h2 className="text-2xl font-bold text-gray-900">

                {profile?.name || "-"}

              </h2>

              <p className="text-sm text-gray-500 capitalize mt-1">

                {formatRole(
                  profile?.role
                )}

              </p>

            </div>

          </div>

        </div>


        {/* ================================== */}
        {/* INFORMATION */}
        {/* ================================== */}

        <div className="p-6">

          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Personal Information
          </h3>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


            {/* NAME */}

            <ProfileField
              icon={UserCircle}
              label="Full Name"
              value={profile?.name}
            />


            {/* EMAIL */}

            <ProfileField
              icon={Mail}
              label="Email Address"
              value={profile?.email}
            />


            {/* PHONE */}

            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={profile?.phone}
            />


            {/* ROLE */}

            <ProfileField
              icon={Shield}
              label="Role"
              value={formatRole(
                profile?.role
              )}
              capitalize
            />

          </div>


          {/* ================================== */}
          {/* ASSIGNMENT */}
          {/* ================================== */}

          <div className="mt-8">

            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Assignment Information
            </h3>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* ZONE */}

              <ProfileField
                icon={MapPin}
                label="Zone"
                value={profile?.zone}
              />


              {/* STATE */}

              <ProfileField
                icon={MapPin}
                label="State"
                value={profile?.state}
              />


              {/* SITE CODE */}

              <ProfileField
                icon={Building2}
                label="Site Code"
                value={profile?.site_code}
              />

            </div>

          </div>


          {/* ================================== */}
          {/* ACCOUNT STATUS */}
          {/* ================================== */}

          <div className="mt-8">

            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Account Information
            </h3>


            <div className="border rounded-xl p-4 flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-900">
                  Account Status
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Current account status
                </p>

              </div>


              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                  ${
                    profile?.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >

                {profile?.is_active
                  ? "Active"
                  : "Inactive"}

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


// ========================================
// PROFILE FIELD
// ========================================

const ProfileField = ({
  icon: Icon,
  label,
  value,
  capitalize = false,
}) => {

  return (

    <div className="border rounded-xl p-4 bg-white">

      <div className="flex items-center gap-2 text-gray-500 mb-2">

        <Icon size={17} />

        <span className="text-sm">
          {label}
        </span>

      </div>


      <p
        className={`
          text-base
          font-semibold
          text-gray-900
          ${capitalize ? "capitalize" : ""}
        `}
      >

        {value || "-"}

      </p>

    </div>

  );

};


export default Profile;
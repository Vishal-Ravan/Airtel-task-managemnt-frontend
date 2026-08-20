import {
  Bell,
  LogOut,
  UserCircle,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../../hooks/useAuth";



const Header = () => {

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] =
    useState(0);








  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {

    const result =
      await Swal.fire({

        title: "Are you sure?",

        text:
          "You will be logged out from your account.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Yes, Logout",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#dc2626",

        cancelButtonColor:
          "#6b7280",

      });


    if (!result.isConfirmed) {
      return;
    }


    logout();

    navigate("/login");

  };


 

  // ========================================
  // PROFILE CLICK
  // ========================================

  const handleProfileClick = () => {

    navigate("/profile");

  };


  // ========================================
  // ROLE FORMAT
  // ========================================

  const formattedRole =
    user?.role
      ? user.role.replace(/_/g, " ")
      : "";


  // ========================================
  // UI
  // ========================================

  return (

    <header
      className="
        h-20
        bg-white
        border-b
        flex
        items-center
        justify-between
        px-6
      "
    >


      {/* ========================================
          LEFT
      ======================================== */}

      <div>

        <h1 className="text-xl font-bold">
          Site Management
        </h1>

        <p className="text-sm text-gray-500">
          Manage your sites and approvals
        </p>

      </div>


      {/* ========================================
          RIGHT
      ======================================== */}

    

    </header>

  );

};


export default Header;
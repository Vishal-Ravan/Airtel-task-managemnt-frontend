import {
  useState,
  useEffect
} from "react";

import {
  NavLink
} from "react-router-dom";

import {
  LayoutDashboard,
  MapPin,
  ClipboardCheck,
  Bell,
  Users,
  Menu,
  X
} from "lucide-react";

import logo from "../../assets/logo.png";

import {
  useAuth
} from "../../hooks/useAuth";


const Sidebar = () => {

  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);


  // ========================================
  // MENU ITEMS
  // ========================================

  const items = [

    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: [
        "admin",
        "vendor",
        "state_head",
        "client"
      ]
    },

    {
      label: "All Sites",
      path: "/vendor/site-status",
      icon: Bell,
      roles: [
        "vendor"
      ]
    },

    {
      label: "All Sites",
      path: "/state-head/site-status",
      icon: Bell,
      roles: [
        "state_head"
      ]
    },

    {
      label: "Campigns",
      path: "/campaigns",
      icon: MapPin,
      roles: [
        "admin",
      ]
    },
    {
      label: "Sites",
      path: "/sites",
      icon: MapPin,
      roles: [
        "admin",
        "vendor_executive",
        "vendor",
        "state_head",
        "client"
      ]
    },

    {
      label: "Submissions",
      path: "/submissions",
      icon: ClipboardCheck,
      roles: [
        "admin",
        "vendor_executive"
      ]
    },

    {
      label: "Approvals",
      path: "/approvals",
      icon: ClipboardCheck,
      roles: [
        "admin",
        "vendor",
        "state_head"
      ]
    },

    {
      label: "Users",
      path: "/users",
      icon: Users,
      roles: [
        "admin"
      ]
    }

  ];


  // ========================================
  // CLOSE SIDEBAR
  // ========================================

  const closeSidebar = () => {
    setIsOpen(false);
  };


  // ========================================
  // ESCAPE
  // ========================================

  useEffect(() => {

    const handleEscape = (e) => {

      if (e.key === "Escape") {
        closeSidebar();
      }

    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  // ========================================
  // BODY SCROLL
  // ========================================

  useEffect(() => {

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [isOpen]);


  // ========================================
  // ROLE FILTER
  // ========================================

  const filteredItems =
    items.filter((item) =>
      item.roles.includes(user?.role)
    );


  return (
    <>

      {/* ====================================
          MOBILE HAMBURGER
      ==================================== */}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          lg:hidden
          fixed
          top-3
          left-3
          z-[60]
          w-10
          h-10
          rounded-lg
          bg-neutral-950
          text-white
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        <Menu size={23} />
      </button>


      {/* ====================================
          MOBILE OVERLAY
      ==================================== */}

      {isOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            bg-black/60
            z-40
            lg:hidden
          "
        />
      )}


      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside
        className={`
          bg-neutral-950
          text-white
          w-64
          h-screen

          flex
          flex-col

          /* MOBILE */
          fixed
          top-0
          left-0
          z-50

          transform
          transition-transform
          duration-300

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          /* DESKTOP */
          lg:translate-x-0
          lg:fixed
          lg:z-30
        `}
      >

        {/* ====================================
            LOGO
        ==================================== */}

        <div
          className="
            h-20
            px-5
            border-b
            border-white/10
            flex
            items-center
            justify-between
          "
        >

          <img
            src={logo}
            alt="Site Management"
            className="
              w-48
              h-auto
              object-contain
            "
          />


          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={closeSidebar}
            className="
              lg:hidden
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-400
              hover:text-white
              hover:bg-white/10
            "
          >

            <X size={22} />

          </button>

        </div>


        {/* ====================================
            USER
        ==================================== */}

      


        {/* ====================================
            MENU
        ==================================== */}

        <div className="flex-1 overflow-y-auto px-4 py-5">

          <div
            className="
              text-xs
              text-gray-500
              uppercase
              mb-3
              px-3
            "
          >
            Main Menu
          </div>


          <nav className="space-y-1">

            {filteredItems.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={
                    item.path === "/dashboard"
                  }
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-lg
                    text-sm
                    font-medium
                    transition

                    ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                    `
                  }
                >

                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>

                </NavLink>

              );

            })}

          </nav>

        </div>


        {/* ====================================
            FOOTER
        ==================================== */}

        <div
          className="
            px-5
            py-4
            border-t
            border-white/10
          "
        >

          <p className="text-[11px] text-gray-600 text-center">
            Site Management System
          </p>

        </div>

      </aside>

    </>
  );
};


export default Sidebar;
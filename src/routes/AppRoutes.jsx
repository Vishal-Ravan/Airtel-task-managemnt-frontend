import { Routes, Route, Navigate } from "react-router-dom";

// auth
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// dashboard
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../components/layout/DashboardLayout";

// sites
import Sites from "../pages/sites/Sites";
import CreateSite from "../pages/sites/CreateSite";
import SiteDetailsPage from "../pages/sites/SiteDetailsPage";

// submissions
import CreateSubmission from "../pages/submissions/CreateSubmission";
import MySubmissions from "../pages/submissions/MySubmissions";
import SubmissionDetailsPage from "../pages/submissions/SubmissionDetailsPage";

// users
import Users from "../pages/users/Users";

// approvals
import Approvals from "../pages/approvals/Approvals";

// history
import History from "../pages/history/History";

import VendorSiteStatus from "../pages/vendor/VendorSiteStatus";
import StateHeadSiteStatus from "../pages/statehead/StateHeadSiteStatus";
import Profile from "../pages/profile/Profile";
import CreateUser from "../pages/users/CreateUser";
import EditUser from "../pages/users/EditUser";



import Campaigns from "../pages/campaigns/Campaigns";
import CreateCampaign from "../pages/campaigns/CreateCampaign";
import EditCampaign from "../pages/campaigns/EditCampaign";
import CampaignDetails from "../pages/campaigns/CampaignDetails";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          ROOT
      ========================= */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />


      {/* =========================
          AUTH
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />
<Route
  path="/users/create"
  element={<CreateUser />}
/>

<Route
  path="/users/:id/edit"
  element={<EditUser />}
/>


<Route
  path="/campaigns"
  element={<Campaigns />}
/>

<Route
  path="/campaigns/create"
  element={<CreateCampaign />}
/>

<Route
  path="/campaigns/:id"
  element={<CampaignDetails />}
/>

<Route
  path="/campaigns/:id/edit"
  element={<EditCampaign />}
/>
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />


      {/* =========================
          DASHBOARD LAYOUT
      ========================= */}

      <Route
        element={<DashboardLayout />}
      >

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =========================
            SITES
        ========================= */}

        <Route
          path="/sites"
          element={<Sites />}
        />

        <Route
          path="/sites/create"
          element={<CreateSite />}
        />

        <Route
          path="/sites/:id"
          element={<SiteDetailsPage />}
        />


        {/* =========================
            SUBMISSIONS
        ========================= */}

        <Route
          path="/submissions"
          element={<MySubmissions />}
        />
<Route
  path="/profile"
  element={<Profile />}
/>
        <Route
          path="/submissions/create"
          element={<CreateSubmission />}
        />

        <Route
          path="/submissions/:id"
          element={<SubmissionDetailsPage />}
        />

<Route
    path="/vendor/site-status"
    element={<VendorSiteStatus />}
/>
<Route
    path="/state-head/site-status"
    element={<StateHeadSiteStatus />}
/>
        {/* =========================
            APPROVALS
        ========================= */}

        <Route
          path="/approvals"
          element={<Approvals />}
        />


        {/* =========================
            HISTORY
        ========================= */}

        <Route
          path="/history"
          element={<History />}
        />




        {/* =========================
            USERS
        ========================= */}

        <Route
          path="/users"
          element={<Users />}
        />

      </Route>


      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">

              <h1 className="text-5xl font-bold">
                404
              </h1>

              <p className="text-gray-500 mt-2">
                Page not found
              </p>

              <a
                href="/login"
                className="inline-block mt-5 px-5 py-2.5 bg-black text-white rounded-lg"
              >
                Go to Login
              </a>

            </div>
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
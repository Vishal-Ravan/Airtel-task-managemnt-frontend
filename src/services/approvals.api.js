import api from "./api";


// =====================================================
// GET VENDOR PENDING APPROVALS
// =====================================================

export const getVendorPendingApprovals = () => {

    return api.get(
        "/approvals/vendor/pending"
    );

};


// =====================================================
// VENDOR APPROVE
// =====================================================

export const vendorApprove = (
  submissionId,
  remarks = ""
) => {

  return api.post(
    `/approvals/vendor/${submissionId}/approve`,
    {
      remarks
    }
  );

};


// =====================================================
// VENDOR REJECT
// =====================================================

export const vendorReject = (
  submissionId,
  remarks
) => {

  return api.post(
    `/approvals/vendor/${submissionId}/reject`,
    {
      remarks
    }
  );

};


// =====================================================
// STATE HEAD PENDING
// =====================================================

export const getStateHeadPendingApprovals = () => {

    return api.get(
        "/approvals/state-head/pending"
    );

};


// =====================================================
// STATE HEAD APPROVE
// =====================================================

// =====================================================
// STATE HEAD APPROVE
// =====================================================

export const stateHeadApprove = (
  submissionId,
  remarks = ""
) => {
  return api.post(
    `/approvals/state-head/${submissionId}/approve`,
    {
      submission_id: submissionId,
      remarks
    }
  );
};


// =====================================================
// STATE HEAD REJECT
// =====================================================

export const stateHeadReject = (
  submissionId,
  remarks
) => {

  return api.post(
    `/approvals/state-head/${submissionId}/reject`,
    {
      remarks
    }
  );

};

// =====================================================
// GET ALL VENDOR SITES
// =====================================================

export const getVendorSites = () => {

    return api.get(
        "/approvals/vendor/sites"
    );

};

export const getVendorSiteStatus = () => {
    return api.get("/approvals/vendor/status");
};
export const getStateHeadSiteStatus = () => {
    return api.get("/approvals/state-head/status");
};

export const getClientDashboard = () => {
  return api.get("/approvals/client/dashboard");
};

// =====================================================
// DASHBOARD
// =====================================================

export const getDashboardStats = () => {
  return api.get("/approvals/dashboard");
};

export const getDashboardData = () => {
  return api.get("/approvals/dashboard");
};
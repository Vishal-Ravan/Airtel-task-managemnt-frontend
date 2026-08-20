import api from "./api";

// ========================================
// GET MY SUBMISSIONS
// ========================================

export const getSubmissions = (params = {}) => {
    return api.get("/submissions", {
        params,
    });
};


// ========================================
// GET SUBMISSION BY ID
// ========================================

export const getSubmissionById = (id) => {
    return api.get(`/submissions/${id}`);
};


// ========================================
// CREATE SUBMISSION
// ========================================

export const createSubmission = (formData) => {
    return api.post(
        "/submissions",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};
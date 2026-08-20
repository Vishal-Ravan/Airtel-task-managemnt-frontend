import { useEffect, useState } from "react";

import {
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw,
    MapPin,
    Building2,
    User,
    Loader2,
    AlertCircle,
    ChevronRight,
} from "lucide-react";

import { getStateHeadSiteStatus } from "../../services/approvals.api";


// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG = {
    approved: {
        label: "Approved by State Head",
        color: "green",
        icon: CheckCircle,
    },

    pending: {
        label: "Pending State Head Approval",
        color: "yellow",
        icon: Clock,
    },

    rejected: {
        label: "Rejected by State Head",
        color: "red",
        icon: XCircle,
    },
};


// =====================================================
// COMPONENT
// =====================================================

const StateHeadSiteStatus = () => {

    const [sites, setSites] = useState([]);

    const [activeTab, setActiveTab] = useState("all");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // FETCH
    // =====================================================

    const fetchSites = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getStateHeadSiteStatus();

            console.log(
                "STATE HEAD SITE STATUS:",
                response
            );

            const data =
                response?.data?.submissions ||
                response?.data?.sites ||
                [];

            setSites(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "STATE HEAD SITE STATUS ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load state head sites"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchSites();

    }, []);


    // =====================================================
    // GET STATE HEAD STATUS
    // =====================================================

    const getStateHeadStatus = (item) => {

        /*
         * IMPORTANT:
         *
         * Backend agar direct state_head_status bhej raha hai
         * to wahi use hoga.
         */

        if (
            item?.state_head_status
        ) {

            return item.state_head_status;

        }


        if (
            item?.submission?.state_head_status
        ) {

            return item.submission.state_head_status;

        }


        /*
         * Fallback:
         *
         * Agar backend old status structure use kar raha hai
         */

        const status =
            item?.submission?.status ||
            item?.status ||
            "";


        if (
            status === "state_head_approved" ||
            status === "approved"
        ) {

            return "approved";

        }


        if (
            status === "state_head_rejected" ||
            status === "rejected_by_state_head" ||
            status === "state_head_rejected"
        ) {

            return "rejected";

        }


        if (
            status === "pending_state_head_approval" ||
            status === "pending_state_head"
        ) {

            return "pending";

        }


        /*
         * Vendor approved hone ke baad
         * State Head ke paas pending maana jayega.
         */

        if (
            item?.vendor_status === "approved"
        ) {

            return "pending";

        }


        return "pending";

    };


    // =====================================================
    // COUNTS
    // =====================================================

    const allCount =
        sites.length;


    const approvedCount =
        sites.filter(
            (item) =>
                getStateHeadStatus(item) ===
                "approved"
        ).length;


    const pendingCount =
        sites.filter(
            (item) =>
                getStateHeadStatus(item) ===
                "pending"
        ).length;


    const rejectedCount =
        sites.filter(
            (item) =>
                getStateHeadStatus(item) ===
                "rejected"
        ).length;


    // =====================================================
    // FILTER
    // =====================================================

    const filteredSites = sites.filter(
        (item) => {

            if (activeTab === "all") {

                return true;

            }

            return (
                getStateHeadStatus(item) ===
                activeTab
            );

        }
    );


    // =====================================================
    // STATUS CONFIG
    // =====================================================

    const getStatusConfig = (status) => {

        return (
            STATUS_CONFIG[status] || {
                label: "Unknown",
                color: "gray",
                icon: AlertCircle,
            }
        );

    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const StatusBadge = ({ status }) => {

        const config =
            getStatusConfig(status);

        const Icon =
            config.icon;


        const styles = {

            green:
                "bg-green-50 text-green-700 border-green-200",

            yellow:
                "bg-yellow-50 text-yellow-700 border-yellow-200",

            red:
                "bg-red-50 text-red-700 border-red-200",

            gray:
                "bg-gray-50 text-gray-600 border-gray-200",

        };


        return (

            <span
                className={`
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    border
                    whitespace-nowrap
                    ${styles[config.color]}
                `}
            >

                <Icon size={14} />

                {config.label}

            </span>

        );

    };


    // =====================================================
    // TAB BUTTON
    // =====================================================

    const TabButton = ({
        id,
        label,
        count,
        activeClass,
    }) => {

        return (

            <button
                type="button"
                onClick={() =>
                    setActiveTab(id)
                }
                className={`
                    px-5
                    py-2.5
                    rounded-lg
                    text-sm
                    font-medium
                    transition
                    border

                    ${
                        activeTab === id
                            ? activeClass
                            : "border-transparent text-gray-600 hover:bg-gray-50"
                    }
                `}
            >

                {label}

                <span className="ml-2 text-xs font-bold">
                    {count}
                </span>

            </button>

        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-[400px] flex items-center justify-center">

                <div className="flex items-center gap-3 text-gray-500">

                    <Loader2
                        size={24}
                        className="animate-spin"
                    />

                    <span className="text-sm">
                        Loading sites...
                    </span>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="px-6 py-5 border-b border-gray-200">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h1 className="text-2xl font-bold text-gray-900">

                                State Head Sites

                            </h1>

                            <p className="text-sm text-gray-500 mt-1">

                                Track vendor approved sites and manage State Head approval status.

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={fetchSites}
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-2.5
                                border
                                border-gray-200
                                rounded-lg
                                text-sm
                                font-medium
                                text-gray-700
                                hover:bg-gray-50
                                transition
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>

                </div>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 pb-4">


                    {/* ALL */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            p-4
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-gray-500 font-medium">
                                    Total Sites
                                </p>

                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {allCount}
                                </p>

                            </div>

                            <Building2
                                size={24}
                                className="text-gray-400"
                            />

                        </div>

                    </div>


                    {/* APPROVED */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-green-200
                            bg-green-50
                            p-4
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-green-600 font-medium">
                                    State Head Approved
                                </p>

                                <p className="text-2xl font-bold text-green-700 mt-1">
                                    {approvedCount}
                                </p>

                            </div>

                            <CheckCircle
                                size={24}
                                className="text-green-500"
                            />

                        </div>

                    </div>


                    {/* PENDING */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-yellow-200
                            bg-yellow-50
                            p-4
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-yellow-600 font-medium">
                                    Pending Approval
                                </p>

                                <p className="text-2xl font-bold text-yellow-700 mt-1">
                                    {pendingCount}
                                </p>

                            </div>

                            <Clock
                                size={24}
                                className="text-yellow-500"
                            />

                        </div>

                    </div>


                    {/* REJECTED */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs text-red-600 font-medium">
                                    State Head Rejected
                                </p>

                                <p className="text-2xl font-bold text-red-700 mt-1">
                                    {rejectedCount}
                                </p>

                            </div>

                            <XCircle
                                size={24}
                                className="text-red-500"
                            />

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* TABS */}
                {/* ================================================= */}

                <div className="px-6 pt-2 pb-5">

                    <div className="flex flex-wrap gap-2">

                        <TabButton
                            id="all"
                            label="All Sites"
                            count={allCount}
                            activeClass="
                                bg-gray-100
                                text-gray-900
                                border-gray-300
                            "
                        />

                        <TabButton
                            id="pending"
                            label="Pending"
                            count={pendingCount}
                            activeClass="
                                bg-yellow-50
                                text-yellow-700
                                border-yellow-200
                            "
                        />

                        <TabButton
                            id="approved"
                            label="Approved"
                            count={approvedCount}
                            activeClass="
                                bg-green-50
                                text-green-700
                                border-green-200
                            "
                        />

                        <TabButton
                            id="rejected"
                            label="Rejected"
                            count={rejectedCount}
                            activeClass="
                                bg-red-50
                                text-red-700
                                border-red-200
                            "
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div className="mx-6 mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">

                        <AlertCircle
                            size={20}
                            className="text-red-500 mt-0.5 shrink-0"
                        />

                        <div>

                            <p className="text-sm font-semibold text-red-700">
                                Something went wrong
                            </p>

                            <p className="text-sm text-red-600 mt-1">
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* SITES */}
                {/* ================================================= */}

                <div className="p-6 pt-2">

                    {filteredSites.length === 0 ? (

                        <div className="py-16 text-center border border-dashed border-gray-200 rounded-xl">

                            <Building2
                                size={50}
                                className="mx-auto text-gray-300 mb-4"
                            />

                            <h2 className="text-lg font-semibold text-gray-800">

                                No Sites Found

                            </h2>

                            <p className="text-sm text-gray-500 mt-1">

                                There are no sites in this category.

                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {filteredSites.map(
                                (item) => {

                                    const site =
                                        item?.site || {};

                                    const submission =
                                        item?.submission || {};

                                    const stateHeadStatus =
                                        getStateHeadStatus(item);

                                    const vendorStatus =
                                        item?.vendor_status ||
                                        "pending";


                                    return (

                                        <div
                                            key={
                                                item?._id ||
                                                submission?._id
                                            }
                                            className="
                                                border
                                                border-gray-200
                                                rounded-xl
                                                p-5
                                                hover:shadow-md
                                                transition
                                                bg-white
                                            "
                                        >

                                            {/* ================================================= */}
                                            {/* HEADER */}
                                            {/* ================================================= */}

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h3 className="font-bold text-lg text-gray-900 truncate">

                                                        {site?.site_code ||
                                                            "N/A"}

                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">

                                                        {site?.site_name ||
                                                            "Site name not available"}

                                                    </p>

                                                </div>


                                                <StatusBadge
                                                    status={
                                                        stateHeadStatus
                                                    }
                                                />

                                            </div>


                                            {/* ================================================= */}
                                            {/* VENDOR STATUS */}
                                            {/* ================================================= */}

                                            <div className="mt-4">

                                                <p className="text-xs text-gray-400">
                                                    Vendor Status
                                                </p>

                                                <div className="mt-1">

                                                    {vendorStatus ===
                                                        "approved" ? (

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-green-700
                                                        ">

                                                            <CheckCircle
                                                                size={14}
                                                            />

                                                            Vendor Approved

                                                        </span>

                                                    ) : vendorStatus ===
                                                        "rejected" ? (

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-red-700
                                                        ">

                                                            <XCircle
                                                                size={14}
                                                            />

                                                            Vendor Rejected

                                                        </span>

                                                    ) : (

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-yellow-700
                                                        ">

                                                            <Clock
                                                                size={14}
                                                            />

                                                            Vendor Pending

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* LOCATION */}
                                            {/* ================================================= */}

                                            <div className="mt-5 flex items-start gap-3">

                                                <MapPin
                                                    size={17}
                                                    className="text-gray-400 mt-0.5 shrink-0"
                                                />

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        Location
                                                    </p>

                                                    <p className="text-sm font-medium text-gray-800 mt-0.5">

                                                        {site?.location ||
                                                            site?.town ||
                                                            "-"}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* STATE */}
                                            {/* ================================================= */}

                                            <div className="mt-4 flex items-center gap-3">

                                                <MapPin
                                                    size={17}
                                                    className="text-gray-400 shrink-0"
                                                />

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        State
                                                    </p>

                                                    <p className="text-sm font-medium text-gray-800">
                                                        {site?.state || "-"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* ZONE */}
                                            {/* ================================================= */}

                                            <div className="mt-4 flex items-center gap-3">

                                                <Building2
                                                    size={17}
                                                    className="text-gray-400 shrink-0"
                                                />

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        Zone
                                                    </p>

                                                    <p className="text-sm font-medium text-gray-800">
                                                        {site?.zone || "-"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* UPLOADED BY */}
                                            {/* ================================================= */}

                                            <div className="mt-4 flex items-center gap-3">

                                                <User
                                                    size={17}
                                                    className="text-gray-400 shrink-0"
                                                />

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        Uploaded By
                                                    </p>

                                                    <p className="text-sm font-medium text-gray-800">

                                                        {submission
                                                            ?.uploaded_by
                                                            ?.name ||
                                                            item
                                                                ?.uploaded_by
                                                                ?.name ||
                                                            "-"}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* STATUS MESSAGE */}
                                            {/* ================================================= */}

                                            {stateHeadStatus ===
                                                "pending" && (

                                                <div className="mt-5 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">

                                                    <div className="flex items-start gap-2">

                                                        <Clock
                                                            size={17}
                                                            className="text-yellow-600 mt-0.5 shrink-0"
                                                        />

                                                        <div>

                                                            <p className="text-sm text-yellow-700 font-semibold">

                                                                Waiting for State Head approval

                                                            </p>

                                                            {vendorStatus ===
                                                                "approved" && (

                                                                <p className="text-xs text-yellow-600 mt-1">

                                                                    Vendor has approved this site.

                                                                </p>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {stateHeadStatus ===
                                                "approved" && (

                                                <div className="mt-5 p-3 bg-green-50 border border-green-100 rounded-lg">

                                                    <div className="flex items-start gap-2">

                                                        <CheckCircle
                                                            size={17}
                                                            className="text-green-600 mt-0.5 shrink-0"
                                                        />

                                                        <div>

                                                            <p className="text-sm text-green-700 font-semibold">

                                                                State Head approved

                                                            </p>

                                                            <p className="text-xs text-green-600 mt-1">

                                                                This site has been approved by the State Head.

                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {stateHeadStatus ===
                                                "rejected" && (

                                                <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-lg">

                                                    <div className="flex items-start gap-2">

                                                        <XCircle
                                                            size={17}
                                                            className="text-red-600 mt-0.5 shrink-0"
                                                        />

                                                        <div className="min-w-0">

                                                            <p className="text-sm text-red-700 font-semibold">

                                                                Rejected by State Head

                                                            </p>


                                                            {(item?.state_head_remarks ||
                                                                submission?.state_head_remarks ||
                                                                submission?.remarks) && (

                                                                <>

                                                                    <p className="text-xs text-red-500 font-semibold mt-2">

                                                                        Rejection Reason

                                                                    </p>

                                                                    <p className="text-sm text-red-700 mt-1">

                                                                        {item?.state_head_remarks ||
                                                                            submission?.state_head_remarks ||
                                                                            submission?.remarks}

                                                                    </p>

                                                                </>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            )}


                                            {/* ================================================= */}
                                            {/* DATE */}
                                            {/* ================================================= */}

                                            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        Updated
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">

                                                        {submission?.updatedAt ||
                                                            item?.updatedAt

                                                            ? new Date(
                                                                submission?.updatedAt ||
                                                                item?.updatedAt
                                                            ).toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )

                                                            : "-"

                                                        }

                                                    </p>

                                                </div>


                                                <ChevronRight
                                                    size={18}
                                                    className="text-gray-400 shrink-0"
                                                />

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};


export default StateHeadSiteStatus;
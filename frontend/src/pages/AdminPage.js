import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Pencil,
  Check,
  X,
  Ban,
  AlertTriangle,
  UserCheck,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Search,
  Package,
  LogOut,
  ChevronDown,
  FileText,
  Shield,
} from "lucide-react";
import AlertDialog from "../components/AlertDialog";
import AdminService from "../services/adminService";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState({ users: [], disputes: [], policies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "",
    onConfirm: () => {},
  });
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [verificationDialog, setVerificationDialog] = useState({
    isOpen: false,
    userId: null,
    documentData: null,
  });

  useEffect(() => {
    // Check if user is logged in as admin and has admin privileges
    if (!AdminService.isAdminLoggedIn() || !AdminService.hasAdminPrivileges()) {
      navigate("/admin/login");
      return;
    }

    fetchData();
  }, [activeTab, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let newData = {};

      switch (activeTab) {
        case "users":
          newData.users = await AdminService.getUsers();
          try {
            // Try to fetch verifications, but don't let it block the main user data
            const verifications = await AdminService.getPendingVerifications();
            setPendingVerifications(verifications);
          } catch (verificationError) {
            console.log("Verification system not yet implemented");
            setPendingVerifications([]);
          }
          break;
        case "disputes":
          newData.disputes = await AdminService.getDisputes();
          break;
        case "policies":
          newData.policies = await AdminService.getPolicies();
          break;
        default:
          break;
      }

      setData((prevData) => ({ ...prevData, ...newData }));
    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
      if (err.response?.status === 401) {
        AdminService.logout();
        navigate("/admin/login");
        return;
      }
      setError(err.message || `Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = data.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showAlert = (title, message, type, onConfirm) => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setAlertDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeAlert = () => {
    setAlertDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleUserAction = async (userId, action) => {
    const actionMessages = {
      ban: {
        title: "Ban User",
        message:
          "Are you sure you want to ban this user? This action will prevent them from accessing the platform.",
        type: "danger",
      },
      suspend: {
        title: "Suspend User",
        message:
          "Are you sure you want to suspend this user? They will be temporarily blocked from using the platform.",
        type: "warning",
      },
      activate: {
        title: "Activate User",
        message:
          "Are you sure you want to activate this user? They will regain full access to the platform.",
        type: "info",
      },
    };

    const { title, message, type } = actionMessages[action];

    showAlert(title, message, type, async () => {
      try {
        await AdminService.updateUserStatus(userId, action);
        setData((prevData) => ({
          ...prevData,
          users: prevData.users.map((user) =>
            user.id === userId
              ? { ...user, status: action === "suspend" ? "suspended" : action }
              : user
          ),
        }));
      } catch (err) {
        setError(err.message);
        console.error("Error updating user status:", err);
      }
    });
  };

  const handleDeleteListing = async (userId, listingId) => {
    try {
      await AdminService.deleteUserListing(userId, listingId);
      setData((prevData) => ({
        ...prevData,
        users: prevData.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                listings: user.listings.filter(
                  (listing) => listing.id !== listingId
                ),
              }
            : user
        ),
      }));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting listing:", err);
    }
  };

  const handleResolveDispute = async (disputeId, resolution) => {
    try {
      await AdminService.resolveDispute(disputeId, resolution);
      setData((prevData) => ({
        ...prevData,
        disputes: prevData.disputes.map((dispute) =>
          dispute.id === disputeId
            ? { ...dispute, status: "resolved", resolution }
            : dispute
        ),
      }));
    } catch (err) {
      setError(err.message);
      console.error("Error resolving dispute:", err);
    }
  };

  const handleUpdatePolicy = async (policyId, value) => {
    try {
      await AdminService.updatePolicy(policyId, value);
      setData((prevData) => ({
        ...prevData,
        policies: prevData.policies.map((policy) =>
          policy.id === policyId ? { ...policy, value } : policy
        ),
      }));
      setEditingPolicy(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating policy:", err);
    }
  };

  const handleLogout = () => {
    AdminService.logout();
    navigate("/admin/login");
  };

  const handleViewDocument = async (userId) => {
    try {
      const documentData = await AdminService.getDocumentFile(userId);
      setVerificationDialog({
        isOpen: true,
        userId,
        documentData,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyDocument = async (userId, isApproved, reason = "") => {
    try {
      await AdminService.verifyDocument(userId, isApproved, reason);
      setPendingVerifications((prev) =>
        prev.filter((v) => v.userId !== userId)
      );
      fetchData();
      setVerificationDialog({
        isOpen: false,
        userId: null,
        documentData: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header
        shadow={true}
        className="text-black !fixed bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--buttonColor)]"
      />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl pt-20 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["users", "disputes", "policies"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? "border-[var(--iconColor)] text-[var(--iconColor)]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="Search users by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Pending Verifications Section */}
              {pendingVerifications.length > 0 && (
                <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800 mb-4">
                    Pending Document Verifications (
                    {pendingVerifications.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingVerifications.map((verification) => (
                      <div
                        key={verification.userId}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-medium">{verification.userName}</p>
                          <p className="text-sm text-gray-500">
                            Document Type: {verification.documentType}
                          </p>
                          <p className="text-sm text-gray-500">
                            Document Number: {verification.documentNumber}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleViewDocument(verification.userId)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                          >
                            <FileText className="w-4 h-4" />
                            View Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 sm:p-6 border-b border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.name}
                          </h3>
                          {user.isDocumentVerified && (
                            <Shield
                              className="w-4 h-4 text-green-600"
                              title="Verified User"
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={`capitalize ${
                              user.status === "banned"
                                ? "text-red-600"
                                : user.status === "suspended"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUserAction(user.id, "ban")}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          <Ban className="w-4 h-4" />
                          <span className="hidden sm:inline">Ban</span>
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, "suspend")}
                          className="inline-flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span className="hidden sm:inline">Suspend</span>
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, "activate")}
                          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span className="hidden sm:inline">Activate</span>
                        </button>
                      </div>
                    </div>

                    {/* User's Listings */}
                    {user.listings && user.listings.length > 0 && (
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            setExpandedUserId(
                              expandedUserId === user.id ? null : user.id
                            )
                          }
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Listings ({user.listings.length})
                          </h4>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                              expandedUserId === user.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {expandedUserId === user.id && (
                          <div className="space-y-2 mt-2">
                            {user.listings.map((listing) => (
                              <div
                                key={listing.id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded"
                              >
                                <div
                                  onClick={() =>
                                    navigate(`/item?id=${listing.id}`)
                                  }
                                  className="flex-1 cursor-pointer hover:text-[var(--buttonColor)] transition-colors"
                                >
                                  <span className="text-sm">
                                    {listing.title}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>${listing.price}</span>
                                    <span>•</span>
                                    <span>{listing.condition}</span>
                                    <span>•</span>
                                    <span>{listing.location}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteListing(user.id, listing.id)
                                  }
                                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disputes Tab */}
          {activeTab === "disputes" && (
            <div className="bg-white rounded-lg shadow">
              {data.disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="p-4 sm:p-6 border-b border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Dispute #{dispute.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm inline-flex items-center gap-2 w-fit ${
                            dispute.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {dispute.status === "resolved" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          {dispute.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Reported by: {dispute.reportedBy}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {dispute.createdAt}
                      </p>
                      <p className="mt-2 text-gray-700">
                        {dispute.description}
                      </p>
                      {dispute.resolution && (
                        <p className="mt-2 text-sm text-gray-500">
                          Resolution:{" "}
                          <span className="capitalize">
                            {dispute.resolution}
                          </span>
                        </p>
                      )}
                    </div>
                    {dispute.status !== "resolved" && (
                      <div className="flex sm:flex-col gap-2 sm:ml-6">
                        <button
                          onClick={() =>
                            handleResolveDispute(dispute.id, "upheld")
                          }
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="hidden sm:inline">Uphold</span>
                        </button>
                        <button
                          onClick={() =>
                            handleResolveDispute(dispute.id, "rejected")
                          }
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "policies" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Global Policy Settings
                </h2>
                <div className="space-y-4">
                  {data.policies.map((policy) => {
                    // Map policy names to user-friendly titles and descriptions
                    const policyInfo = {
                      minItemPrice: {
                        title: "Minimum Item Price",
                        description:
                          "The minimum price that can be set for any item listing",
                        prefix: "৳",
                      },
                      maxPriceUnverified: {
                        title: "Maximum Price for Unverified Users",
                        description:
                          "Maximum price limit for users who haven't verified their government documents",
                        prefix: "৳",
                      },
                      maxActiveListings: {
                        title: "Maximum Active Listings per User",
                        description:
                          "Maximum number of active item listings allowed per user",
                        prefix: "",
                      },
                    };

                    const info = policyInfo[policy.name] || {
                      title: policy.name,
                      description: "Policy setting",
                      prefix: "",
                    };

                    return (
                      <div
                        key={policy.id}
                        className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 transition-all hover:shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-grow">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">
                              {info.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {info.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Last updated:{" "}
                              {new Date(policy.updatedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            {editingPolicy === policy.id ? (
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  {info.prefix && (
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                      {info.prefix}
                                    </span>
                                  )}
                                  <input
                                    type="number"
                                    value={policy.value}
                                    onChange={(e) =>
                                      setData((prevData) => ({
                                        ...prevData,
                                        policies: prevData.policies.map((p) =>
                                          p.id === policy.id
                                            ? { ...p, value: e.target.value }
                                            : p
                                        ),
                                      }))
                                    }
                                    className={`w-32 p-2 text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                                      info.prefix ? "pl-7" : "pl-3"
                                    }`}
                                    min="0"
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    handleUpdatePolicy(
                                      policy.id,
                                      Number(policy.value)
                                    )
                                  }
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                                  title="Save"
                                >
                                  <Check className="w-5 h-5 stroke-[1.5]" />
                                </button>
                                <button
                                  onClick={() => setEditingPolicy(null)}
                                  className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-5 h-5 stroke-[1.5]" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className="text-base sm:text-lg font-semibold text-gray-700 min-w-[80px] text-right">
                                  {info.prefix}
                                  {policy.value}
                                </span>
                                <button
                                  onClick={() => setEditingPolicy(policy.id)}
                                  className="p-2 text-[var(--iconColor)] hover:text-teal-700 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        onConfirm={alertDialog.onConfirm}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
      {/* Document Verification Dialog */}
      {verificationDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Verify Document</h3>
                <button
                  onClick={() =>
                    setVerificationDialog({
                      isOpen: false,
                      userId: null,
                      documentData: null,
                    })
                  }
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Preview */}
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(verificationDialog.documentData)}
                  alt="Document"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    handleVerifyDocument(
                      verificationDialog.userId,
                      false,
                      "Document rejected"
                    )
                  }
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    handleVerifyDocument(verificationDialog.userId, true)
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;

import React, { useState } from "react";
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
} from "lucide-react";
import AlertDialog from "../components/AlertDialog";

// Demo data
const DEMO_USERS = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    status: "active",
    listings: [
      { id: 1, title: "iPhone 13 Pro" },
      { id: 2, title: "MacBook Air M1" },
    ],
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    status: "suspended",
    listings: [{ id: 3, title: "Gaming Chair" }],
  },
  {
    id: 3,
    username: "mike_wilson",
    email: "mike@example.com",
    status: "active",
    listings: [],
  },
];

const DEMO_DISPUTES = [
  {
    id: "DISP001",
    reportedBy: "jane_smith",
    status: "pending",
    description: "Item received was not as described in the listing",
    createdAt: "2024-03-15",
  },
  {
    id: "DISP002",
    reportedBy: "mike_wilson",
    status: "pending",
    description: "Seller not responding to messages",
    createdAt: "2024-03-16",
  },
  {
    id: "DISP003",
    reportedBy: "john_doe",
    status: "resolved",
    description: "Payment issue with transaction",
    resolution: "upheld",
    createdAt: "2024-03-14",
  },
];

const DEMO_POLICIES = [
  {
    id: 1,
    policyName: "Maximum Listing Price (Unverified Users)",
    value: 10000,
    updatedAt: "2024-03-15",
  },
  {
    id: 2,
    policyName: "Minimum Listing Price",
    value: 100,
    updatedAt: "2024-03-14",
  },
  {
    id: 3,
    policyName: "Maximum Active Listings Per User",
    value: 50,
    updatedAt: "2024-03-16",
  },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(DEMO_USERS);
  const [disputes, setDisputes] = useState(DEMO_DISPUTES);
  const [policies, setPolicies] = useState(DEMO_POLICIES);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    onConfirm: () => {},
  });

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleUserAction = (userId, action) => {
    const actionMessages = {
      ban: {
        title: "Ban User",
        message:
          "Are you sure you want to ban this user? This action will prevent them from accessing the platform.",
        type: "danger",
      },
      suspended: {
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

    showAlert(title, message, type, () => {
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              status: action === "activate" ? "active" : action,
            };
          }
          return user;
        })
      );
    });
  };

  const handleDeleteListing = (userId, listingId) => {
    showAlert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      "danger",
      () => {
        setUsers(
          users.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                listings: user.listings.filter(
                  (listing) => listing.id !== listingId
                ),
              };
            }
            return user;
          })
        );
      }
    );
  };

  const handleResolveDispute = (disputeId, resolution) => {
    const resolutionMessages = {
      upheld: {
        title: "Uphold Dispute",
        message:
          "Are you sure you want to uphold this dispute? This will favor the reporter's claim.",
        type: "warning",
      },
      rejected: {
        title: "Reject Dispute",
        message:
          "Are you sure you want to reject this dispute? This will dismiss the reporter's claim.",
        type: "danger",
      },
    };

    const { title, message, type } = resolutionMessages[resolution];

    showAlert(title, message, type, () => {
      setDisputes(
        disputes.map((dispute) =>
          dispute.id === disputeId
            ? { ...dispute, status: "resolved", resolution }
            : dispute
        )
      );
    });
  };

  const handlePolicyUpdate = (policyId, newValue) => {
    if (newValue < 0) return;
    setPolicies(
      policies.map((policy) =>
        policy.id === policyId
          ? {
              ...policy,
              value: Number(newValue),
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : policy
      )
    );
    setEditingPolicy(null);
  };

  return (
    <>
      <Header
        shadow={true}
        className="text-black !fixed bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--buttonColor)]"
      />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl pt-20 mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Dashboard
          </h1>

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

              <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 sm:p-6 border-b border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.username}
                        </h3>
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
                          onClick={() => handleUserAction(user.id, "suspended")}
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
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Listings ({user.listings.length})
                        </h4>
                        <div className="space-y-2">
                          {user.listings.map((listing) => (
                            <div
                              key={listing.id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded"
                            >
                              <span className="text-sm text-gray-600">
                                {listing.title}
                              </span>
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
              {disputes.map((dispute) => (
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
                  {policies.map((policy) => (
                    <div
                      key={policy.id}
                      className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-grow">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900">
                            {policy.policyName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Last updated: {policy.updatedAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {editingPolicy === policy.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={policy.value}
                                onChange={(e) =>
                                  setPolicies(
                                    policies.map((p) =>
                                      p.id === policy.id
                                        ? { ...p, value: e.target.value }
                                        : p
                                    )
                                  )
                                }
                                className="w-24 sm:w-32 p-2 text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                              />
                              <button
                                onClick={() =>
                                  handlePolicyUpdate(policy.id, policy.value)
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
                              <span className="text-base sm:text-lg font-semibold text-gray-700 min-w-[60px] text-right">
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
                  ))}
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
    </>
  );
};

export default AdminPage;

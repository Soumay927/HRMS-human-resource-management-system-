import { useEffect, useState } from "react";
import axiosInstance from"../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

function LeaveManagement() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaves, setLeaves] = useState([]);

  const [leaveForm, setLeaveForm] = useState({
    Employee: "",
    LeaveType: "",
    FromDate: "",
    ToDate: "",
    Days: 1,
    Reason: ""
  });

  const loadLeaves = async () => {
  try {
    const response = await axiosInstance.get("/leaves");

    setLeaves(
      Array.isArray(response.data)
        ? response.data
        : []
    );
  } catch (error) {
    console.log(error);
    alert("Failed to load leaves");
  }
};

  useEffect(() => {
    loadLeaves();
  }, []);

  const applyLeave = async () => {
  if (
    leaveForm.Employee === "" ||
    leaveForm.LeaveType === "" ||
    leaveForm.FromDate === "" ||
    leaveForm.ToDate === ""
  ) {
    alert("Please fill required fields");
    return;
  }

  try {
    const response = await axiosInstance.post(
      "/leaves",
      {
        Employee: leaveForm.Employee,
        LeaveType: leaveForm.LeaveType,
        FromDate: leaveForm.FromDate,
        ToDate: leaveForm.ToDate,
        Days: Number(leaveForm.Days || 1),
        Reason: leaveForm.Reason
      }
    );

    await loadLeaves();

    setLeaveForm({
      Employee: "",
      LeaveType: "",
      FromDate: "",
      ToDate: "",
      Days: 1,
      Reason: ""
    });

    setShowModal(false);

    alert(
      response.data?.Message ||
      "Leave Applied Successfully"
    );
  } catch (error) {
    console.log(error);
    alert("Leave Apply Failed");
  }
};

  const approveLeave = async (id) => {
  try {
    await axiosInstance.put(
      `/leaves/${id}/approve`
    );

    await loadLeaves();

    alert("Leave Approved");
  } catch (error) {
    console.log(error);
    alert("Approve Failed");
  }
};

  const rejectLeave = async (id) => {
  try {
    await axiosInstance.put(
      `/leaves/${id}/reject`
    );

    await loadLeaves();

    alert("Leave Rejected");
  } catch (error) {
    console.log(error);
    alert("Reject Failed");
  }
};

  const deleteLeave = async (id) => {
  try {
    await axiosInstance.delete(
      `/leaves/${id}`
    );

    await loadLeaves();

    alert("Leave Deleted");
  } catch (error) {
    console.log(error);
    alert("Delete Failed");
  }
};

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">
              Leave Management
            </h2>

            <p className="text-muted mb-0">
              Manage employee leave requests, approvals and leave balance.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card dashboard-card blue-card">
                <div className="card-body">
                  <h5>Total Requests</h5>

                  <h2 className="fw-bold">
                    {leaves.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card green-card">
                <div className="card-body">
                  <h5>Approved Leaves</h5>

                  <h2 className="fw-bold">
                    {
                      leaves.filter(
                        (leave) => leave.Status === "Approved"
                      ).length
                    }
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card orange-card">
                <div className="card-body">
                  <h5>Pending Requests</h5>

                  <h2 className="fw-bold">
                    {
                      leaves.filter(
                        (leave) => leave.Status === "Pending"
                      ).length
                    }
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Leave Requests
              </h4>

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                + Apply Leave
              </button>
            </div>

            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.LeaveId}>
                    <td>{leave.Employee}</td>

                    <td>{leave.LeaveType}</td>

                    <td>{leave.FromDate}</td>

                    <td>{leave.ToDate}</td>

                    <td>{leave.Days}</td>

                    <td>
                      <span
                        className={
                          leave.Status === "Approved"
                            ? "badge bg-success"
                            : leave.Status === "Rejected"
                            ? "badge bg-danger"
                            : "badge bg-warning"
                        }
                      >
                        {leave.Status}
                      </span>
                    </td>

                    <td>
                      {leave.Status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              approveLeave(leave.LeaveId)
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() =>
                              rejectLeave(leave.LeaveId)
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => setSelectedLeave(leave)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteLeave(leave.LeaveId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {leaves.length === 0 && (
              <div className="text-center mt-4">
                <h5 className="text-muted">
                  No leave requests found
                </h5>
              </div>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="leave-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">
                    Apply Leave
                  </h4>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    X
                  </button>
                </div>

                <label className="form-label">
                  Employee Name
                </label>

                <input
                  className="form-control mb-3"
                  value={leaveForm.Employee}
                  placeholder="Enter employee name"
                  onChange={(e) =>
                    setLeaveForm({
                      ...leaveForm,
                      Employee: e.target.value
                    })
                  }
                />

                <label className="form-label">
                  Leave Type
                </label>

                <select
                  className="form-control mb-3"
                  value={leaveForm.LeaveType}
                  onChange={(e) =>
                    setLeaveForm({
                      ...leaveForm,
                      LeaveType: e.target.value
                    })
                  }
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">
                      From Date
                    </label>

                    <input
                      type="date"
                      className="form-control mb-3"
                      value={leaveForm.FromDate}
                      onChange={(e) =>
                        setLeaveForm({
                          ...leaveForm,
                          FromDate: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      To Date
                    </label>

                    <input
                      type="date"
                      className="form-control mb-3"
                      value={leaveForm.ToDate}
                      onChange={(e) =>
                        setLeaveForm({
                          ...leaveForm,
                          ToDate: e.target.value
                        })
                      }
                    />
                  </div>
                </div>

                <label className="form-label">
                  Days
                </label>

                <input
                  type="number"
                  className="form-control mb-3"
                  value={leaveForm.Days}
                  onChange={(e) =>
                    setLeaveForm({
                      ...leaveForm,
                      Days: Number(e.target.value)
                    })
                  }
                />

                <label className="form-label">
                  Reason
                </label>

                <textarea
                  className="form-control mb-3"
                  rows="3"
                  value={leaveForm.Reason}
                  placeholder="Enter leave reason"
                  onChange={(e) =>
                    setLeaveForm({
                      ...leaveForm,
                      Reason: e.target.value
                    })
                  }
                />

                <button
                  className="btn btn-primary w-100"
                  onClick={applyLeave}
                >
                  Submit Leave Request
                </button>
              </div>
            </div>
          )}

          {selectedLeave && (
            <div className="modal-overlay">
              <div className="leave-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">
                    Leave Details
                  </h4>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setSelectedLeave(null)}
                  >
                    X
                  </button>
                </div>

                <p>
                  <strong>Employee:</strong>{" "}
                  {selectedLeave.Employee}
                </p>

                <p>
                  <strong>Leave Type:</strong>{" "}
                  {selectedLeave.LeaveType}
                </p>

                <p>
                  <strong>From Date:</strong>{" "}
                  {selectedLeave.FromDate}
                </p>

                <p>
                  <strong>To Date:</strong>{" "}
                  {selectedLeave.ToDate}
                </p>

                <p>
                  <strong>Total Days:</strong>{" "}
                  {selectedLeave.Days}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {selectedLeave.Reason}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedLeave.Status === "Approved"
                        ? "badge bg-success"
                        : selectedLeave.Status === "Rejected"
                        ? "badge bg-danger"
                        : "badge bg-warning"
                    }
                  >
                    {selectedLeave.Status}
                  </span>
                </p>

                <button
                  className="btn btn-secondary w-100 mt-3"
                  onClick={() => setSelectedLeave(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LeaveManagement;
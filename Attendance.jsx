import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import axiosInstance from "../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

const initialAttendanceForm = {
  Employee: "",
  Date: "",
  Status: "",
  CheckIn: "",
  CheckOut: ""
};

const normalizeAttendance = (item) => ({
  attendanceId:
    item.attendanceId ??
    item.AttendanceId ??
    0,

  employee:
    item.employee ||
    item.Employee ||
    "",

  date:
    item.date ||
    item.Date ||
    "",

  status:
    item.status ||
    item.Status ||
    "",

  checkIn:
    item.checkIn ||
    item.CheckIn ||
    "-",

  checkOut:
    item.checkOut ||
    item.CheckOut ||
    "-"
});

function Attendance() {
  const [showModal, setShowModal] =
    useState(false);

  const [
    selectedAttendance,
    setSelectedAttendance
  ] = useState(null);

  const [
    attendanceList,
    setAttendanceList
  ] = useState([]);

  const [
    attendanceForm,
    setAttendanceForm
  ] = useState(initialAttendanceForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  /*
   * Attendance API se records load karega.
   */
  const loadAttendance =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await axiosInstance.get(
            "/attendance"
          );

        console.log(
          "Attendance API response:",
          response.data
        );

        const data =
          Array.isArray(response.data)
            ? response.data
            : [];

        setAttendanceList(
          data.map(normalizeAttendance)
        );
      } catch (error) {
        console.error(
          "Attendance load error:",
          error
        );

        console.error(
          "Attendance status:",
          error.response?.status
        );

        console.error(
          "Attendance response:",
          error.response?.data
        );

        setAttendanceList([]);

        const status =
          error.response?.status;

        if (!error.response) {
          setErrorMessage(
            "Attendance API connect nahi ho rahi. Backend API, port aur CORS check karo."
          );
        } else if (status === 401) {
          setErrorMessage(
            "Authentication token missing, invalid ya expired hai. Dobara login karo."
          );
        } else if (status === 403) {
          setErrorMessage(
            "Current user ko Attendance access karne ki permission nahi hai."
          );
        } else if (status === 404) {
          setErrorMessage(
            "Attendance API route nahi mila."
          );
        } else {
          setErrorMessage(
            error.response?.data?.Message ||
              error.response?.data?.message ||
              error.response?.data?.Error ||
              `Attendance load failed. Status: ${status}`
          );
        }
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const presentCount =
    useMemo(() => {
      return attendanceList.filter(
        (item) =>
          String(item.status)
            .trim()
            .toLowerCase() ===
          "present"
      ).length;
    }, [attendanceList]);

  const absentCount =
    useMemo(() => {
      return attendanceList.filter(
        (item) =>
          String(item.status)
            .trim()
            .toLowerCase() ===
          "absent"
      ).length;
    }, [attendanceList]);

  const lateCount =
    useMemo(() => {
      return attendanceList.filter(
        (item) =>
          String(item.status)
            .trim()
            .toLowerCase() ===
          "late"
      ).length;
    }, [attendanceList]);

 const updateAttendanceField = (
  fieldName,
  fieldValue
) => {
  setAttendanceForm(
    (currentForm) => ({
      ...currentForm,
      fieldValue
    })
  );

  setErrorMessage("");
};



  const openAttendanceModal = () => {
    setAttendanceForm({
      ...initialAttendanceForm
    });

    setErrorMessage("");
    setShowModal(true);
  };

  const closeAttendanceModal = () => {
    if (saving) {
      return;
    }

    setAttendanceForm({
      ...initialAttendanceForm
    });

    setShowModal(false);
  };

  /*
   * Attendance API mein save karega.
   */
  const markAttendance = async (
    event
  ) => {
    event.preventDefault();

    const employeeName =
      attendanceForm.Employee.trim();

    const attendanceDate =
      attendanceForm.Date;

    const attendanceStatus =
      attendanceForm.Status;

    if (!employeeName) {
      setErrorMessage(
        "Employee Name enter karo."
      );

      return;
    }

    if (!attendanceDate) {
      setErrorMessage(
        "Attendance Date select karo."
      );

      return;
    }

    if (!attendanceStatus) {
      setErrorMessage(
        "Attendance Status select karo."
      );

      return;
    }

    const requestData = {
      AttendanceId: 0,

      Employee:
        employeeName,

      Date:
        attendanceDate,

      Status:
        attendanceStatus,

      CheckIn:
        attendanceStatus === "Absent"
          ? "-"
          : attendanceForm.CheckIn ||
            "-",

      CheckOut:
        attendanceStatus === "Absent"
          ? "-"
          : attendanceForm.CheckOut ||
            "-"
    };

    try {
      setSaving(true);
      setErrorMessage("");

      const response =
        await axiosInstance.post(
          "/attendance",
          requestData
        );

      console.log(
        "Attendance save response:",
        response.data
      );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Attendance Marked Successfully"
      );

      setAttendanceForm({
        ...initialAttendanceForm
      });

      setShowModal(false);

      /*
       * API se fresh list reload karo.
       */
      await loadAttendance();
    } catch (error) {
      console.error(
        "Attendance save error:",
        error
      );

      const status =
        error.response?.status;

      let message =
        "Attendance save failed.";

      if (!error.response) {
        message =
          "Attendance API connect nahi ho rahi.";
      } else if (status === 401) {
        message =
          "Session invalid ya expired hai. Dobara login karo.";
      } else if (status === 403) {
        message =
          "Current user ko attendance mark karne ki permission nahi hai.";
      } else if (
        typeof error.response.data ===
        "string"
      ) {
        message =
          error.response.data;
      } else {
        message =
          error.response?.data?.Message ||
          error.response?.data?.message ||
          error.response?.data?.Error ||
          `Attendance save failed. Status: ${status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  /*
   * Attendance API se delete karega.
   */
  const deleteAttendance = async (
    attendanceId
  ) => {
    const numericAttendanceId =
      Number(attendanceId);

    if (
      Number.isNaN(
        numericAttendanceId
      ) ||
      numericAttendanceId <= 0
    ) {
      alert(
        "Valid Attendance ID nahi mila."
      );

      return;
    }

    const shouldDelete =
      window.confirm(
        "Do you want to delete this attendance record?"
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(
        numericAttendanceId
      );

      setErrorMessage("");

      const response =
        await axiosInstance.delete(
          `/attendance/${numericAttendanceId}`
        );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Attendance Deleted Successfully"
      );

      if (
        selectedAttendance
          ?.attendanceId ===
        numericAttendanceId
      ) {
        setSelectedAttendance(null);
      }

      await loadAttendance();
    } catch (error) {
      console.error(
        "Attendance delete error:",
        error
      );

      const status =
        error.response?.status;

      let message =
        "Attendance delete failed.";

      if (!error.response) {
        message =
          "Attendance API connect nahi ho rahi.";
      } else if (status === 401) {
        message =
          "Session invalid ya expired hai.";
      } else if (status === 403) {
        message =
          "Current user ko attendance delete karne ki permission nahi hai.";
      } else {
        message =
          error.response?.data?.Message ||
          error.response?.data?.message ||
          error.response?.data?.Error ||
          `Attendance delete failed. Status: ${status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <main className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">
              Attendance Management
            </h2>

            <p className="text-muted mb-0">
              Track employee attendance,
              working hours and daily status.
            </p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card dashboard-card blue-card h-100">
                <div className="card-body">
                  <h5>
                    Present Today
                  </h5>

                  <h2 className="fw-bold">
                    {presentCount}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card green-card h-100">
                <div className="card-body">
                  <h5>
                    Absent Today
                  </h5>

                  <h2 className="fw-bold">
                    {absentCount}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card orange-card h-100">
                <div className="card-body">
                  <h5>
                    Late Check-ins
                  </h5>

                  <h2 className="fw-bold">
                    {lateCount}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Attendance Records
              </h4>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={
                    loadAttendance
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : "Refresh"}
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    openAttendanceModal
                  }
                >
                  + Mark Attendance
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <h5 className="text-muted">
                  Attendance records
                  loading...
                </h5>
              </div>
            ) : attendanceList.length ===
              0 ? (
              <div className="text-center py-5">
                <h5 className="text-muted">
                  No attendance records
                  found
                </h5>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendanceList.map(
                      (item, index) => (
                        <tr
                          key={
                            item.attendanceId ||
                            index
                          }
                        >
                          <td>
                            {item.employee}
                          </td>

                          <td>
                            {item.date}
                          </td>

                          <td>
                            <span
                              className={
                                item.status ===
                                "Present"
                                  ? "badge bg-success"
                                  : item.status ===
                                    "Absent"
                                  ? "badge bg-danger"
                                  : "badge bg-warning text-dark"
                              }
                            >
                              {item.status}
                            </span>
                          </td>

                          <td>
                            {item.checkIn}
                          </td>

                          <td>
                            {item.checkOut}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm me-2"
                              onClick={() =>
                                setSelectedAttendance(
                                  item
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteAttendance(
                                  item.attendanceId
                                )
                              }
                              disabled={
                                deletingId ===
                                item.attendanceId
                              }
                            >
                              {deletingId ===
                              item.attendanceId
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="leave-modal">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Mark Attendance
              </h4>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={
                  closeAttendanceModal
                }
                disabled={saving}
              >
                X
              </button>
            </div>

            <form
              onSubmit={
                markAttendance
              }
            >
              <label className="form-label">
                Employee Name
              </label>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter employee name"
                value={
                  attendanceForm.Employee
                }
                onChange={(event) =>
                  updateAttendanceField(
                    "Employee",
                    event.target.value
                  )
                }
                disabled={saving}
                required
              />

              <label className="form-label">
                Date
              </label>

              <input
                type="date"
                className="form-control mb-3"
                value={
                  attendanceForm.Date
                }
                onChange={(event) =>
                  updateAttendanceField(
                    "Date",
                    event.target.value
                  )
                }
                disabled={saving}
                required
              />

              <label className="form-label">
                Status
              </label>

              <select
                className="form-control mb-3"
                value={
                  attendanceForm.Status
                }
                onChange={(event) => {
                  const newStatus =
                    event.target.value;

                  setAttendanceForm(
                    (currentForm) => ({
                      ...currentForm,

                      Status:
                        newStatus,

                      CheckIn:
                        newStatus ===
                        "Absent"
                          ? ""
                          : currentForm.CheckIn,

                      CheckOut:
                        newStatus ===
                        "Absent"
                          ? ""
                          : currentForm.CheckOut
                    })
                  );
                }}
                disabled={saving}
                required
              >
                <option value="">
                  Select Status
                </option>

                <option value="Present">
                  Present
                </option>

                <option value="Absent">
                  Absent
                </option>

                <option value="Late">
                  Late
                </option>
              </select>

              {attendanceForm.Status !==
                "Absent" && (
                <>
                  <label className="form-label">
                    Check In
                  </label>

                  <input
                    type="time"
                    className="form-control mb-3"
                    value={
                      attendanceForm.CheckIn
                    }
                    onChange={(event) =>
                      updateAttendanceField(
                        "CheckIn",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />

                  <label className="form-label">
                    Check Out
                  </label>

                  <input
                    type="time"
                    className="form-control mb-3"
                    value={
                      attendanceForm.CheckOut
                    }
                    onChange={(event) =>
                      updateAttendanceField(
                        "CheckOut",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Attendance"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedAttendance && (
        <div className="modal-overlay">
          <div className="leave-modal">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Attendance Details
              </h4>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() =>
                  setSelectedAttendance(
                    null
                  )
                }
              >
                X
              </button>
            </div>

            <p>
              <strong>
                Employee:
              </strong>{" "}
              {selectedAttendance.employee}
            </p>

            <p>
              <strong>
                Date:
              </strong>{" "}
              {selectedAttendance.date}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {selectedAttendance.status}
            </p>

            <p>
              <strong>
                Check In:
              </strong>{" "}
              {selectedAttendance.checkIn}
            </p>

            <p>
              <strong>
                Check Out:
              </strong>{" "}
              {selectedAttendance.checkOut}
            </p>

            <button
              type="button"
              className="btn btn-secondary w-100 mt-3"
              onClick={() =>
                setSelectedAttendance(
                  null
                )
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Attendance;
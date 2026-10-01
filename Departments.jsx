import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import axiosInstance from "../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

import {
  FaBuilding,
  FaTrash,
  FaSyncAlt
} from "react-icons/fa";

const normalizeDepartment = (department) => {
  return {
    id:
      department.departmentId ??
      department.DepartmentId ??
      0,

    mongoId:
      department.id ||
      department.Id ||
      "",

    name:
      department.departmentName ||
      department.DepartmentName ||
      "",

    description:
      department.description ||
      department.Description ||
      "",

    status:
      department.status ||
      department.Status ||
      "Active"
  };
};

const getLoggedInUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem("authUser");

    return storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch (error) {
    console.error(
      "Auth user parse error:",
      error
    );

    return {};
  }
};

function Departments() {
  const [showModal, setShowModal] =
    useState(false);

  const [departments, setDepartments] =
    useState([]);

  const [
    departmentForm,
    setDepartmentForm
  ] = useState({
    name: "",
    description: ""
  });

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

  const currentUser =
    getLoggedInUser();

  const currentRole =
    currentUser.Role ||
    currentUser.role ||
    "";

  const isAdmin =
    String(currentRole)
      .trim()
      .toLowerCase() === "admin";

  const canViewDepartments =
    isAdmin ||
    String(currentRole)
      .trim()
      .toLowerCase() === "hr";

  /*
   * JWT token ke saath Department API
   * se records load karega.
   */
  const loadDepartments =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await axiosInstance.get(
            "/departments"
          );

        console.log(
          "Department API response:",
          response.data
        );

        const data =
          Array.isArray(response.data)
            ? response.data
            : [];

        const normalizedData =
          data.map(
            normalizeDepartment
          );

        setDepartments(
          normalizedData
        );
      } catch (error) {
        console.error(
          "Department load error:",
          error
        );

        console.error(
          "Department status:",
          error.response?.status
        );

        console.error(
          "Department response:",
          error.response?.data
        );

        setDepartments([]);

        if (!error.response) {
          setErrorMessage(
            "Department API connect nahi ho rahi. Backend API aur port check karo."
          );
        } else if (
          error.response.status === 401
        ) {
          setErrorMessage(
            "Authentication token missing, invalid ya expired hai. Dobara login karo."
          );
        } else if (
          error.response.status === 403
        ) {
          setErrorMessage(
            "Current user ko Departments access karne ki permission nahi hai."
          );
        } else {
          const message =
            error.response.data?.Message ||
            error.response.data?.message ||
            error.response.data?.Error ||
            error.response.data
              ?.ExceptionMessage;

          setErrorMessage(
            message ||
              `Departments load nahi hue. Status: ${error.response.status}`
          );
        }
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    /*
     * Agar backend GET endpoint Admin/HR
     * roles ke liye protected hai.
     */
    if (canViewDepartments) {
      loadDepartments();
    } else {
      setLoading(false);

      setErrorMessage(
        "Departments page sirf Admin aur HR access kar sakte hain."
      );
    }
  }, [
    canViewDepartments,
    loadDepartments
  ]);

  const openAddModal = () => {
    if (!isAdmin) {
      alert(
        "Sirf Admin department add kar sakta hai."
      );

      return;
    }

    setDepartmentForm({
      name: "",
      description: ""
    });

    setErrorMessage("");
    setShowModal(true);
  };

  const closeAddModal = () => {
    if (saving) {
      return;
    }

    setDepartmentForm({
      name: "",
      description: ""
    });

    setShowModal(false);
  };

  /*
   * Direct input handler.
   * Isse Department Name typing work karegi.
   */
  const updateDepartmentName = (
    event
  ) => {
    const newValue =
      event.target.value;

    setDepartmentForm(
      (currentForm) => ({
        ...currentForm,
        name: newValue
      })
    );

    setErrorMessage("");
  };

  /*
   * Direct textarea handler.
   * Isse Description typing work karegi.
   */
  const updateDescription = (
    event
  ) => {
    const newValue =
      event.target.value;

    setDepartmentForm(
      (currentForm) => ({
        ...currentForm,
        description: newValue
      })
    );

    setErrorMessage("");
  };

  /*
   * Department API aur MongoDB mein
   * save karega.
   */
  const addDepartment = async (
    event
  ) => {
    event.preventDefault();

    if (!isAdmin) {
      setErrorMessage(
        "Sirf Admin department add kar sakta hai."
      );

      return;
    }

    const departmentName =
      departmentForm.name.trim();

    const description =
      departmentForm.description.trim();

    if (!departmentName) {
      setErrorMessage(
        "Department Name enter karo."
      );

      return;
    }

    if (!description) {
      setErrorMessage(
        "Department Description enter karo."
      );

      return;
    }

    const requestData = {
      DepartmentId: 0,

      DepartmentName:
        departmentName,

      Description:
        description,

      Status:
        "Active"
    };

    console.log(
      "Department save request:",
      requestData
    );

    try {
      setSaving(true);
      setErrorMessage("");

      const response =
  await axiosInstance.post(
    "/departments",
    requestData,
    {
      headers: {
        "Content-Type":
          "application/json"
      }
    }
  );

      console.log(
        "Department save response:",
        response.data
      );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Department Added Successfully"
      );

      setDepartmentForm({
        name: "",
        description: ""
      });

      setShowModal(false);

      await loadDepartments();
    } catch (error) {
      console.error(
        "Department save error:",
        error
      );

      console.error(
        "Department save status:",
        error.response?.status
      );

      console.error(
        "Department save response:",
        error.response?.data
      );

      let message =
        "Department save failed.";

      if (!error.response) {
        message =
          "Department API connect nahi ho rahi. Backend API run karo.";
      } else if (
        error.response.status === 400
      ) {
        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else {
          message =
            error.response.data?.Message ||
            error.response.data?.message ||
            "Department details invalid hain.";
        }
      } else if (
        error.response.status === 401
      ) {
        message =
          "Authentication token invalid ya expired hai. Dobara login karo.";
      } else if (
        error.response.status === 403
      ) {
        message =
          "Sirf Admin department add kar sakta hai.";
      } else if (
        error.response.status === 409
      ) {
        message =
          error.response.data?.Message ||
          error.response.data?.message ||
          "Department pehle se exist karta hai.";
      } else if (
        typeof error.response.data ===
        "string"
      ) {
        message =
          error.response.data;
      } else {
        message =
          error.response.data?.Message ||
          error.response.data?.message ||
          error.response.data?.Error ||
          error.response.data
            ?.ExceptionMessage ||
          `Department save failed. Status: ${error.response.status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  /*
   * Department API aur MongoDB se
   * delete karega.
   */
  const deleteDepartment = async (
    departmentId
  ) => {
    if (!isAdmin) {
      alert(
        "Sirf Admin department delete kar sakta hai."
      );

      return;
    }

    const numericDepartmentId =
      Number(departmentId);

    if (
      Number.isNaN(
        numericDepartmentId
      ) ||
      numericDepartmentId <= 0
    ) {
      alert(
        "Valid Department ID nahi mila."
      );

      return;
    }

    const shouldDelete =
      window.confirm(
        "Kya aap is department ko delete karna chahte hain?"
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(
        numericDepartmentId
      );

      setErrorMessage("");

      const response =
        await axiosInstance.delete(
          `/departments/${numericDepartmentId}`
        );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Department Deleted Successfully"
      );

      await loadDepartments();
    } catch (error) {
      console.error(
        "Department delete error:",
        error
      );

      console.error(
        "Department delete status:",
        error.response?.status
      );

      console.error(
        "Department delete response:",
        error.response?.data
      );

      let message =
        "Department delete failed.";

      if (!error.response) {
        message =
          "Department API connect nahi ho rahi.";
      } else if (
        error.response.status === 401
      ) {
        message =
          "Authentication token invalid ya expired hai.";
      } else if (
        error.response.status === 403
      ) {
        message =
          "Sirf Admin department delete kar sakta hai.";
      } else if (
        typeof error.response.data ===
        "string"
      ) {
        message =
          error.response.data;
      } else {
        message =
          error.response.data?.Message ||
          error.response.data?.message ||
          error.response.data?.Error ||
          error.response.data
            ?.ExceptionMessage ||
          `Department delete failed. Status: ${error.response.status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalDepartments =
    departments.length;

  const activeDepartments =
    departments.filter(
      (department) =>
        String(department.status)
          .trim()
          .toLowerCase() ===
        "active"
    ).length;

  const inactiveDepartments =
    departments.filter(
      (department) =>
        String(department.status)
          .trim()
          .toLowerCase() ===
        "inactive"
    ).length;

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <main className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">
              Department Management
            </h2>

            <p className="text-muted mb-0">
              Create, view and manage
              company departments.
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
                    Total Departments
                  </h5>

                  <h2 className="fw-bold">
                    {totalDepartments}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card green-card h-100">
                <div className="card-body">
                  <h5>
                    Active Departments
                  </h5>

                  <h2 className="fw-bold">
                    {activeDepartments}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card orange-card h-100">
                <div className="card-body">
                  <h5>
                    Inactive Departments
                  </h5>

                  <h2 className="fw-bold">
                    {inactiveDepartments}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fw-bold mb-1">
                  Departments
                </h4>

                <small className="text-muted">
                  {departments.length}{" "}
                  department(s) found
                </small>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={
                    loadDepartments
                  }
                  disabled={
                    loading ||
                    !canViewDepartments
                  }
                >
                  <FaSyncAlt className="me-1" />

                  {loading
                    ? "Loading..."
                    : "Refresh"}
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      openAddModal
                    }
                  >
                    + Add Department
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <FaBuilding
                  size={45}
                  className="text-primary mb-3"
                />

                <h5 className="text-muted">
                  Departments loading...
                </h5>
              </div>
            ) : departments.length ===
              0 ? (
              <div className="text-center py-5">
                <FaBuilding
                  size={45}
                  className="text-primary mb-3"
                />

                <h5 className="text-muted">
                  No departments found
                </h5>

                <p className="text-muted mb-0">
                  {isAdmin
                    ? "Add Department button se pehla department create karo."
                    : "Koi department record available nahi hai."}
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {departments.map(
                  (department) => (
                    <div
                      className="col-lg-4 col-md-6"
                      key={
                        department.mongoId ||
                        department.id
                      }
                    >
                      <div className="employee-card card border-0 shadow-lg h-100">
                        <div className="card-body d-flex flex-column">
                          <FaBuilding
                            size={45}
                            className="text-primary mb-3"
                          />

                          <h5 className="fw-bold">
                            {department.name ||
                              "Unnamed Department"}
                          </h5>

                          <p className="text-muted flex-grow-1">
                            {department.description ||
                              "No description available"}
                          </p>

                          <div>
                            <span
                              className={
                                String(
                                  department.status
                                )
                                  .trim()
                                  .toLowerCase() ===
                                "active"
                                  ? "badge bg-success mb-3"
                                  : "badge bg-danger mb-3"
                              }
                            >
                              {department.status ||
                                "Active"}
                            </span>
                          </div>

                          {isAdmin && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm mt-2"
                              disabled={
                                deletingId ===
                                Number(
                                  department.id
                                )
                              }
                              onClick={() =>
                                deleteDepartment(
                                  department.id
                                )
                              }
                            >
                              <FaTrash />{" "}

                              {deletingId ===
                              Number(
                                department.id
                              )
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && isAdmin && (
        <div className="modal-overlay">
          <div className="leave-modal">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Add Department
              </h4>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={
                  closeAddModal
                }
                disabled={saving}
              >
                X
              </button>
            </div>

            <form
              onSubmit={
                addDepartment
              }
            >
              <label className="form-label">
                Department Name
              </label>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="IT / HR / Finance"
                value={
                  departmentForm.name
                }
                onChange={
                  updateDepartmentName
                }
                disabled={saving}
                required
              />

              <label className="form-label">
                Description
              </label>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Enter department description"
                value={
                  departmentForm.description
                }
                onChange={
                  updateDescription
                }
                disabled={saving}
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Department"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Departments;
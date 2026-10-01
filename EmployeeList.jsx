import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaPlus,
  FaUpload,
  FaDownload,
  FaSearch,
  FaEye,
  FaEdit,
  FaSyncAlt,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaTrash
} from "react-icons/fa";

const normalizeEmployee = (employee) => ({
  id:
    employee.id ||
    employee.Id ||
    "",

  employeeId:
    employee.employeeId ??
    employee.EmployeeId ??
    "",

  employeeCode:
    employee.employeeCode ||
    employee.EmployeeCode ||
    "",

  fullName:
    employee.fullName ||
    employee.FullName ||
    "",

  department:
    employee.department ||
    employee.Department ||
    "",

  email:
    employee.email ||
    employee.Email ||
    "",

  phone:
    employee.phone ||
    employee.Phone ||
    "",

  salary:
    employee.salary ??
    employee.Salary ??
    0,

  status:
    employee.status ||
    employee.Status ||
    "Active"
});

const getLoggedInUser = () => {
  try {
    const savedUser =
      sessionStorage.getItem("authUser");

    return savedUser
      ? JSON.parse(savedUser)
      : {};
  } catch (error) {
    console.error(
      "Auth user parse error:",
      error
    );

    return {};
  }
};

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [
    selectedEmployee,
    setSelectedEmployee
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [downloading, setDownloading] =
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

  const canViewEmployees =
    isAdmin ||
    String(currentRole)
      .trim()
      .toLowerCase() === "hr";

  /*
   * Employee data JWT token ke saath
   * API se load karega.
   */
  const loadEmployees =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
  await axiosInstance.get(
    "/employees"
  );

        console.log(
          "Employee API response:",
          response.data
        );

        const data =
          Array.isArray(response.data)
            ? response.data
            : [];

        setEmployees(
          data.map(normalizeEmployee)
        );
      } catch (error) {
        console.error(
          "Employee API error:",
          error
        );

        console.error(
          "Employee API status:",
          error.response?.status
        );

        console.error(
          "Employee API response:",
          error.response?.data
        );

        setEmployees([]);

        if (!error.response) {
          setErrorMessage(
            "Employee API connect nahi ho rahi. Backend API run karo."
          );
        } else if (
          error.response.status === 403
        ) {
          setErrorMessage(
            "Aapke account ko Employee List dekhne ki permission nahi hai."
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
              `Employees load nahi hue. Status: ${error.response.status}`
          );
        }
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    if (canViewEmployees) {
      loadEmployees();
    } else {
      setLoading(false);

      setErrorMessage(
        "Employee List sirf Admin aur HR access kar sakte hain."
      );
    }
  }, [
    canViewEmployees,
    loadEmployees
  ]);

  /*
   * Employee search.
   */
  const filteredEmployees =
    useMemo(() => {
      const keyword = search
        .trim()
        .toLowerCase();

      if (!keyword) {
        return employees;
      }

      return employees.filter(
        (employee) =>
          String(employee.employeeId)
            .toLowerCase()
            .includes(keyword) ||
          String(employee.employeeCode)
            .toLowerCase()
            .includes(keyword) ||
          String(employee.fullName)
            .toLowerCase()
            .includes(keyword) ||
          String(employee.department)
            .toLowerCase()
            .includes(keyword) ||
          String(employee.email)
            .toLowerCase()
            .includes(keyword) ||
          String(employee.phone)
            .toLowerCase()
            .includes(keyword) ||
          String(employee.status)
            .toLowerCase()
            .includes(keyword)
      );
    }, [employees, search]);

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(
      (employee) =>
        String(employee.status)
          .trim()
          .toLowerCase() === "active"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (employee) =>
        String(employee.status)
          .trim()
          .toLowerCase() === "inactive"
    ).length;

  /*
   * Excel upload.
   */
  const uploadExcel = async () => {
    if (!isAdmin) {
      alert(
        "Sirf Admin Excel upload kar sakta hai."
      );

      return;
    }

    if (!file) {
      alert(
        "Pehle Excel file select karo."
      );

      return;
    }

    const fileName =
      file.name.toLowerCase();

    if (!fileName.endsWith(".xlsx")) {
      alert(
        "Sirf .xlsx Excel file select karo."
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {
      setUploading(true);
      setErrorMessage("");

      const response =
        await axiosInstance.post(
          "/excel/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

      const message =
        response.data?.Message ||
        response.data?.message ||
        "Excel uploaded successfully.";

      alert(message);

      setFile(null);

      const fileInput =
        document.getElementById(
          "employee-excel-file"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadEmployees();
    } catch (error) {
      console.error(
        "Excel upload error:",
        error
      );

      const apiMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.response?.data?.Error ||
        error.response?.data
          ?.ExceptionMessage ||
        error.response?.data;

      const message =
        typeof apiMessage === "string"
          ? apiMessage
          : "Excel upload failed.";

      setErrorMessage(message);
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  /*
   * Excel download.
   */
  const downloadExcel = async () => {
    try {
      setDownloading(true);
      setErrorMessage("");

      const response =
        await axiosInstance.get(
          "/excel/download",
          {
            responseType: "blob"
          }
        );

      const contentType =
        response.headers[
          "content-type"
        ] ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      const blob =
        new Blob(
          [response.data],
          {
            type: contentType
          }
        );

      const fileUrl =
        window.URL
          .createObjectURL(blob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href =
        fileUrl;

      downloadLink.download =
        "Employees.xlsx";

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      window.URL.revokeObjectURL(
        fileUrl
      );
    } catch (error) {
      console.error(
        "Excel download error:",
        error
      );

      let message =
        "Excel download failed.";

      if (
        error.response?.data
          instanceof Blob
      ) {
        try {
          const text =
            await error.response
              .data.text();

          const data =
            JSON.parse(text);

          message =
            data.Message ||
            data.message ||
            message;
        } catch {
          message =
            "Excel download API failed.";
        }
      } else {
        message =
          error.response?.data
            ?.Message ||
          error.response?.data
            ?.message ||
          error.response?.data
            ?.Error ||
          message;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setDownloading(false);
    }
  };

  /*
   * Employee delete.
   */
  const deleteEmployee = async (
    employee
  ) => {
    if (!isAdmin) {
      alert(
        "Sirf Admin employee delete kar sakta hai."
      );

      return;
    }

    const employeeId =
      Number(employee.employeeId);

    if (
      Number.isNaN(employeeId) ||
      employeeId <= 0
    ) {
      alert(
        "Valid Employee ID nahi mila."
      );

      return;
    }

    const employeeName =
      employee.fullName ||
      "this employee";

    const shouldDelete =
      window.confirm(
        `Do you want to delete ${employeeName}?`
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(
        employeeId
      );

      setErrorMessage("");

      const response =
        await axiosInstance.delete(
          `/employees/${employeeId}`
        );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Employee deleted successfully."
      );

      if (
        Number(
          selectedEmployee?.employeeId
        ) === employeeId
      ) {
        setSelectedEmployee(null);
      }

      await loadEmployees();
    } catch (error) {
      console.error(
        "Employee delete error:",
        error
      );

      console.error(
        "Delete status:",
        error.response?.status
      );

      console.error(
        "Delete response:",
        error.response?.data
      );

      let message =
        "Employee delete failed.";

      if (!error.response) {
        message =
          "Employee API connect nahi ho rahi. Backend API run karo.";
      } else if (
        error.response.status === 403
      ) {
        message =
          "Aapko employee delete karne ki permission nahi hai.";
      } else if (
        typeof error.response
          .data === "string"
      ) {
        message =
          error.response.data;
      } else {
        message =
          error.response.data
            ?.Message ||
          error.response.data
            ?.message ||
          error.response.data
            ?.Error ||
          error.response.data
            ?.ExceptionMessage ||
          `Employee delete failed. Status: ${error.response.status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (
    status
  ) => {
    const currentStatus =
      String(status || "")
        .trim()
        .toLowerCase();

    if (
      currentStatus === "active"
    ) {
      return (
        "employee-interface-status " +
        "employee-interface-status-active"
      );
    }

    if (
      currentStatus === "inactive"
    ) {
      return (
        "employee-interface-status " +
        "employee-interface-status-inactive"
      );
    }

    return (
      "employee-interface-status " +
      "employee-interface-status-other"
    );
  };

  const openEditEmployee = (
    employee
  ) => {
    if (!isAdmin) {
      alert(
        "Sirf Admin employee edit kar sakta hai."
      );

      return;
    }

    if (!employee.employeeId) {
      alert(
        "Employee ID available nahi hai."
      );

      return;
    }

    navigate(
      `/employees/edit/${employee.employeeId}`
    );
  };

  return (
    <>
      <Navbar />

      <div className="employee-page-wrapper">
        <Sidebar />

        <main className="employee-main-content">
          <div className="employee-interface-page">
            <section className="employee-interface-hero">
              <div>
                <h1>
                  Employee Management
                </h1>

                <p>
                  Add, view and manage
                  company employees.
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  className="employee-interface-add-button"
                  onClick={() =>
                    navigate(
                      "/addemployee"
                    )
                  }
                >
                  <FaPlus />
                  Add Employee
                </button>
              )}
            </section>

            <section className="employee-interface-summary-grid">
              <article className="employee-interface-summary-card employee-interface-blue-card">
                <div>
                  <span>
                    Total Employees
                  </span>

                  <strong>
                    {totalEmployees}
                  </strong>
                </div>

                <FaUsers />
              </article>

              <article className="employee-interface-summary-card employee-interface-green-card">
                <div>
                  <span>
                    Active Employees
                  </span>

                  <strong>
                    {activeEmployees}
                  </strong>
                </div>

                <FaUserCheck />
              </article>

              <article className="employee-interface-summary-card employee-interface-orange-card">
                <div>
                  <span>
                    Inactive Employees
                  </span>

                  <strong>
                    {inactiveEmployees}
                  </strong>
                </div>

                <FaUserTimes />
              </article>
            </section>

            <section className="employee-interface-section">
              <div className="employee-interface-section-heading">
                <div>
                  <h2>
                    Employees
                  </h2>

                  <p>
                    {
                      filteredEmployees.length
                    }{" "}
                    employee(s) displayed
                  </p>
                </div>
              </div>

              <div className="employee-interface-toolbar">
                <div className="employee-interface-search">
                  <FaSearch />

                  <input
                    type="search"
                    value={search}
                    placeholder="Search employee..."
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                  />
                </div>

                {isAdmin && (
                  <>
                    <input
                      id="employee-excel-file"
                      type="file"
                      accept=".xlsx"
                      className="employee-interface-file"
                      onChange={(event) =>
                        setFile(
                          event.target
                            .files?.[0] ||
                            null
                        )
                      }
                    />

                    <button
                      type="button"
                      className="employee-interface-toolbar-button employee-interface-upload-button"
                      onClick={
                        uploadExcel
                      }
                      disabled={
                        uploading
                      }
                    >
                      <FaUpload />

                      {uploading
                        ? "Uploading..."
                        : "Upload Excel"}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="employee-interface-toolbar-button employee-interface-download-button"
                  onClick={
                    downloadExcel
                  }
                  disabled={
                    downloading
                  }
                >
                  <FaDownload />

                  {downloading
                    ? "Downloading..."
                    : "Download Excel"}
                </button>

                <button
                  type="button"
                  className="employee-interface-refresh-button"
                  onClick={
                    loadEmployees
                  }
                  disabled={loading}
                >
                  <FaSyncAlt />

                  {loading
                    ? "Loading..."
                    : "Refresh"}
                </button>
              </div>

              {file &&
                isAdmin && (
                  <div className="employee-interface-file-message">
                    Selected file:{" "}

                    <strong>
                      {file.name}
                    </strong>
                  </div>
                )}

              {errorMessage && (
                <div className="employee-interface-error">
                  {errorMessage}
                </div>
              )}

              {loading ? (
                <div className="employee-interface-empty">
                  <FaUsers />

                  <h3>
                    Loading Employees
                  </h3>

                  <p>
                    Please wait while
                    employee data is
                    loading.
                  </p>
                </div>
              ) : filteredEmployees
                  .length === 0 ? (
                <div className="employee-interface-empty">
                  <FaUsers />

                  <h3>
                    No Employees Found
                  </h3>

                  <p>
                    No employee record
                    is available.
                  </p>
                </div>
              ) : (
                <div className="employee-interface-card-grid">
                  {filteredEmployees.map(
                    (
                      employee,
                      index
                    ) => (
                      <article
                        className="employee-interface-card"
                        key={
                          employee.id ||
                          employee
                            .employeeId ||
                          index
                        }
                      >
                        <div className="employee-interface-card-top">
                          <div className="employee-interface-avatar">
                            {employee.fullName
                              ? employee
                                  .fullName
                                  .charAt(0)
                                  .toUpperCase()
                              : "E"}
                          </div>

                          <span
                            className={getStatusClass(
                              employee.status
                            )}
                          >
                            {employee.status ||
                              "Active"}
                          </span>
                        </div>

                        <h3>
                          {employee.fullName ||
                            "Unnamed Employee"}
                        </h3>

                        <p className="employee-interface-code">
                          {employee.employeeCode ||
                            "No employee code"}
                        </p>

                        <div className="employee-interface-details">
                          <div>
                            <FaBuilding />

                            <span>
                              {employee.department ||
                                "No department"}
                            </span>
                          </div>

                          <div>
                            <FaEnvelope />

                            <span>
                              {employee.email ||
                                "No email"}
                            </span>
                          </div>

                          <div>
                            <FaPhone />

                            <span>
                              {employee.phone ||
                                "No phone"}
                            </span>
                          </div>
                        </div>

                        <div className="employee-interface-salary">
                          <span>
                            Salary
                          </span>

                          <strong>
                            ₹
                            {Number(
                              employee.salary ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>

                        <div className="employee-interface-actions">
                          <button
                            type="button"
                            className="employee-interface-view-button"
                            onClick={() =>
                              setSelectedEmployee(
                                employee
                              )
                            }
                            disabled={
                              deletingId ===
                              Number(
                                employee
                                  .employeeId
                              )
                            }
                          >
                            <FaEye />
                            View
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                className="employee-interface-edit-button"
                                onClick={() =>
                                  openEditEmployee(
                                    employee
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  Number(
                                    employee
                                      .employeeId
                                  )
                                }
                              >
                                <FaEdit />
                                Edit
                              </button>

                              <button
                                type="button"
                                className="employee-interface-delete-button"
                                onClick={() =>
                                  deleteEmployee(
                                    employee
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  Number(
                                    employee
                                      .employeeId
                                  )
                                }
                              >
                                <FaTrash />

                                {deletingId ===
                                Number(
                                  employee
                                    .employeeId
                                )
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {selectedEmployee && (
        <div className="employee-interface-modal-overlay">
          <div className="employee-interface-modal">
            <div className="employee-interface-modal-header">
              <h2>
                Employee Details
              </h2>

              <button
                type="button"
                aria-label="Close"
                onClick={() =>
                  setSelectedEmployee(
                    null
                  )
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="employee-interface-modal-avatar">
              {selectedEmployee.fullName
                ? selectedEmployee
                    .fullName
                    .charAt(0)
                    .toUpperCase()
                : "E"}
            </div>

            <h3 className="employee-interface-modal-name">
              {selectedEmployee.fullName ||
                "Unnamed Employee"}
            </h3>

            <p className="employee-interface-modal-code">
              {selectedEmployee.employeeCode ||
                "No employee code"}
            </p>

            <div className="employee-interface-detail-grid">
              <EmployeeDetail
                label="Employee ID"
                value={
                  selectedEmployee
                    .employeeId
                }
              />

              <EmployeeDetail
                label="Employee Code"
                value={
                  selectedEmployee
                    .employeeCode
                }
              />

              <EmployeeDetail
                label="Full Name"
                value={
                  selectedEmployee
                    .fullName
                }
              />

              <EmployeeDetail
                label="Department"
                value={
                  selectedEmployee
                    .department
                }
              />

              <EmployeeDetail
                label="Email"
                value={
                  selectedEmployee.email
                }
              />

              <EmployeeDetail
                label="Phone"
                value={
                  selectedEmployee.phone
                }
              />

              <EmployeeDetail
                label="Salary"
                value={`₹${Number(
                  selectedEmployee.salary ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}`}
              />

              <EmployeeDetail
                label="Status"
                value={
                  selectedEmployee.status ||
                  "Active"
                }
              />
            </div>

            <div className="employee-interface-modal-actions">
              {isAdmin && (
                <button
                  type="button"
                  className="employee-interface-edit-button"
                  onClick={() =>
                    openEditEmployee(
                      selectedEmployee
                    )
                  }
                >
                  <FaEdit />
                  Edit Employee
                </button>
              )}

              <button
                type="button"
                className="employee-interface-close-button"
                onClick={() =>
                  setSelectedEmployee(
                    null
                  )
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmployeeDetail({
  label,
  value
}) {
  return (
    <div className="employee-interface-detail-item">
      <span>
        {label}
      </span>

      <strong>
        {value === 0
          ? 0
          : value || "-"}
      </strong>
    </div>
  );
}

export default EmployeeList;
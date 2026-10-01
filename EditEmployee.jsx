import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import axiosInstance from"../api/axiosInstance";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

import {
  FaArrowLeft,
  FaSave,
  FaUserEdit
} from "react-icons/fa";



function EditEmployee() {
  const navigate = useNavigate();

  const { employeeId } = useParams();

  const [employeeForm, setEmployeeForm] =
    useState({
      EmployeeCode: "",
      FullName: "",
      Department: "",
      Email: "",
      Phone: "",
      Salary: "",
      Status: "Active"
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadEmployee = useCallback(
    async () => {
      const numericEmployeeId =
        Number(employeeId);

      if (
        !employeeId ||
        Number.isNaN(numericEmployeeId) ||
        numericEmployeeId <= 0
      ) {
        setErrorMessage(
          "Valid Employee ID nahi mila."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const response = await axiosInstance.get(
  `/employees/${numericEmployeeId}`
);

        console.log(
          "Employee load response:",
          response.data
        );

        const employee =
          response.data?.Data ||
          response.data?.data ||
          response.data;

        if (!employee) {
          throw new Error(
            "Employee data API response mein nahi mila."
          );
        }

        setEmployeeForm({
          EmployeeCode:
            employee.EmployeeCode ??
            employee.employeeCode ??
            "",

          FullName:
            employee.FullName ??
            employee.fullName ??
            "",

          Department:
            employee.Department ??
            employee.department ??
            "",

          Email:
            employee.Email ??
            employee.email ??
            "",

          Phone:
            employee.Phone ??
            employee.phone ??
            "",

          Salary:
            employee.Salary ??
            employee.salary ??
            "",

          Status:
            employee.Status ??
            employee.status ??
            "Active"
        });
      } catch (error) {
        console.error(
          "Employee load error:",
          error
        );

        console.error(
          "Employee load status:",
          error.response?.status
        );

        console.error(
          "Employee load response:",
          error.response?.data
        );

        let message =
          "Employee load nahi hua.";

        if (!error.response) {
          message =
            error.message ||
            "Employee API connect nahi ho rahi. Backend API run karo.";
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
            `Employee load failed. Status: ${error.response.status}`;
        }

        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const updateEmployee = async (
    event
  ) => {
    event.preventDefault();

    const numericEmployeeId =
      Number(employeeId);

    const employeeCode =
      employeeForm.EmployeeCode.trim();

    const fullName =
      employeeForm.FullName.trim();

    const department =
      employeeForm.Department.trim();

    const email =
      employeeForm.Email.trim();

    const phone =
      employeeForm.Phone.trim();

    const salary =
      Number(employeeForm.Salary);

    if (
      Number.isNaN(numericEmployeeId) ||
      numericEmployeeId <= 0
    ) {
      alert(
        "Valid Employee ID nahi mila."
      );
      return;
    }

    if (!employeeCode) {
      alert(
        "Employee Code required hai."
      );
      return;
    }

    if (!fullName) {
      alert(
        "Full Name required hai."
      );
      return;
    }

    if (!department) {
      alert(
        "Department required hai."
      );
      return;
    }

    if (!email) {
      alert("Email required hai.");
      return;
    }

    if (!phone) {
      alert(
        "Phone number required hai."
      );
      return;
    }

    if (
      Number.isNaN(salary) ||
      salary < 0
    ) {
      alert(
        "Valid Salary enter karo."
      );
      return;
    }

    const requestData = {
      EmployeeId:
        numericEmployeeId,

      EmployeeCode:
        employeeCode,

      FullName:
        fullName,

      Department:
        department,

      Email:
        email,

      Phone:
        phone,

      Salary:
        salary,

      Status:
        employeeForm.Status ||
        "Active"
    };

    console.log(
      "Employee update request:",
      requestData
    );

    try {
      setSaving(true);
      setErrorMessage("");

      const response = await axiosInstance.put(
  `/employees/${numericEmployeeId}`,
  requestData
);

      console.log(
        "Employee update response:",
        response.data
      );

      alert(
        response.data?.Message ||
        response.data?.message ||
        "Employee Updated Successfully"
      );

      navigate("/employees");
    } catch (error) {
      console.error(
        "Employee update error:",
        error
      );

      console.error(
        "Employee update status:",
        error.response?.status
      );

      console.error(
        "Employee update response:",
        error.response?.data
      );

      let message =
        "Employee update failed.";

      if (!error.response) {
        message =
          "Employee API connect nahi ho rahi. Backend API run karo.";
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
          `Employee update failed. Status: ${error.response.status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <main className="main-content">
          <div className="welcome-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold mb-2">
                  Edit Employee
                </h2>

                <p className="text-muted mb-0">
                  Update employee information.
                </p>
              </div>

              <FaUserEdit
                size={46}
                className="text-primary"
              />
            </div>
          </div>

          {loading && (
            <div className="card glass-card p-5 text-center">
              <h5 className="text-muted mb-0">
                Employee data loading...
              </h5>
            </div>
          )}

          {!loading &&
            errorMessage && (
              <div className="alert alert-danger">
                <div>
                  {errorMessage}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate("/employees")
                    }
                  >
                    <FaArrowLeft className="me-2" />
                    Back to Employees
                  </button>
                </div>
              </div>
            )}

          {!loading &&
            !errorMessage && (
              <div className="card glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">
                    Employee Information
                  </h4>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate("/employees")
                    }
                    disabled={saving}
                  >
                    <FaArrowLeft className="me-2" />
                    Back
                  </button>
                </div>

                <form
                  onSubmit={updateEmployee}
                >
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Employee ID
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={employeeId || ""}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Employee Code
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="EMP001"
                        value={
                          employeeForm.EmployeeCode
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              EmployeeCode:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Full Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Employee full name"
                        value={
                          employeeForm.FullName
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              FullName:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Department
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="IT / HR / Finance"
                        value={
                          employeeForm.Department
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              Department:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        placeholder="employee@example.com"
                        value={
                          employeeForm.Email
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              Email:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Phone
                      </label>

                      <input
                        type="tel"
                        className="form-control"
                        placeholder="9999999999"
                        value={
                          employeeForm.Phone
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              Phone:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Salary
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="50000"
                        min="0"
                        value={
                          employeeForm.Salary
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              Salary:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Status
                      </label>

                      <select
                        className="form-control"
                        value={
                          employeeForm.Status
                        }
                        onChange={(event) => {
                          setEmployeeForm(
                            (currentForm) => ({
                              ...currentForm,
                              Status:
                                event.target.value
                            })
                          );
                        }}
                        disabled={saving}
                        required
                      >
                        <option value="Active">
                          Active
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        navigate("/employees")
                      }
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      <FaSave className="me-2" />

                      {saving
                        ? "Updating..."
                        : "Update Employee"}
                    </button>
                  </div>
                </form>
              </div>
            )}
        </main>
      </div>
    </>
  );
}

export default EditEmployee;
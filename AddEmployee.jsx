import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

function AddEmployee() {
  const [employee, setEmployee] = useState({
    EmployeeCode: "",
    FullName: "",
    Email: "",
    Phone: "",
    Department: "",
    Designation: "",
    Salary: "",
    Status: "Active"
  });

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

 const saveEmployee = async () => {
  if (!employee.FullName.trim()) {
    alert("Full Name required");
    return;
  }

  if (!employee.Email.trim()) {
    alert("Email required");
    return;
  }

  try {
    const payload = {
      ...employee,
      Salary: Number(employee.Salary || 0)
    };

    const response = await axiosInstance.post(
      "/employees",
      payload
    );

    alert(
      response.data?.Message ||
      "Employee Added Successfully"
    );

    window.location.href = "/employees";
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.Message ||
      "Employee save failed"
    );
  }
};

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">Add New Employee</h2>
            <p className="text-muted">
              Fill employee details and save the record.
            </p>
          </div>

          <div className="card glass-card p-4">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Employee Code
                </label>
                <input
                  type="text"
                  name="EmployeeCode"
                  className="form-control"
                  value={employee.EmployeeCode}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  name="FullName"
                  className="form-control"
                  value={employee.FullName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  className="form-control"
                  value={employee.Email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  name="Phone"
                  className="form-control"
                  value={employee.Phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Department
                </label>
                <input
                  type="text"
                  name="Department"
                  className="form-control"
                  value={employee.Department}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Designation
                </label>
                <input
                  type="text"
                  name="Designation"
                  className="form-control"
                  value={employee.Designation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Salary
                </label>
                <input
                  type="number"
                  name="Salary"
                  className="form-control"
                  value={employee.Salary}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              className="btn btn-primary me-2"
              onClick={saveEmployee}
            >
              Save Employee
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                (window.location.href = "/employees")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEmployee;
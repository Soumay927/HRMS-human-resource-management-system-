import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

import {
  FaUserCircle,
  FaEdit,
  FaTrash,
  FaArrowLeft
} from "react-icons/fa";

function EmployeeDetails() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const loadEmployeeDetails = async () => {
      try {
       const response = await axiosInstance.get(
  `/employees/${id}`
);

        setEmployee(response.data);
      } catch (error) {
        console.log(error);
        alert("Employee details load failed");
      }
    };

    loadEmployeeDetails();
  }, [id]);

  const deleteEmployee = async () => {
    try {
     await axiosInstance.delete(
  `/employees/${id}`
);

      alert("Employee Deleted Successfully");

      window.location.href = "/employees";
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  if (!employee) {
    return (
      <>
        <Navbar />

        <div className="page-wrapper">
          <Sidebar />

          <div className="main-content">
            <div className="welcome-card">
              <h3 className="fw-bold">
                Loading employee details...
              </h3>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-card d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">
                Employee Profile
              </h2>

              <p className="text-muted mb-0">
                View complete employee information.
              </p>
            </div>

            <Link
              to="/employees"
              className="btn btn-secondary"
            >
              <FaArrowLeft /> Back
            </Link>
          </div>

          <div className="card glass-card p-5">
            <div className="text-center mb-4">
              <FaUserCircle
                size={120}
                className="text-primary mb-3"
              />

              <h3 className="fw-bold">
                {employee.FullName}
              </h3>

              <span className="badge bg-primary">
                {employee.Department}
              </span>
            </div>

            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <strong>Employee ID:</strong>
                <p>{employee.EmployeeId}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Employee Code:</strong>
                <p>{employee.EmployeeCode}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Full Name:</strong>
                <p>{employee.FullName}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Email:</strong>
                <p>{employee.Email}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Phone:</strong>
                <p>{employee.Phone}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Department:</strong>
                <p>{employee.Department}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Designation:</strong>
                <p>{employee.Designation}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Salary:</strong>
                <p>₹{employee.Salary}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>Status:</strong>
                <p>
                  <span
                    className={
                      employee.Status === "Inactive"
                        ? "badge bg-danger"
                        : "badge bg-success"
                    }
                  >
                    {employee.Status || "Active"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to={`/edit-employee/${employee.EmployeeId}`}
                className="btn btn-warning me-2"
              >
                <FaEdit /> Edit Employee
              </Link>

              <button
                className="btn btn-danger me-2"
                onClick={deleteEmployee}
              >
                <FaTrash /> Delete Employee
              </button>

              <Link
                to="/employees"
                className="btn btn-secondary"
              >
                Back to Employees
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDetails;
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

import {
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaMoneyBill,
  FaClipboardList
} from "react-icons/fa";

function Reports() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  const API_BASE_URL = "https://localhost:44320/api";

  const loadReportsData = async () => {
    try {
      const [
        employeesResponse,
        departmentsResponse,
        attendanceResponse,
        payrollResponse,
        leavesResponse
      ] = await Promise.all([
        axiosInstance.get(`${API_BASE_URL}/employees`),
        axiosInstance.get(`${API_BASE_URL}/departments`),
        axiosInstance.get(`${API_BASE_URL}/attendance`),
        axiosInstance.get(`${API_BASE_URL}/payroll`),
        axiosInstance.get(`${API_BASE_URL}/leaves`)
      ]);

      setEmployees(employeesResponse.data);
      setDepartments(departmentsResponse.data);
      setAttendance(attendanceResponse.data);
      setPayroll(payrollResponse.data);
      setLeaves(leavesResponse.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load report data");
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const totalPayrollAmount = payroll.reduce(
    (total, item) => total + Number(item.NetSalary || 0),
    0
  );

  const reports = [
    {
      id: 1,
      type: "Employee Report",
      totalRecords: employees.length,
      status: "Ready",
      records: employees
    },
    {
      id: 2,
      type: "Department Report",
      totalRecords: departments.length,
      status: "Ready",
      records: departments
    },
    {
      id: 3,
      type: "Attendance Report",
      totalRecords: attendance.length,
      status: "Ready",
      records: attendance
    },
    {
      id: 4,
      type: "Payroll Report",
      totalRecords: payroll.length,
      status: payroll.length > 0 ? "Ready" : "Pending",
      records: payroll
    },
    {
      id: 5,
      type: "Leave Report",
      totalRecords: leaves.length,
      status: "Ready",
      records: leaves
    }
  ];

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">
              HRMS Reports
            </h2>

            <p className="text-muted mb-0">
              View live reports generated from current HRMS API data.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="card dashboard-card blue-card">
                <div className="card-body">
                  <FaUsers size={35} />

                  <h5 className="mt-3">
                    Employees
                  </h5>

                  <h2 className="fw-bold">
                    {employees.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card dashboard-card green-card">
                <div className="card-body">
                  <FaBuilding size={35} />

                  <h5 className="mt-3">
                    Departments
                  </h5>

                  <h2 className="fw-bold">
                    {departments.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card dashboard-card orange-card">
                <div className="card-body">
                  <FaCalendarCheck size={35} />

                  <h5 className="mt-3">
                    Attendance
                  </h5>

                  <h2 className="fw-bold">
                    {attendance.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card dashboard-card purple-card">
                <div className="card-body">
                  <FaMoneyBill size={35} />

                  <h5 className="mt-3">
                    Payroll
                  </h5>

                  <h2 className="fw-bold">
                    ₹{totalPayrollAmount.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-1">
            <div className="col-md-4">
              <div className="card glass-card p-4">
                <FaClipboardList size={35} className="text-primary mb-2" />

                <h5 className="fw-bold">
                  Leave Requests
                </h5>

                <h2 className="fw-bold">
                  {leaves.length}
                </h2>

                <p className="text-muted mb-0">
                  Approved:{" "}
                  {
                    leaves.filter(
                      (leave) => leave.Status === "Approved"
                    ).length
                  }{" "}
                  | Pending:{" "}
                  {
                    leaves.filter(
                      (leave) => leave.Status === "Pending"
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card glass-card p-4">
                <FaCalendarCheck size={35} className="text-success mb-2" />

                <h5 className="fw-bold">
                  Attendance Summary
                </h5>

                <p className="mb-1">
                  Present:{" "}
                  {
                    attendance.filter(
                      (item) => item.Status === "Present"
                    ).length
                  }
                </p>

                <p className="mb-1">
                  Absent:{" "}
                  {
                    attendance.filter(
                      (item) => item.Status === "Absent"
                    ).length
                  }
                </p>

                <p className="mb-0">
                  Late:{" "}
                  {
                    attendance.filter(
                      (item) => item.Status === "Late"
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card glass-card p-4">
                <FaMoneyBill size={35} className="text-warning mb-2" />

                <h5 className="fw-bold">
                  Payroll Summary
                </h5>

                <p className="mb-1">
                  Paid:{" "}
                  {
                    payroll.filter(
                      (item) => item.Status === "Paid"
                    ).length
                  }
                </p>

                <p className="mb-1">
                  Pending:{" "}
                  {
                    payroll.filter(
                      (item) => item.Status === "Pending"
                    ).length
                  }
                </p>

                <p className="mb-0">
                  Total: ₹{totalPayrollAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card glass-card p-4 mt-4">
            <h4 className="fw-bold mb-3">
              Live HRMS Reports
            </h4>

            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Report Type</th>
                  <th>Total Records</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.type}</td>

                    <td>{report.totalRecords}</td>

                    <td>
                      <span
                        className={
                          report.status === "Ready"
                            ? "badge bg-success"
                            : "badge bg-warning"
                        }
                      >
                        {report.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedReport && (
            <div className="modal-overlay">
              <div className="leave-modal report-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">
                    {selectedReport.type}
                  </h4>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setSelectedReport(null)}
                  >
                    X
                  </button>
                </div>

                <p>
                  <strong>Total Records:</strong>{" "}
                  {selectedReport.totalRecords}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedReport.status === "Ready"
                        ? "badge bg-success"
                        : "badge bg-warning"
                    }
                  >
                    {selectedReport.status}
                  </span>
                </p>

                <hr />

                {selectedReport.type === "Employee Report" && (
                  <div>
                    <h5 className="fw-bold">
                      Employee Data
                    </h5>

                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Designation</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {employees.map((emp) => (
                          <tr key={emp.EmployeeId}>
                            <td>{emp.EmployeeCode}</td>
                            <td>{emp.FullName}</td>
                            <td>{emp.Department}</td>
                            <td>{emp.Designation}</td>
                            <td>{emp.Status || "Active"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport.type === "Department Report" && (
                  <div>
                    <h5 className="fw-bold">
                      Department Data
                    </h5>

                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {departments.map((department) => (
                          <tr key={department.DepartmentId}>
                            <td>{department.DepartmentName}</td>
                            <td>{department.Description}</td>
                            <td>{department.Status || "Active"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport.type === "Attendance Report" && (
                  <div>
                    <h5 className="fw-bold">
                      Attendance Data
                    </h5>

                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                        </tr>
                      </thead>

                      <tbody>
                        {attendance.map((item) => (
                          <tr key={item.AttendanceId}>
                            <td>{item.Employee}</td>
                            <td>{item.Date}</td>
                            <td>{item.Status}</td>
                            <td>{item.CheckIn}</td>
                            <td>{item.CheckOut}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport.type === "Payroll Report" && (
                  <div>
                    <h5 className="fw-bold">
                      Payroll Data
                    </h5>

                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Month</th>
                          <th>Basic</th>
                          <th>Bonus</th>
                          <th>Deductions</th>
                          <th>Net</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {payroll.map((item) => (
                          <tr key={item.PayrollId}>
                            <td>{item.Employee}</td>
                            <td>{item.Month}</td>
                            <td>₹{item.BasicSalary}</td>
                            <td>₹{item.Bonus}</td>
                            <td>₹{item.Deductions}</td>
                            <td>₹{item.NetSalary}</td>
                            <td>{item.Status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport.type === "Leave Report" && (
                  <div>
                    <h5 className="fw-bold">
                      Leave Data
                    </h5>

                    <table className="table table-sm table-striped">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Leave Type</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Days</th>
                          <th>Status</th>
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
                            <td>{leave.Status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  className="btn btn-secondary w-100 mt-3"
                  onClick={() => setSelectedReport(null)}
                >
                  Close Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Reports;
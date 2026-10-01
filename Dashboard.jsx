import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaCalendarAlt,
  FaMoneyBill,
  FaClipboardList,
  FaSyncAlt
} from "react-icons/fa";

const normalizeEmployee = (employee) => {
  return {
    employeeId:
      employee.employeeId ??
      employee.EmployeeId ??
      0,

    fullName:
      employee.fullName ||
      employee.FullName ||
      "",

    department:
      employee.department ||
      employee.Department ||
      "",

    status:
      employee.status ||
      employee.Status ||
      "Active"
  };
};

const normalizeDepartment = (
  department
) => {
  return {
    departmentId:
      department.departmentId ??
      department.DepartmentId ??
      0,

    departmentName:
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

const normalizeAttendance = (
  attendance
) => {
  return {
    attendanceId:
      attendance.attendanceId ??
      attendance.AttendanceId ??
      0,

    employeeId:
      attendance.employeeId ??
      attendance.EmployeeId ??
      0,

    employee:
      attendance.employee ||
      attendance.Employee ||
      "",

    status:
      attendance.status ||
      attendance.Status ||
      ""
  };
};

const normalizeLeave = (leave) => {
  return {
    leaveId:
      leave.leaveId ??
      leave.LeaveId ??
      0,

    employeeId:
      leave.employeeId ??
      leave.EmployeeId ??
      0,

    employee:
      leave.employee ||
      leave.Employee ||
      "",

    status:
      leave.status ||
      leave.Status ||
      ""
  };
};

const normalizePayroll = (payroll) => {
  return {
    payrollId:
      payroll.payrollId ??
      payroll.PayrollId ??
      0,

    employeeId:
      payroll.employeeId ??
      payroll.EmployeeId ??
      0,

    netSalary:
      payroll.netSalary ??
      payroll.NetSalary ??
      0,

    status:
      payroll.status ||
      payroll.Status ||
      ""
  };
};

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [payroll, setPayroll] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  /*
   * Saari Dashboard APIs ko JWT token
   * ke saath parallel mein load karega.
   *
   * Ek API fail hone par bhi baaki APIs
   * ka available data Dashboard par
   * dikhai dega.
   */
  const loadDashboardData =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const results =
          await Promise.allSettled([
            axiosInstance.get(
              "/employees"
            ),

            axiosInstance.get(
              "/departments"
            ),

            axiosInstance.get(
              "/attendance"
            ),

            axiosInstance.get(
              "/leaves"
            ),

            axiosInstance.get(
              "/payroll"
            )
          ]);

        const [
          employeesResult,
          departmentsResult,
          attendanceResult,
          leavesResult,
          payrollResult
        ] = results;

        /*
         * Employees
         */
        if (
          employeesResult.status ===
          "fulfilled"
        ) {
          const employeeData =
            Array.isArray(
              employeesResult.value.data
            )
              ? employeesResult.value.data
              : [];

          setEmployees(
            employeeData.map(
              normalizeEmployee
            )
          );
        } else {
          setEmployees([]);

          console.error(
            "Employees API failed:",
            employeesResult.reason
              ?.response?.status,
            employeesResult.reason
              ?.response?.data
          );
        }

        /*
         * Departments
         */
        if (
          departmentsResult.status ===
          "fulfilled"
        ) {
          const departmentData =
            Array.isArray(
              departmentsResult.value.data
            )
              ? departmentsResult.value.data
              : [];

          setDepartments(
            departmentData.map(
              normalizeDepartment
            )
          );
        } else {
          setDepartments([]);

          console.error(
            "Departments API failed:",
            departmentsResult.reason
              ?.response?.status,
            departmentsResult.reason
              ?.response?.data
          );
        }

        /*
         * Attendance
         */
        if (
          attendanceResult.status ===
          "fulfilled"
        ) {
          const attendanceData =
            Array.isArray(
              attendanceResult.value.data
            )
              ? attendanceResult.value.data
              : [];

          setAttendance(
            attendanceData.map(
              normalizeAttendance
            )
          );
        } else {
          setAttendance([]);

          console.error(
            "Attendance API failed:",
            attendanceResult.reason
              ?.response?.status,
            attendanceResult.reason
              ?.response?.data
          );
        }

        /*
         * Leaves
         */
        if (
          leavesResult.status ===
          "fulfilled"
        ) {
          const leaveData =
            Array.isArray(
              leavesResult.value.data
            )
              ? leavesResult.value.data
              : [];

          setLeaves(
            leaveData.map(
              normalizeLeave
            )
          );
        } else {
          setLeaves([]);

          console.error(
            "Leaves API failed:",
            leavesResult.reason
              ?.response?.status,
            leavesResult.reason
              ?.response?.data
          );
        }

        /*
         * Payroll
         */
        if (
          payrollResult.status ===
          "fulfilled"
        ) {
          const payrollData =
            Array.isArray(
              payrollResult.value.data
            )
              ? payrollResult.value.data
              : [];

          setPayroll(
            payrollData.map(
              normalizePayroll
            )
          );
        } else {
          setPayroll([]);

          console.error(
            "Payroll API failed:",
            payrollResult.reason
              ?.response?.status,
            payrollResult.reason
              ?.response?.data
          );
        }

        /*
         * Failed API names collect karo.
         */
        const failedApis = [];

        if (
          employeesResult.status ===
          "rejected"
        ) {
          failedApis.push("Employees");
        }

        if (
          departmentsResult.status ===
          "rejected"
        ) {
          failedApis.push(
            "Departments"
          );
        }

        if (
          attendanceResult.status ===
          "rejected"
        ) {
          failedApis.push(
            "Attendance"
          );
        }

        if (
          leavesResult.status ===
          "rejected"
        ) {
          failedApis.push("Leaves");
        }

        if (
          payrollResult.status ===
          "rejected"
        ) {
          failedApis.push("Payroll");
        }

        if (failedApis.length > 0) {
          setErrorMessage(
            `${failedApis.join(
              ", "
            )} API load nahi hui. Baaki available data dikhaya ja raha hai.`
          );
        }
      } catch (error) {
        console.error(
          "Dashboard unexpected error:",
          error
        );

        setErrorMessage(
          "Dashboard data load nahi hua. Backend API aur authentication check karo."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /*
   * Attendance summary
   */
  const presentCount =
    useMemo(() => {
      return attendance.filter(
        (item) =>
          String(item.status)
            .trim()
            .toLowerCase() ===
          "present"
      ).length;
    }, [attendance]);

  const absentCount =
    useMemo(() => {
      return attendance.filter(
        (item) =>
          String(item.status)
            .trim()
            .toLowerCase() ===
          "absent"
      ).length;
    }, [attendance]);

  const lateCount =
    useMemo(() => {
      return attendance.filter(
        (item) =>
          String(item.status)
            .trim()
            .toLowerCase() ===
          "late"
      ).length;
    }, [attendance]);

  /*
   * Leave summary
   */
  const approvedLeaves =
    useMemo(() => {
      return leaves.filter(
        (leave) =>
          String(leave.status)
            .trim()
            .toLowerCase() ===
          "approved"
      ).length;
    }, [leaves]);

  const pendingLeaves =
    useMemo(() => {
      return leaves.filter(
        (leave) =>
          String(leave.status)
            .trim()
            .toLowerCase() ===
          "pending"
      ).length;
    }, [leaves]);

  /*
   * Payroll summary
   */
  const totalPayrollAmount =
    useMemo(() => {
      return payroll.reduce(
        (totalAmount, payrollItem) => {
          return (
            totalAmount +
            Number(
              payrollItem.netSalary ||
                0
            )
          );
        },
        0
      );
    }, [payroll]);

  const paidPayroll =
    useMemo(() => {
      return payroll.filter(
        (payrollItem) =>
          String(
            payrollItem.status
          )
            .trim()
            .toLowerCase() ===
          "paid"
      ).length;
    }, [payroll]);

  const pendingPayroll =
    useMemo(() => {
      return payroll.filter(
        (payrollItem) =>
          String(
            payrollItem.status
          )
            .trim()
            .toLowerCase() ===
          "pending"
      ).length;
    }, [payroll]);

  /*
   * Department ke andar total
   * employees count karega.
   */
  const getDepartmentEmployeeCount = (
    departmentName
  ) => {
    const normalizedDepartmentName =
      String(departmentName || "")
        .trim()
        .toLowerCase();

    return employees.filter(
      (employee) =>
        String(
          employee.department || ""
        )
          .trim()
          .toLowerCase() ===
        normalizedDepartmentName
    ).length;
  };

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <main className="main-content">
          {/* Welcome section */}

          <div className="welcome-card">
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div>
                <h2 className="fw-bold">
                  Welcome Back, Admin 👋
                </h2>

                <p className="text-muted mb-0">
                  Manage employees,
                  departments, attendance
                  and payroll from one
                  place.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={
                  loadDashboardData
                }
                disabled={loading}
              >
                <FaSyncAlt className="me-2" />

                {loading
                  ? "Loading..."
                  : "Refresh"}
              </button>
            </div>
          </div>

          {/* API warning */}

          {errorMessage && (
            <div className="alert alert-warning">
              {errorMessage}
            </div>
          )}

          <h2 className="fw-bold mb-4">
            Dashboard
          </h2>

          {/* Main summary cards */}

          <div className="row g-4">
            <div className="col-xl-3 col-md-6">
              <div className="card dashboard-card blue-card h-100">
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

            <div className="col-xl-3 col-md-6">
              <div className="card dashboard-card green-card h-100">
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

            <div className="col-xl-3 col-md-6">
              <div className="card dashboard-card orange-card h-100">
                <div className="card-body">
                  <FaUserCheck size={35} />

                  <h5 className="mt-3">
                    Attendance
                  </h5>

                  <h2 className="fw-bold">
                    {attendance.length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card dashboard-card purple-card h-100">
                <div className="card-body">
                  <FaCalendarAlt
                    size={35}
                  />

                  <h5 className="mt-3">
                    Leaves
                  </h5>

                  <h2 className="fw-bold">
                    {leaves.length}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Department-wise employees */}

          <div className="row g-4 mt-3">
            <div className="col-12">
              <div className="card glass-card p-4">
                <h4 className="fw-bold mb-3">
                  Department Wise
                  Employees
                </h4>

                {loading ? (
                  <p className="text-muted mb-0">
                    Department data
                    loading...
                  </p>
                ) : departments.length ===
                  0 ? (
                  <p className="text-muted mb-0">
                    No Departments Found
                  </p>
                ) : (
                  departments.map(
                    (department) => {
                      const employeeCount =
                        getDepartmentEmployeeCount(
                          department.departmentName
                        );

                      const percentage =
                        employees.length >
                        0
                          ? Math.round(
                              (
                                employeeCount /
                                employees.length
                              ) * 100
                            )
                          : 0;

                      return (
                        <div
                          key={
                            department.departmentId ||
                            department.departmentName
                          }
                          className="mb-4"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>
                              {department.departmentName ||
                                "Unnamed Department"}
                            </strong>

                            <span>
                              {employeeCount}{" "}
                              Employee(s)
                            </span>
                          </div>

                          <div
                            className="progress"
                            style={{
                              height:
                                "25px",
                              borderRadius:
                                "10px"
                            }}
                          >
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              aria-valuenow={
                                percentage
                              }
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{
                                width:
                                  `${percentage}%`
                              }}
                            >
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>
          </div>

          {/* Detailed cards */}

          <div className="row g-4 mt-3">
            <div className="col-lg-4">
              <div className="card glass-card p-4 h-100">
                <FaClipboardList
                  size={35}
                  className="text-primary mb-2"
                />

                <h5 className="fw-bold">
                  Leave Requests
                </h5>

                <h2 className="fw-bold">
                  {leaves.length}
                </h2>

                <p className="text-muted mb-0">
                  Approved:{" "}
                  {approvedLeaves} |
                  Pending:{" "}
                  {pendingLeaves}
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card glass-card p-4 h-100">
                <FaUserCheck
                  size={35}
                  className="text-success mb-2"
                />

                <h5 className="fw-bold">
                  Attendance
                </h5>

                <p className="mb-1">
                  Present:{" "}
                  {presentCount}
                </p>

                <p className="mb-1">
                  Absent:{" "}
                  {absentCount}
                </p>

                <p className="mb-0">
                  Late: {lateCount}
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card glass-card p-4 h-100">
                <FaMoneyBill
                  size={35}
                  className="text-warning mb-2"
                />

                <h5 className="fw-bold">
                  Payroll
                </h5>

                <h2 className="fw-bold">
                  ₹
                  {totalPayrollAmount
                    .toLocaleString(
                      "en-IN"
                    )}
                </h2>

                <p className="text-muted mb-0">
                  Paid:{" "}
                  {paidPayroll} |
                  Pending:{" "}
                  {pendingPayroll}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}

          <div className="card glass-card p-4 mt-4">
            <h4 className="fw-bold mb-3">
              Quick Actions
            </h4>

            <button
              type="button"
              className="btn btn-primary me-2 mb-2"
              onClick={() =>
                navigate(
                  "/addemployee"
                )
              }
            >
              + Add Employee
            </button>

            <button
              type="button"
              className="btn btn-success me-2 mb-2"
              onClick={() =>
                navigate(
                  "/attendance"
                )
              }
            >
              Mark Attendance
            </button>

            <button
              type="button"
              className="btn btn-warning me-2 mb-2"
              onClick={() =>
                navigate("/leaves")
              }
            >
              Manage Leaves
            </button>

            <button
              type="button"
              className="btn btn-dark mb-2"
              onClick={() =>
                navigate("/payroll")
              }
            >
              Manage Payroll
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
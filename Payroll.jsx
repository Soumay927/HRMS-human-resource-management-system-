import {
  useCallback,
  useEffect,
  useState
} from "react";

import axiosInstance from"../api/axiosInstance";

import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";


const emptyPayrollForm = {
  EmployeeId: "",
  Month: "",
  BasicSalary: "",
  Bonus: "",
  Deductions: ""
};

function Payroll() {
  const [showModal, setShowModal] =
    useState(false);

  const [
    selectedPayroll,
    setSelectedPayroll
  ] = useState(null);

  const [payrolls, setPayrolls] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [payrollForm, setPayrollForm] =
    useState(emptyPayrollForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const normalizeEmployee = (employee) => ({
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

    salary:
      employee.salary ??
      employee.Salary ??
      0
  });

  const normalizePayroll = (payroll) => ({
    id:
      payroll.id ||
      payroll.Id ||
      "",

    payrollId:
      payroll.payrollId ??
      payroll.PayrollId ??
      "",

    employeeId:
      payroll.employeeId ??
      payroll.EmployeeId ??
      "",

    month:
      payroll.month ||
      payroll.Month ||
      "",

    basicSalary:
      payroll.basicSalary ??
      payroll.BasicSalary ??
      0,

    bonus:
      payroll.bonus ??
      payroll.Bonus ??
      0,

    deductions:
      payroll.deductions ??
      payroll.Deductions ??
      0,

    netSalary:
      payroll.netSalary ??
      payroll.NetSalary ??
      0,

    status:
      payroll.status ||
      payroll.Status ||
      "Pending"
  });

  const loadEmployees = useCallback(
    async () => {
      try {
        const response = await axiosInstance.get("/employees");

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        setEmployees(
          data.map(normalizeEmployee)
        );
      } catch (error) {
        console.error(
          "Employee loading error:",
          error
        );

        setEmployees([]);

        setErrorMessage(
          "Employees load nahi hue. Employee API check karo."
        );
      }
    },
    []
  );

  const loadPayroll = useCallback(
    async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await axiosInstance.get("/payroll");

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        setPayrolls(
          data.map(normalizePayroll)
        );
      } catch (error) {
        console.error(
          "Payroll loading error:",
          error
        );

        const message =
          error.response?.data?.Message ||
          error.response?.data?.message ||
          error.response?.data
            ?.ExceptionMessage ||
          error.message ||
          "Failed to load payroll.";

        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadEmployees();
    loadPayroll();
  }, [loadEmployees, loadPayroll]);

  
  const handleInputChange = (event) => {
  const { name, value } = event.target;

  setPayrollForm((currentForm) => ({
    ...currentForm,
    [name]:value
  }));
};

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;

    const selectedEmployee = employees.find(
      (employee) =>
        Number(employee.employeeId) ===
        Number(employeeId)
    );

    setPayrollForm((currentForm) => ({
      ...currentForm,

      EmployeeId: employeeId,

      BasicSalary: selectedEmployee
        ? String(
            selectedEmployee.salary || ""
          )
        : ""
    }));
  };

  const resetPayrollForm = () => {
    setPayrollForm({
      ...emptyPayrollForm
    });
  };

  const openGenerateModal = () => {
    resetPayrollForm();
    setErrorMessage("");
    setShowModal(true);
  };

  const closeGenerateModal = () => {
    if (saving) {
      return;
    }

    resetPayrollForm();
    setShowModal(false);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (item) =>
        Number(item.employeeId) ===
        Number(employeeId)
    );

    return employee
      ? employee.fullName
      : `Employee ${employeeId}`;
  };

  const generatePayroll = async (event) => {
    event.preventDefault();

    console.log(
      "Current form data:",
      payrollForm
    );

    if (!payrollForm.EmployeeId) {
      alert("Employee select karo.");
      return;
    }

    if (!payrollForm.Month.trim()) {
      alert("Month enter karo.");
      return;
    }

    if (!payrollForm.BasicSalary) {
      alert("Basic Salary enter karo.");
      return;
    }

    const requestData = {
      EmployeeId: Number(
        payrollForm.EmployeeId
      ),

      Month:
        payrollForm.Month.trim(),

      BasicSalary: Number(
        payrollForm.BasicSalary
      ),

      Bonus: Number(
        payrollForm.Bonus || 0
      ),

      Deductions: Number(
        payrollForm.Deductions || 0
      ),

      Status: "Pending"
    };

    console.log(
      "Data going to payroll API:",
      requestData
    );

    if (
      Number.isNaN(
        requestData.EmployeeId
      ) ||
      requestData.EmployeeId <= 0
    ) {
      alert("Valid employee select karo.");
      return;
    }

    if (
      Number.isNaN(
        requestData.BasicSalary
      ) ||
      requestData.BasicSalary <= 0
    ) {
      alert(
        "Basic Salary zero se greater honi chahiye."
      );
      return;
    }

    if (
      Number.isNaN(requestData.Bonus) ||
      requestData.Bonus < 0
    ) {
      alert("Valid Bonus enter karo.");
      return;
    }

    if (
      Number.isNaN(
        requestData.Deductions
      ) ||
      requestData.Deductions < 0
    ) {
      alert(
        "Valid Deductions enter karo."
      );
      return;
    }

    const calculatedNetSalary =
      requestData.BasicSalary +
      requestData.Bonus -
      requestData.Deductions;

    if (calculatedNetSalary < 0) {
      alert(
        "Net Salary negative nahi ho sakti."
      );
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      const response = await axiosInstance.post(
        `/payroll`,
        requestData,
        {
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );

      console.log(
        "Payroll API response:",
        response.data
      );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Payroll Generated Successfully"
      );

      resetPayrollForm();
      setShowModal(false);

      await loadPayroll();
    } catch (error) {
      console.error(
        "Payroll API error:",
        error
      );

      console.error(
        "Error status:",
        error.response?.status
      );

      console.error(
        "Error response:",
        error.response?.data
      );

      let message;

      if (!error.response) {
        message =
          "Payroll API connect nahi ho rahi. Visual Studio API run karo.";
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
          `Payroll Generate Failed. Status: ${error.response.status}`;
      }

      setErrorMessage(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const markAsPaid = async (payrollId) => {
    try {
      const response = await axiosInstance.get("/payroll");

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Payroll Marked as Paid"
      );

      await loadPayroll();
    } catch (error) {
      console.error(
        "Mark Paid error:",
        error
      );

      const message =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.response?.data?.Error ||
        error.response?.data
          ?.ExceptionMessage ||
        "Mark Paid Failed";

      alert(message);
    }
  };

  const totalPayroll =
    payrolls.reduce(
      (total, payroll) =>
        total +
        Number(
          payroll.netSalary || 0
        ),
      0
    );

  const paidEmployees =
    payrolls.filter(
      (payroll) =>
        String(payroll.status)
          .trim()
          .toLowerCase() === "paid"
    ).length;

  const pendingPayroll =
    payrolls.filter(
      (payroll) =>
        String(payroll.status)
          .trim()
          .toLowerCase() ===
        "pending"
    ).length;

  const netSalaryPreview =
    Number(
      payrollForm.BasicSalary || 0
    ) +
    Number(
      payrollForm.Bonus || 0
    ) -
    Number(
      payrollForm.Deductions || 0
    );

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">
              Payroll Management
            </h2>

            <p className="text-muted mb-0">
              Manage salary, deductions,
              bonuses and monthly payroll.
            </p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card dashboard-card blue-card">
                <div className="card-body">
                  <h5>Total Payroll</h5>

                  <h2 className="fw-bold">
                    ₹
                    {totalPayroll.toLocaleString(
                      "en-IN"
                    )}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card green-card">
                <div className="card-body">
                  <h5>
                    Paid Employees
                  </h5>

                  <h2 className="fw-bold">
                    {paidEmployees}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card dashboard-card orange-card">
                <div className="card-body">
                  <h5>
                    Pending Payroll
                  </h5>

                  <h2 className="fw-bold">
                    {pendingPayroll}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card p-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">
                Payroll Records
              </h4>

              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  openGenerateModal
                }
              >
                + Generate Payroll
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Month</th>
                    <th>
                      Basic Salary
                    </th>
                    <th>Bonus</th>
                    <th>
                      Deductions
                    </th>
                    <th>
                      Net Salary
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payrolls.map(
                    (payroll) => (
                      <tr
                        key={
                          payroll.id ||
                          payroll.payrollId
                        }
                      >
                        <td>
                          {getEmployeeName(
                            payroll.employeeId
                          )}
                        </td>

                        <td>
                          {payroll.month}
                        </td>

                        <td>
                          ₹
                          {Number(
                            payroll.basicSalary ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          ₹
                          {Number(
                            payroll.bonus ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          ₹
                          {Number(
                            payroll.deductions ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              payroll.netSalary ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              String(
                                payroll.status
                              )
                                .toLowerCase() ===
                              "paid"
                                ? "badge bg-success"
                                : "badge bg-warning text-dark"
                            }
                          >
                            {
                              payroll.status
                            }
                          </span>
                        </td>

                        <td>
                          {String(
                            payroll.status
                          )
                            .toLowerCase() ===
                            "pending" && (
                            <button
                              type="button"
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                markAsPaid(
                                  payroll.payrollId
                                )
                              }
                            >
                              Mark Paid
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setSelectedPayroll(
                                payroll
                              )
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {!loading &&
              payrolls.length === 0 && (
                <div className="text-center mt-4">
                  <h5 className="text-muted">
                    No payroll records
                    found
                  </h5>
                </div>
              )}

            {loading && (
              <div className="text-center mt-4">
                <h5 className="text-muted">
                  Payroll records
                  loading...
                </h5>
              </div>
            )}
          </div>

          {/* Generate Payroll Modal */}

          {showModal && (
            <div className="modal-overlay">
              <div className="leave-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">
                    Generate Payroll
                  </h4>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={
                      closeGenerateModal
                    }
                    disabled={saving}
                  >
                    X
                  </button>
                </div>

                <form
                  onSubmit={
                    generatePayroll
                  }
                >
                  <label className="form-label">
                    Employee
                  </label>

                  <select
                    name="EmployeeId"
                    className="form-control mb-3"
                    value={
                      payrollForm.EmployeeId
                    }
                    onChange={
                      handleEmployeeChange
                    }
                    required
                  >
                    <option value="">
                      Select Employee
                    </option>

                    {employees.map(
                      (employee) => (
                        <option
                          key={
                            employee.employeeId
                          }
                          value={
                            employee.employeeId
                          }
                        >
                          {
                            employee.fullName
                          }

                          {employee.employeeCode
                            ? ` (${employee.employeeCode})`
                            : ""}
                        </option>
                      )
                    )}
                  </select>

                  {employees.length ===
                    0 && (
                    <div className="alert alert-warning py-2">
                      Koi employee
                      available nahi hai.
                      Pehle employee add
                      karo.
                    </div>
                  )}

                  <label className="form-label">
                    Month
                  </label>

                  <input
                    type="text"
                    name="Month"
                    className="form-control mb-3"
                    value={
                      payrollForm.Month
                    }
                    placeholder="August 2026"
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                  <label className="form-label">
                    Basic Salary
                  </label>

                  <input
                    type="number"
                    name="BasicSalary"
                    className="form-control mb-3"
                    value={
                      payrollForm.BasicSalary
                    }
                    placeholder="50000"
                    min="1"
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                  <label className="form-label">
                    Bonus
                  </label>

                  <input
                    type="number"
                    name="Bonus"
                    className="form-control mb-3"
                    value={
                      payrollForm.Bonus
                    }
                    placeholder="3000"
                    min="0"
                    onChange={
                      handleInputChange
                    }
                  />

                  <label className="form-label">
                    Deductions
                  </label>

                  <input
                    type="number"
                    name="Deductions"
                    className="form-control mb-3"
                    value={
                      payrollForm.Deductions
                    }
                    placeholder="2000"
                    min="0"
                    onChange={
                      handleInputChange
                    }
                  />

                  <div className="card p-3 mb-3 bg-light">
                    <strong>
                      Net Salary Preview:
                    </strong>

                    <span>
                      ₹
                      {netSalaryPreview.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={
                      saving ||
                      employees.length ===
                        0
                    }
                  >
                    {saving
                      ? "Generating..."
                      : "Generate Payslip"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* View Payslip Modal */}

          {selectedPayroll && (
            <div className="modal-overlay">
              <div className="leave-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">
                    Payslip Details
                  </h4>

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      setSelectedPayroll(
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
                  {getEmployeeName(
                    selectedPayroll.employeeId
                  )}
                </p>

                <p>
                  <strong>Month:</strong>{" "}
                  {
                    selectedPayroll.month
                  }
                </p>

                <p>
                  <strong>
                    Basic Salary:
                  </strong>{" "}
                  ₹
                  {Number(
                    selectedPayroll.basicSalary ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  <strong>Bonus:</strong>{" "}
                  ₹
                  {Number(
                    selectedPayroll.bonus ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  <strong>
                    Deductions:
                  </strong>{" "}
                  ₹
                  {Number(
                    selectedPayroll.deductions ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

                <hr />

                <h5>
                  Net Salary: ₹
                  {Number(
                    selectedPayroll.netSalary ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </h5>

                <p>
                  <strong>Status:</strong>{" "}

                  <span
                    className={
                      String(
                        selectedPayroll.status
                      ).toLowerCase() ===
                      "paid"
                        ? "badge bg-success"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {
                      selectedPayroll.status
                    }
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Payroll;
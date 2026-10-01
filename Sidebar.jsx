import { Link, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaBuilding,
  FaCalendarCheck,
  FaMoneyBill,
  FaClipboardList,
  FaChartBar,
  FaCog
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    return isActive(path)
      ? "sidebar-link active-sidebar-link"
      : "sidebar-link";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">HRMS</div>

      <Link className={linkClass("/dashboard")} to="/dashboard">
        <FaTachometerAlt className="me-2" />
        Dashboard
      </Link>

      <Link className={linkClass("/employees")} to="/employees">
        <FaUsers className="me-2" />
        Employees
      </Link>

      <Link className={linkClass("/addemployee")} to="/addemployee">
        <FaUserPlus className="me-2" />
        Add Employee
      </Link>

      <Link className={linkClass("/departments")} to="/departments">
        <FaBuilding className="me-2" />
        Departments
      </Link>

      <Link className={linkClass("/attendance")} to="/attendance">
        <FaCalendarCheck className="me-2" />
        Attendance
      </Link>

      <Link className={linkClass("/payroll")} to="/payroll">
        <FaMoneyBill className="me-2" />
        Payroll
      </Link>

      <Link className={linkClass("/leaves")} to="/leaves">
  <FaClipboardList className="me-2" />
  Leave Management
</Link>

      <Link className={linkClass("/reports")} to="/reports">
        <FaChartBar className="me-2" />
        Reports
      </Link>

      <Link className={linkClass("/settings")} to="/settings">
        <FaCog className="me-2" />
        Settings
      </Link>
    </div>
  );
}

export default Sidebar;
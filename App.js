import React from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import "./App.css";

import ProtectedRoute from
  "./Component/ProtectedRoute";

import Login from
  "./Pages/Login";

import Register from
  "./Pages/Register";

import Dashboard from
  "./Pages/Dashboard";

import EmployeeList from
  "./Pages/EmployeeList";

import AddEmployee from
  "./Pages/AddEmployee";

import EditEmployee from
  "./Pages/EditEmployee";

import EmployeeDetails from
  "./Pages/EmployeeDetails";

import Departments from
  "./Pages/Departments";

import Attendance from
  "./Pages/Attendance";

import LeaveManagement from
  "./Pages/LeaveManagement";

import Payroll from
  "./Pages/Payroll";

import Reports from
  "./Pages/Reports";

import Settings from
  "./Pages/Settings";

function App() {
  const accessToken =
    sessionStorage.getItem(
      "accessToken"
    );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}

        <Route
          path="/login"
          element={
            accessToken ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            accessToken ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected routes */}

        <Route
          element={<ProtectedRoute />}
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/employees"
            element={<EmployeeList />}
          />

          <Route
            path="/addemployee"
            element={<AddEmployee />}
          />

          <Route
            path="/employees/edit/:employeeId"
            element={<EditEmployee />}
          />

          <Route
            path="/employees/view/:employeeId"
            element={<EmployeeDetails />}
          />

          <Route
            path="/departments"
            element={<Departments />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/leaves"
            element={<LeaveManagement />}
          />

          <Route
            path="/payroll"
            element={<Payroll />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        {/* Default route */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                accessToken
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        {/* Invalid route */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                accessToken
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
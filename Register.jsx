import React, { useState } from "react";
import axios from "axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

const API_BASE_URL =
  "https://localhost:44320/api";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialFormData);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  /*
   * Input name ke according
   * form ki correct property update hogi.
   */
  const updateFullName = (event) => {
  setFormData((currentForm) => ({
    ...currentForm,
    fullName: event.target.value
  }));

  setErrorMessage("");
};

const updateEmail = (event) => {
  setFormData((currentForm) => ({
    ...currentForm,
    email: event.target.value
  }));

  setErrorMessage("");
};

const updatePassword = (event) => {
  setFormData((currentForm) => ({
    ...currentForm,
    password: event.target.value
  }));

  setErrorMessage("");
};

const updateConfirmPassword = (event) => {
  setFormData((currentForm) => ({
    ...currentForm,
    confirmPassword: event.target.value
  }));

  setErrorMessage("");
};


  const registerUser = async (
    event
  ) => {
    event.preventDefault();

    const fullName =
      formData.fullName.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;

    if (!fullName) {
      setErrorMessage(
        "Full Name enter karo."
      );

      return;
    }

    if (fullName.length < 2) {
      setErrorMessage(
        "Full Name minimum 2 characters ka hona chahiye."
      );

      return;
    }

    if (!email) {
      setErrorMessage(
        "Email enter karo."
      );

      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setErrorMessage(
        "Valid email address enter karo."
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        "Password enter karo."
      );

      return;
    }

    if (password.length < 10) {
      setErrorMessage(
        "Password minimum 10 characters ka hona chahiye."
      );

      return;
    }

    if (!confirmPassword) {
      setErrorMessage(
        "Confirm Password enter karo."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setErrorMessage(
        "Password aur Confirm Password match nahi kar rahe."
      );

      return;
    }

    const requestData = {
      FullName: fullName,
      Email: email,
      Password: password
    };

    try {
      setLoading(true);
      setErrorMessage("");

      const response =
        await axios.post(
          `${API_BASE_URL}/auth/register`,
          requestData,
          {
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );

      console.log(
        "Registration response:",
        response.data
      );

      alert(
        response.data?.Message ||
          response.data?.message ||
          "Registration successful."
      );

      setFormData({
        ...initialFormData
      });

      navigate("/login", {
        replace: true
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      console.error(
        "Registration status:",
        error.response?.status
      );

      console.error(
        "Registration response:",
        error.response?.data
      );

      let message =
        "Registration failed.";

      if (!error.response) {
        message =
          "Registration API connect nahi ho rahi. Backend API run karo.";
      } else if (
        error.response.status === 409
      ) {
        message =
          error.response.data?.Message ||
          error.response.data?.message ||
          "Email already registered hai.";
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
            "Registration details invalid hain.";
        }
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
          `Registration failed. Status: ${error.response.status}`;
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>HHRMS</h1>

        <p>
          Create a secure account to
          manage employees, departments,
          attendance, leaves and payroll.
        </p>

        <div className="login-feature-box">
          <h5>
            Secure Registration
          </h5>

          <p className="mb-0">
            Password securely hashed form
            mein database mein save hoga.
          </p>
        </div>
      </div>

      <div className="login-card register-card">
        <h2 className="fw-bold mb-2">
          Create Account
        </h2>

        <p className="text-muted mb-4">
          Register your HHRMS account.
        </p>

        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        <form onSubmit={registerUser}>
          <label className="form-label">
            Full Name
          </label>

          <input
  type="text"
  className="form-control mb-3"
  placeholder="Enter full name"
  value={formData.fullName}
  onChange={updateFullName}
  autoComplete="name"
  disabled={loading}
  required
/>

          <label className="form-label">
            Email
          </label>

          <input
  type="email"
  className="form-control mb-3"
  placeholder="Enter email"
  value={formData.email}
  onChange={updateEmail}
  autoComplete="email"
  disabled={loading}
  required
/>

          <label className="form-label">
            Password
          </label>

          <input
  type="password"
  className="form-control mb-3"
  placeholder="Minimum 10 characters"
  value={formData.password}
  onChange={updatePassword}
  autoComplete="new-password"
  disabled={loading}
  required
/>

          <label className="form-label">
            Confirm Password
          </label>

          <input
  type="password"
  className="form-control mb-3"
  placeholder="Enter password again"
  value={formData.confirmPassword}
  onChange={updateConfirmPassword}
  autoComplete="new-password"
  disabled={loading}
  required
/>
          <button
            type="submit"
            className="btn btn-primary login-btn w-100"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <p className="auth-switch-text">
            Already have an account?{" "}

            <Link to="/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
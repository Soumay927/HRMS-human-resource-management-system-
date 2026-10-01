import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate
} from "react-router-dom";

const API_BASE_URL =
  "https://localhost:44320/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [
    challengeId,
    setChallengeId
  ] = useState("");

  const [
    loginStep,
    setLoginStep
  ] = useState("PASSWORD");

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage
  ] = useState("");

  const [
    secondsLeft,
    setSecondsLeft
  ] = useState(0);

  /*
   * Existing valid token ho to
   * Dashboard par redirect karega.
   */
  useEffect(() => {
    const existingToken =
      sessionStorage.getItem(
        "accessToken"
      );

    if (existingToken) {
      navigate("/dashboard", {
        replace: true
      });
    }
  }, [navigate]);

  /*
   * OTP expiry countdown.
   */
  useEffect(() => {
    if (
      loginStep !== "OTP" ||
      secondsLeft <= 0
    ) {
      return undefined;
    }

    const timerId =
      window.setTimeout(() => {
        setSecondsLeft(
          (currentSeconds) =>
            Math.max(
              currentSeconds - 1,
              0
            )
        );
      }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [
    loginStep,
    secondsLeft
  ]);

  /*
   * API error ko readable message
   * mein convert karega.
   */
  const getApiErrorMessage = (
    error,
    fallbackMessage
  ) => {
    const apiData =
      error.response?.data;

    if (
      typeof apiData === "string"
    ) {
      return apiData;
    }

    const messageParts = [
      apiData?.Message ||
        apiData?.message,

      apiData?.Error ||
        apiData?.error,

      apiData?.InnerError ||
        apiData?.innerError
    ].filter(Boolean);

    if (messageParts.length > 0) {
      return messageParts.join(" ");
    }

    if (!error.response) {
      return (
        error.message ||
        "Backend API connect nahi ho rahi."
      );
    }

    return fallbackMessage;
  };

  /*
   * Step 1:
   * Email aur password verify karke
   * OTP send karayega.
   */
  const loginWithPassword = async (
    event
  ) => {
    event.preventDefault();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage(
        "Email enter karo."
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        "Password enter karo."
      );

      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response =
        await axios.post(
          `${API_BASE_URL}/auth/login`,
          {
            Email:
              normalizedEmail,

            Password:
              password
          },
          {
            headers: {
              "Content-Type":
                "application/json"
            }
          }
        );

      console.log(
        "Login response:",
        response.data
      );

      const requiresOtp =
        response.data?.RequiresOtp ??
        response.data?.requiresOtp;

      const receivedChallengeId =
        response.data?.ChallengeId ??
        response.data?.challengeId;

      const expiresInSeconds =
        Number(
          response.data
            ?.ExpiresInSeconds ??
          response.data
            ?.expiresInSeconds ??
          300
        );

      if (
        !requiresOtp ||
        !receivedChallengeId
      ) {
        throw new Error(
          "OTP challenge API response mein nahi mila."
        );
      }

      setChallengeId(
        receivedChallengeId
      );

      setSecondsLeft(
        expiresInSeconds > 0
          ? expiresInSeconds
          : 300
      );

      setOtp("");
      setLoginStep("OTP");

      setSuccessMessage(
        response.data?.Message ||
          response.data?.message ||
          "OTP registered email par send kar di gayi hai."
      );
    } catch (error) {
      console.error(
        "Password login error:",
        error
      );

      console.error(
        "Login API response:",
        error.response?.data
      );

      setErrorMessage(
        getApiErrorMessage(
          error,
          "Login failed."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Step 2:
   * OTP verify karke JWT token save
   * karega.
   */
 const verifyOtp = async (event) => {
  event.preventDefault();

  if (!otp || otp.length !== 6) {
    setErrorMessage("Valid 6 digit OTP enter karo.");
    return;
  }

  try {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const response = await axios.post(
      `${API_BASE_URL}/auth/verify-otp`,
      {
        ChallengeId: challengeId,
        Otp: otp
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("OTP Verify Response:", response.data);

    if (!response.data?.Token) {
      throw new Error("Token receive nahi hua.");
    }

    sessionStorage.setItem(
      "accessToken",
      response.data.Token
    );

    sessionStorage.setItem(
      "authUser",
      JSON.stringify(response.data.User)
    );

    console.log(
      "Saved Token:",
      sessionStorage.getItem("accessToken")
    );

    setSuccessMessage("Login successful.");

    navigate("/dashboard", {
      replace: true
    });
  } catch (error) {
    console.error(
      "OTP Verification Error:",
      error
    );

    setErrorMessage(
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.message ||
      "OTP verification failed."
    );
  } finally {
    setLoading(false);
  }
};
  

  /*
   * Password step par wapas jayega.
   */
  const backToPasswordStep = () => {
    setLoginStep("PASSWORD");
    setOtp("");
    setChallengeId("");
    setSecondsLeft(0);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const formatTime = (
    totalSeconds
  ) => {
    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${minutes}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>HHRMS</h1>

        <p>
          Manage employees,
          departments, attendance,
          leaves and payroll securely.
        </p>

        <div className="login-feature-box">
          <h5>
            Secure Authentication
          </h5>

          <p className="mb-0">
            Password and email OTP
            verification protect your
            account.
          </p>
        </div>
      </div>

      <div className="login-card">
        <h2 className="fw-bold mb-2">
          {loginStep === "PASSWORD"
            ? "Sign In"
            : "Verify OTP"}
        </h2>

        <p className="text-muted mb-4">
          {loginStep === "PASSWORD"
            ? "Continue to your HHRMS account."
            : "Registered email par bheja gaya verification code enter karo."}
        </p>

        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {loginStep ===
        "PASSWORD" ? (
          <form
            onSubmit={
              loginWithPassword
            }
          >
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value
                );

                setErrorMessage("");
              }}
              autoComplete="username"
              disabled={loading}
              required
            />

            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );

                setErrorMessage("");
              }}
              autoComplete="current-password"
              disabled={loading}
              required
            />

            <button
              type="submit"
              className="btn btn-primary login-btn w-100"
              disabled={loading}
            >
              {loading
                ? "Checking..."
                : "Continue"}
            </button>

            <p className="auth-switch-text">
              Don't have an account?{" "}

              <Link to="/register">
                Create Account
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <label className="form-label">
              6-digit OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              className="form-control mb-2 text-center"
              placeholder="000000"
              value={otp}
              onChange={(event) => {
                const numericValue =
                  event.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(0, 6);

                setOtp(numericValue);
                setErrorMessage("");
              }}
              autoComplete="one-time-code"
              disabled={loading}
              required
            />

            <p className="text-muted text-center">
              {secondsLeft > 0
                ? `OTP expires in ${formatTime(
                    secondsLeft
                  )}`
                : "OTP expired"}
            </p>

            <button
              type="submit"
              className="btn btn-primary login-btn w-100"
              disabled={
                loading ||
                secondsLeft <= 0 ||
                otp.length !== 6
              }
            >
              {loading
                ? "Verifying..."
                : "Verify and Sign In"}
            </button>

            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={
                backToPasswordStep
              }
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import { FaUserCircle, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <nav className="top-navbar d-flex justify-content-between align-items-center px-4">
      <h4 className="mb-0 fw-bold">HRMS Portal</h4>

      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light btn-sm shadow-sm"
          onClick={toggleDarkMode}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="position-relative">
          <button
            className="btn btn-light d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaUserCircle size={22} />
            Admin
          </button>

          {showMenu && (
            <div className="profile-dropdown shadow-lg">
              <div className="p-3 border-bottom">
                <h6 className="mb-0 fw-bold">Admin User</h6>
                <small className="text-muted">admin@hrms.com</small>
              </div>

              <button
                className="dropdown-item-custom"
                onClick={() => (window.location.href = "/settings")}
              >
                Profile Settings
              </button>

              <button
                className="dropdown-item-custom text-danger"
                onClick={logout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
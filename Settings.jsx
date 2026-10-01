import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

function Settings() {
  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-card">
            <h2 className="fw-bold">
              Settings
            </h2>

            <p className="text-muted mb-0">
              Manage system preferences, profile and HRMS configuration.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card glass-card p-4">
                <h4 className="fw-bold mb-3">
                  Company Settings
                </h4>

                <label className="form-label">
                  Company Name
                </label>

                <input
                  className="form-control mb-3"
                  value="HRMS Portal"
                  readOnly
                />

                <label className="form-label">
                  Admin Email
                </label>

                <input
                  className="form-control mb-3"
                  value="admin@hrms.com"
                  readOnly
                />

                <button className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card glass-card p-4">
                <h4 className="fw-bold mb-3">
                  System Preferences
                </h4>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked
                    readOnly
                  />

                  <label className="form-check-label">
                    Enable Notifications
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked
                    readOnly
                  />

                  <label className="form-check-label">
                    Enable Email Alerts
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    readOnly
                  />

                  <label className="form-check-label">
                    Dark Mode
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Settings;
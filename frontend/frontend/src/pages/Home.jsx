import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="container-fluid text-center text-white px-5">

        {/* Title */}
        <h1 className="display-3 fw-bold mb-4">
          AI Civil Infrastructure Intelligence
        </h1>

        {/* Subtitle */}
        <p className="lead mb-5 mx-auto" style={{ maxWidth: "900px" }}>
          Advanced AI-powered system for detecting structural cracks and analyzing
          water quality to ensure safety, sustainability, and smart infrastructure.
        </p>

        {/* Cards Row */}
        <div className="row justify-content-center g-5 px-md-5">

          {/* Crack Detection Card */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-lg border-0 h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <h3 className="fw-bold mb-3">Crack Detection</h3>
                <p className="text-muted mb-4">
                  Upload images of buildings, roads, or bridges and detect structural cracks
                  accurately using AI-powered computer vision models.
                </p>
              </div>
              <Link to="/crack" className="btn btn-primary btn-lg mt-3">
                Analyze Structure
              </Link>
            </div>
          </div>

          {/* Water Quality Card */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-lg border-0 h-100 p-4 d-flex flex-column justify-content-between">
              <div>
                <h3 className="fw-bold mb-3">Water Quality Analysis</h3>
                <p className="text-muted mb-4">
                  Measure water parameters like pH, hardness, and turbidity to determine
                  potability and ensure safe consumption using AI analytics.
                </p>
              </div>
              <Link to="/water" className="btn btn-success btn-lg mt-3">
                Check Water Quality
              </Link>
            </div>
          </div>

        </div>

        <p className="mt-5 text-light opacity-75">
          © 2026 AI Infrastructure Monitoring Platform
        </p>
      </div>
    </div>
  );
}


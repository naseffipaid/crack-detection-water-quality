import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function WaterQuality() {
  const [data, setData] = useState({
    ph: 7,
    Hardness: 150,
    Solids: 500,
    Chloramines: 5,
    Sulfate: 250,
    Conductivity: 400,
    Organic_carbon: 10,
    Trihalomethanes: 50,
    Turbidity: 5,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: parseFloat(e.target.value) });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/predict_water_quality", data);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error predicting water quality. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 w-100"
      style={{
        background: "linear-gradient(135deg, #0f2027, #1c3a43, #2c5364)",
        color: "white",
        minWidth: "100vw",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <header className="d-flex flex-column flex-md-row align-items-center justify-content-between py-4 px-3 mx-auto w-100" style={{ maxWidth: "1200px" }}>
        <div>
          <h1 className="display-5 fw-bold mb-2 mb-md-0">AI Water Quality Analysis</h1>
          <p className="lead text-light mb-0" style={{ maxWidth: "600px" }}>
            Predict water potability instantly with AI-powered analysis.
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/" className="btn btn-outline-light btn-lg">
            Home
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-4">
        <div
          className="card shadow-lg border-0 p-4 bg-light w-100"
          style={{
            borderRadius: "12px",
            maxWidth: "800px",
            minWidth: "300px",
          }}
        >
          <h2 className="fw-bold mb-4 text-success text-center">
            Water Quality Parameters
          </h2>
          <p className="text-muted text-center mb-4">
            Enter the values below and predict water potability.
          </p>

          {/* Inputs */}
          <div className="row g-3">
            {Object.keys(data).map((key) => (
              <div key={key} className="col-6 col-md-4">
                <label className="form-label fw-bold text-dark">{key}</label>
                <input
                  type="number"
                  className="form-control"
                  name={key}
                  value={data[key]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-success btn-lg w-100 mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Predict Water Quality"}
          </button>

          {/* Result */}
          {result && (
            <div className="alert alert-info mt-3 p-3 text-center">
              <h5 className="fw-bold">Result: {result.prediction}</h5>
              <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-light opacity-75">
        © 2026 AI Water Quality Platform
      </footer>
    </div>
  );
}


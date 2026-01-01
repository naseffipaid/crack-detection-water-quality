import { useState } from "react";
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
    setData({ ...data, [e.target.name]: e.target.value });

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
      {/* Top Header */}
      <header className="py-4 text-center px-3">
        <h1 className="display-4 display-md-3 fw-bold">
          AI Water Quality Analysis
        </h1>
        <p className="lead mx-auto mb-0" style={{ maxWidth: "1200px" }}>
          Ensure safe and potable water with our AI-powered water quality
          prediction. Simple, fast, and reliable.
        </p>
      </header>

      {/* Main Card */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
        <div
          className="card shadow-lg border-0 p-5 bg-light w-100"
          style={{
            borderRadius: "0",
            maxWidth: "900px",
            minWidth: "300px",
          }}
        >
          <h2 className="fw-bold mb-4 text-success text-center">
            Water Quality Prediction
          </h2>
          <p className="text-muted text-center mb-4">
            Adjust the parameters below using sliders or inputs and check if
            water is potable.
          </p>

          {/* Sliders and inputs */}
          {Object.keys(data).map((key) => (
            <div key={key} className="mb-3">
              <label className="form-label fw-bold text-dark">{key}</label>
              {["ph", "Hardness", "Solids", "Chloramines", "Sulfate", "Conductivity", "Organic_carbon", "Trihalomethanes", "Turbidity"].includes(key) ? (
                <input
                  type="range"
                  className="form-range"
                  name={key}
                  min={key === "ph" ? 0 : 0}
                  max={key === "ph" ? 14 : 1000}
                  step={key === "ph" ? 0.1 : 1}
                  value={data[key]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="number"
                  className="form-control"
                  name={key}
                  value={data[key]}
                  onChange={handleChange}
                />
              )}
              <small className="text-muted">{data[key]}</small>
            </div>
          ))}

          {/* Submit Button */}
          <button
            className="btn btn-success btn-lg w-100 mt-3"
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

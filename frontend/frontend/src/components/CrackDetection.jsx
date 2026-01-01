import { useState } from "react";
import api from "../services/api";

export default function CrackDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please select an image first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await api.post("/predict", formData);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error predicting the image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 w-100"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        minWidth: "100vw",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <header className="py-4 text-center px-3">
        <h1 className="display-4 fw-bold">AI Structural Crack Detection</h1>
        <p className="lead mx-auto mb-0" style={{ maxWidth: "1200px" }}>
          Upload or drag-and-drop an image of a building, bridge, or road. Our AI
          will detect cracks instantly.
        </p>
      </header>

      {/* Main Card */}
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
        <div
          className="card shadow-lg border-0 p-5 bg-light w-100"
          style={{ borderRadius: "0", maxWidth: "900px", minWidth: "300px" }}
        >
          <h2 className="fw-bold mb-4 text-primary text-center">
            Detect Structural Cracks
          </h2>
          <p className="text-muted text-center mb-4">
            Drag & drop an image or click to upload
          </p>

          {/* Stylish Drag & Drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("fileInput").click()}
            className="d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
              border: preview ? "none" : "2px dashed #6c757d",
              borderRadius: "12px",
              backgroundColor: preview ? "#f8f9fa" : "transparent",
              width: preview ? "auto" : "80%",
              minHeight: preview ? "auto" : "200px",
              maxHeight: "350px",
              padding: "10px",
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.3s ease",
              boxShadow: preview ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {!preview && (
              <span className="text-secondary text-center">
                Drag & Drop image here or click
              </span>
            )}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxHeight: "350px",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          {/* Hidden Input */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          {/* Detect Button */}
          <button
            className="btn btn-primary btn-lg w-100 mb-3"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Detect Crack"}
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
        © 2026 AI Infrastructure Monitoring Platform
      </footer>
    </div>
  );
}

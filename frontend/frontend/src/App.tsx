import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CrackDetection from "./components/CrackDetection";
import WaterQuality from "./components/WaterQuality";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crack" element={<CrackDetection />} />
        <Route path="/water" element={<WaterQuality />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

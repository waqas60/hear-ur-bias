import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Tool from "./pages/Tool";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tool" element={<Tool />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

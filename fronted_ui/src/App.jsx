import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Tool from "./pages/Tool";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar"; // Ensure this path is correct
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Import ThemeProvider

function App() {
  return (
    <BrowserRouter>
      {/* 1. Wrap everything in ThemeProvider */}
      <ThemeProvider>
        <AuthProvider>
          {/* 2. Place Navbar here so it shows on all pages and can access ThemeContext */}
          <Navbar /> 
          
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/tool"
              element={
                <ProtectedRoute>
                  <Tool />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
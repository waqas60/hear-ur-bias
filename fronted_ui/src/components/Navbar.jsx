import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <span className="brand" onClick={() => navigate("/")}>
          Hear Ur Bias
        </span>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <>
            <button className="nav-link tool" onClick={() => navigate("/tool")}>
              Tool
            </button>

            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div
              className="nav-profile-chip"
              onClick={() => navigate("/profile")}
            >
              <div className="nav-avatar">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    className="nav-avatar-img"
                  />
                ) : (
                  getInitials(currentUser.displayName || currentUser.email)
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-cta" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

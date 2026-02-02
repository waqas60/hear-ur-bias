import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext"; // Import the hook

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Consume theme state

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
    <div>
      <nav className="nav">
        <div className="nav-left">
          <span className="brand" onClick={() => navigate("/")}>
            Hear Ur Bias
          </span>
        </div>

        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* THEME TOGGLE BUTTON */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--text-muted)',
              color: 'var(--text-main)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem'
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {currentUser ? (
            <>
              <button className="nav-link" onClick={() => navigate("/tool")}>
                Tool
              </button>
              <div 
                className="nav-link profile-chip" 
                onClick={() => navigate("/profile")}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'var(--input-bg)', // Dynamic background
                  padding: '6px 12px',
                  borderRadius: '99px',
                  cursor: 'pointer',
                  border: '1px solid rgba(128,128,128,0.2)'
                }}
              >
                <div style={{
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #e7c78f, #c9a55c)',
                  color: '#1c1917',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                   {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                   ) : (
                      getInitials(currentUser.displayName || currentUser.email)
                   )}
                </div>
                <span style={{ color: 'var(--text-main)' }}>
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>
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
    </div>
  );
}
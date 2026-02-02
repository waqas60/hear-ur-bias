import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

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
    <div className="profile-container">
      <h2 className="auth-title">My Profile</h2>
      {error && <div className="error-alert">{error}</div>}
      
      <div className="profile-avatar">
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
          />
        ) : (
          <span>{getInitials(currentUser?.displayName || currentUser?.email)}</span>
        )}
      </div>

      <h3 className="profile-name">
        {currentUser?.displayName || "User"}
      </h3>
      <p className="profile-email">{currentUser?.email}</p>

      <button onClick={handleLogout} className="primary-btn">
        Log Out
      </button>
    </div>
  );
}
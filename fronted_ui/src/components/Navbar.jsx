import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="nav">
        <div className="nav-left">
          <span className="brand" onClick={() => navigate("/")}>
            Hear Ur Bias
          </span>
        </div>

        <div className="nav-right">
          <button className="nav-cta" onClick={() => navigate("/tool")}>
            Get Started
          </button>
        </div>
      </nav>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <Navbar />
      <main className="hero">
        <h1>
          Check your speech
          <br />
          <span className="highlight">before it speaks for you</span>
        </h1>

        <p className="hero-desc">
          Convert your speech to text and get instant feedback on how your words
          come across, so you can communicate clearly and confidently
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={() => navigate("/tool")}>
            Try tool
          </button>
        </div>

        <div className="video-section">
          <video src="../src/assets/sample.mp4"></video>
        </div>

        <p className="trust">No sign-up required . Free for personal use</p>
      </main>
    </div>
  );
};

export default Landing;

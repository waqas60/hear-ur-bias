import { useNavigate } from "react-router-dom";
import '../styles/hero.css'

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <main className="hero">
        <h1 className="highlight">
          Check your speech
          <br />
          before it speaks for you
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
      </main>
    </div>
  );
};

export default Landing;

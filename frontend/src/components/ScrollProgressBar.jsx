import { useEffect, useState } from "react";
import "../styles/ScrollProgressBar.css";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct = docHeight > 0
        ? Math.round((scrollTop / docHeight) * 100)
        : 0;
      setProgress(pct);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      background: "rgba(0,0,0,0.08)",
      zIndex: 9999,
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        transition: "width 0.08s linear",
        borderRadius: "0 2px 2px 0",
      }}
      className="progress-fill"
      />
    </div>
  );
};

export default ScrollProgressBar;
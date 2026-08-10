import React, { useState, useEffect } from 'react';

export default function Loader({ 
  delay = 400, 
  fullPage = false, 
  overlay = false, 
  message = "Loading ecosystem metrics..." 
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  const wrapperClass = `eco-loader-wrapper ${fullPage ? 'full-page' : ''} ${overlay ? 'overlay' : ''}`;

  return (
    <div className={wrapperClass}>
      <div className="eco-loader-container">
        <div className="eco-loader-spinner-wrapper">
          {/* Rotating Ring */}
          <div className="eco-loader-ring"></div>
          
          {/* Sprout / Leaf SVG */}
          <svg
            className="eco-loader-pulse"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stem */}
            <path
              className="eco-loader-sprout"
              d="M12 22V12"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <path
              className="eco-loader-sprout eco-loader-leaf-left"
              d="M12 12C9.5 12 7 10 7 7C7 4.5 9.5 5 12 7C12 7.5 12 12 12 12Z"
            />
            {/* Right Leaf */}
            <path
              className="eco-loader-sprout eco-loader-leaf-right"
              d="M12 10C14.5 10 17 8 17 5C17 2.5 14.5 3 12 5C12 5.5 12 10 12 10Z"
            />
          </svg>
        </div>
        {message && <p className="eco-loader-text">{message}</p>}
      </div>
    </div>
  );
}

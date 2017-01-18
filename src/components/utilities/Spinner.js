import React from 'react';

function Spinner() {
  return (
    <div className="spinner">
      <svg
        className="spinner-svg"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="spinner-svg-path"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        />
      </svg>
    </div>
  );
}

export default Spinner;

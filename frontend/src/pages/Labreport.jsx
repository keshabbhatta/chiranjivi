import React from 'react';

function Labreport() {
  const handleClick = () => {
    window.location.href = "https://reportanalyzer.streamlit.app";
  };

  return (
    <div>
      <h1 style={{ cursor: 'pointer' }} onClick={handleClick}>
        Lab Report
      </h1>
    </div>
  );
}

export default Labreport;

import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="smade-loader-wrapper">
      <div className="smade-spinner"></div>
      <div className="smade-loader-text">Đang tải...</div>
    </div>
  );
};

export default Loading;
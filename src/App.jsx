import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavHeader from "./components/NavHeader/navHeader";
import PhotoFaceDetection from "./components/photo/FaceDetection";
import VideoFaceDetection from "./components/video/FaceDetection";
import RealtimeFaceDetection from "./components/RealTimeFaceDetection/realTimeFD";
import HomePage from "./components/HomePage/homePage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <NavHeader />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/photo" element={<PhotoFaceDetection />} />
            <Route path="/video" element={<VideoFaceDetection />} />
            <Route path="/RealtimeFaceDetection" element={<RealtimeFaceDetection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

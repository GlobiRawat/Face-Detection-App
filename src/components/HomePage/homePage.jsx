import React from 'react';
import './hp.css';

const features = [
    { icon: "📷", text: "Upload an Image – Detect faces, expressions, age, and gender." },
    { icon: "🎥", text: "Analyze a Video – Identify and track faces across frames." },
    { icon: "📡", text: "Live Camera Detection – Detect age, gender, and expressions in real-time." }
];

const HomePage = () => {
    return (
        <>
            <div className="home-container">
                <h1 className="title">Welcome to Smart Face Detector</h1>
                <p className="description">
                    Experience the power of AI-driven face detection with Smart Face Detector. Our application enables seamless analysis of facial features through images, videos, and live camera feed.
                </p>
                <div className="features">
                    {features.map((feature, index) => (
                        <p key={index} aria-label={`Feature ${index + 1}`}>
                            {feature.icon} <strong>{feature.text}</strong>
                        </p>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;

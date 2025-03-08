import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import ResetButton from '../ResetButton/ResetButton';
import './realtimeStyles.css'; // Import the CSS file

const RealtimeFaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState(null);
    const [expression, setExpression] = useState(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const ModelURL = "/models";
                await faceapi.nets.tinyFaceDetector.loadFromUri(ModelURL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(ModelURL);
                await faceapi.nets.faceRecognitionNet.loadFromUri(ModelURL);
                await faceapi.nets.faceExpressionNet.loadFromUri(ModelURL);
                await faceapi.nets.ageGenderNet.loadFromUri(ModelURL);
                setIsModelLoaded(true);
                console.log("Face detection models loaded successfully");
            } catch (error) {
                console.error("Error loading models:", error);
            }
        };
        loadModels();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            swal("Error", "Cannot access camera. Please grant permissions.", "error");
        }
    };

    const detectFaces = async () => {
        if (!videoRef.current || !isModelLoaded) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender();
            
            console.log("Detections:", detections);
            
            if (detections.length > 0) {
                setAge(Math.round(detections[0].age));
                setGender(detections[0].gender);
                const maxExpression = Object.keys(detections[0].expressions).reduce((a, b) => 
                    (detections[0].expressions[a] > detections[0].expressions[b] ? a : b)
                );
                setExpression(maxExpression);
            } else {
                setAge(null);
                setGender(null);
                setExpression(null);
            }
            
            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceLandmarks(canvas, detections);
        } catch (error) {
            console.error("Face detection error:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(detectFaces, 1000);
        return () => clearInterval(interval);
    }, [isModelLoaded]);

    const resetEverything = () => {
        setAge(null);
        setGender(null);
        setExpression(null);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Stop the camera when the tab is inactive
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                resetEverything(); // Stop camera if tab is switched
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <div className="container">
            <h1>Realtime Face Detection</h1>
            <button className="btn btn-primary" onClick={startCamera}>Start Camera</button>
            <div className="video-container">
                <video ref={videoRef} autoPlay className="uploaded-video" />
                <canvas ref={canvasRef} className="output-canvas" />
            </div>
            <div className="output-container">
                {age !== null && <h4>Age: {age}</h4>}
                {gender !== null && <h4>Gender: {gender}</h4>}
                {expression !== null && <h4>Expression: {expression}</h4>}
            </div>
            <ResetButton onReset={resetEverything} />
        </div>
    );
};

export default RealtimeFaceDetection;

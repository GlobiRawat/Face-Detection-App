import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import ResetButton from '../ResetButton/ResetButton';
import './VideoStyles.css'; // Import the CSS file

const VideoFaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [currentPeopleCount, setCurrentPeopleCount] = useState(0);
    const detectionInterval = useRef(null);

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
                swal("Error", "Failed to load face detection models", "error");
            }
        };
        loadModels();

        // Cleanup interval on component unmount
        return () => {
            if (detectionInterval.current) clearInterval(detectionInterval.current);
        };
    }, []);

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            const videoURL = URL.createObjectURL(file);
            videoRef.current.src = videoURL;
        } else {
            swal("Error", "Please upload a valid video file", "error");
        }
    };

    const detectFaces = async () => {
        if (!videoRef.current || !isModelLoaded || videoRef.current.paused) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Clear the canvas before drawing new detections
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();
            
            console.log("Detections:", detections);
            setCurrentPeopleCount(detections.length);
            
            // Draw detections directly on the canvas
            faceapi.draw.drawDetections(canvas, detections);
        } catch (error) {
            console.error("Face detection error:", error);
        }
    };

    const startDetection = () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
        detectionInterval.current = setInterval(detectFaces, 1500);
    };

    const stopDetection = () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
    };

    const resetEverything = () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
        setCurrentPeopleCount(0);
        if (videoRef.current) videoRef.current.src = "";
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Clear the file input value
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
    };

    return (
        <div className="container">
            <h1>Face Detection</h1>
            <div className="file-input">
                <input type="file" className="form-control" accept="video/*" onChange={handleVideoUpload} />
            </div>
            <div className="video-container">
                <video 
                    ref={videoRef} 
                    controls 
                    autoPlay 
                    className="uploaded-video" 
                    onPlay={startDetection} 
                    onPause={stopDetection} 
                    onEnded={stopDetection} 
                />
                <canvas ref={canvasRef} className="output-canvas" />
            </div>
            <div className="output-container">
                <h4>Current People Detected: {currentPeopleCount}</h4>
            </div>
            <ResetButton onReset={resetEverything} />
        </div>
    );
};

export default VideoFaceDetection;
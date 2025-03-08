import * as faceapi from 'face-api.js';
import { useEffect, useState, useRef } from 'react';
import swal from 'sweetalert';
import ResetButton from '../ResetButton/ResetButton';
import "./photoStyles.css";

const FaceDetection = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [detections, setDetections] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // Force re-render of input field

    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setUploadedImage(imageURL);

            const img = new Image();
            img.src = imageURL;
            img.onload = async () => {
                imageRef.current = img;
                try {
                    const detectionResults = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceExpressions()
                        .withAgeAndGender();

                    if (detectionResults.length > 0) {
                        swal("Success", "Face Detected", "success");
                        setDetections(detectionResults);
                    } else {
                        swal("Error", "No face detected. Please upload a valid photo.", "error");
                    }
                } catch (error) {
                    swal("Error", "An error occurred during face detection", "error");
                }
            };
        } else {
            swal("Error", "Please upload an Image File", "error");
        }
    };

    useEffect(() => {
        const loadModels = async () => {
            const ModelURL = "/models";
            await faceapi.nets.tinyFaceDetector.loadFromUri(ModelURL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(ModelURL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(ModelURL);
            await faceapi.nets.faceExpressionNet.loadFromUri(ModelURL);
            await faceapi.nets.ageGenderNet.loadFromUri(ModelURL);
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (detections && imageRef.current) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = imageRef.current.width;
            canvas.height = imageRef.current.height;
            ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceLandmarks(canvas, detections);
        }
    }, [detections]);

    const resetEverything = () => {
        setUploadedImage(null);
        setDetections(null);
        setFileInputKey(Date.now()); // Reset file input field

        // Clear canvas
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Face Detection in React Using Face API</h1>
            <div className="mb-3">
                <input
                    type="file"
                    key={fileInputKey} // Forces input re-render to allow same file upload
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            {uploadedImage && (
                <div>
                    <h3>Uploaded Image</h3>
                    <img src={uploadedImage} alt="Uploaded" className="img-fluid" style={{ maxWidth: '300px' }} />
                </div>
            )}

            {detections && (
                <div>
                    <h3>Output Image</h3>
                    <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
                    <AgeGenderDetection detections={detections} />
                    <ExpressionDetection detections={detections} />
                </div>
            )}

            <ResetButton onReset={resetEverything} />
        </div>
    );
};

const AgeGenderDetection = ({ detections }) => {
    return (
        <div>
            <h4>Age & Gender</h4>
            {detections.map((det, index) => (
                <p key={index}>Estimated Age: {Math.round(det.age)}, Gender: {det.gender}</p>
            ))}
        </div>
    );
};

const ExpressionDetection = ({ detections }) => {
    return (
        <div>
            <h4>Facial Expressions</h4>
            {detections.map((det, index) => {
                const expressions = det.expressions;
                const maxExpression = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
                return <p key={index}>Most Likely Expression: {maxExpression}</p>;
            })}
        </div>
    );
};

export default FaceDetection;

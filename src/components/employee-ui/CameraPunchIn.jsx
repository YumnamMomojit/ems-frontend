import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import api from '../../services/api';

const CameraPunchIn = ({ onSuccess, onError }) => {
  const webcamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  const [mode, setMode] = useState('camera'); // 'camera' | 'gps' | 'manual'

  // Initialize camera and GPS on mount
  useEffect(() => {
    startCamera();
    getLocation();
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Failed to access camera. Please grant camera permissions.');
      setMode('gps');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('GPS error:', error);
          // GPS is optional, continue without it
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const captureImage = () => {
    if (!webcamRef.current) return;

    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          performCapture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = () => {
    setCapturing(true);
    
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (!imageSrc) {
      setCapturing(false);
      onError?.('Failed to capture image');
      return;
    }

    // Convert base64 to blob
    const base64Data = imageSrc.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    handlePunchIn(blob);
  };

  const handlePunchIn = async (imageBlob) => {
    try {
      const formData = new FormData();
      
      // Add image
      if (imageBlob) {
        formData.append('selfie', imageBlob, 'selfie.jpg');
      }

      // Add GPS data
      if (location) {
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
        formData.append('accuracy', location.accuracy?.toString() || '0');
      }

      // Add device info
      formData.append('attendanceMode', mode);
      formData.append('deviceInfo', JSON.stringify({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language
      }));

      // Send to backend
      const response = await api.post('/attendance/punch-in-with-camera', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess?.(response.data);
    } catch (error) {
      console.error('Punch in error:', error);
      onError?.(error.response?.data?.message || 'Failed to punch in');
    } finally {
      setCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Camera Attendance</h2>
        <p className="text-gray-600 mt-1">Take a selfie to mark your attendance</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('camera')}
          className={`px-4 py-2 rounded ${mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Camera + GPS
        </button>
        <button
          onClick={() => setMode('gps')}
          className={`px-4 py-2 rounded ${mode === 'gps' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          GPS Only
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`px-4 py-2 rounded ${mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Manual
        </button>
      </div>

      {/* Camera View */}
      {mode === 'camera' && (
        <div className="mb-6">
          {cameraError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{cameraError}</p>
              <button
                onClick={startCamera}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'user',
                  width: { ideal: 640 },
                  height: { ideal: 480 }
                }}
                className="w-full rounded-lg border-2 border-gray-300"
              />
              
              {/* Countdown Overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <span className="text-8xl font-bold text-white animate-pulse">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Capturing Overlay */}
              {capturing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Processing...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* GPS Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">GPS Location</h3>
        {location ? (
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Latitude:</span> {location.lat.toFixed(6)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Longitude:</span> {location.lng.toFixed(6)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Accuracy:</span> {location.accuracy?.toFixed(0)}m
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Fetching location...</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {mode === 'camera' && !cameraError && (
          <button
            onClick={captureImage}
            disabled={capturing || countdown > 0}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {capturing ? 'Processing...' : countdown > 0 ? `Capturing in ${countdown}...` : 'Take Selfie & Punch In'}
          </button>
        )}
        
        {mode !== 'camera' && (
          <button
            onClick={() => handlePunchIn(null)}
            disabled={capturing}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {capturing ? 'Processing...' : 'Punch In'}
          </button>
        )}

        {mode === 'camera' && stream && (
          <button
            onClick={stopCamera}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Stop Camera
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📌 Attendance Rules</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Make sure your face is clearly visible</li>
          <li>• Good lighting improves verification accuracy</li>
          <li>• GPS location is captured automatically</li>
          <li>• Duplicate punches on the same day are not allowed</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraPunchIn;

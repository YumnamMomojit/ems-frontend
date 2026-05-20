import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const audioContextRef = useRef(null);

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = audioContextRef.current;
      
      // Resume context if it was suspended (browser auto-play policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      // Play a nice high-pitched "ding"
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.warn("Could not play notification sound", e);
    }
  };

  useEffect(() => {
    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
    }

    const token = localStorage.getItem('mockToken');
    console.log("[NotificationContext] Attempting to connect. User:", user?.id, "Token exists:", !!token);
    
    if (!token || !user) {
      setSocket(null);
      return;
    }

    // The backend is running on 5001 usually, but let's use the URL from env or fallback
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
    console.log("[NotificationContext] Connecting to:", backendUrl);

    const newSocket = io(backendUrl, {
      auth: { token }
    });

    newSocket.on("connect", () => {
      console.log("[NotificationContext] Connected to notification server, Socket ID:", newSocket.id);
    });

    newSocket.on("notification", (data) => {
      console.log("[NotificationContext] Received notification:", data);
      playNotificationSound();
      toast.info(data.message, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    newSocket.on("connect_error", (err) => {
      console.error("[NotificationContext] Socket connection error:", err.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[NotificationContext] Disconnected from server:", reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Set up a global click listener to unlock audio context on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

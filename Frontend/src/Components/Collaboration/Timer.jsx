import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";

const Timer = ({ sessionId, userId, setTimeRemaining, onSessionEnd, onExtendTimer }) => {
  useEffect(() => {
    const ENDPOINT = "http://localhost:3005"; 
    const socket = socketIOClient(ENDPOINT, { query: { userId, sessionId } });

    socket.on("init-timer", (startTime, timeLimit) => {
      const currentTime = Date.now();
      const timeRemaining = timeLimit - (currentTime - startTime);
      setTimeRemaining(timeRemaining); 
    });

    socket.on("time-extended", (sessionInitTime, newSessionDuration) => {
      const currentTime = Date.now();
      const timeRemaining = newSessionDuration - (currentTime - sessionInitTime);
      setTimeRemaining(timeRemaining);
    });

    socket.on("system-terminate", () => {
      if (onSessionEnd) {
        onSessionEnd();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId, userId, setTimeRemaining, onSessionEnd, onExtendTimer]);

  return null; 
};

export default Timer;

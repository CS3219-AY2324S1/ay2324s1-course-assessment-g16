import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";

const Timer = ({ sessionId, userId, setTimeRemaining, socket}) => {
  useEffect(() => {
    if (!socket) return;

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

    return () => {
      socket.off("init-timer");
      socket.off("time-extended");
    };
  }, [sessionId, userId, setTimeRemaining, socket]);

  return null; 
};

export default Timer;

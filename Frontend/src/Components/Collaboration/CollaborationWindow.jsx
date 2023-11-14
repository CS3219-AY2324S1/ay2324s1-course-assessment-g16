import React, { useState, useEffect, useReducer, useRef } from 'react';
import './CollaborationWindow.css'; 
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import socketIOClient, { Socket } from "socket.io-client";
import 'firebase/auth';
import CodeEditor from './CodeEditor';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { getUserId } from '../../User/UserState'; 
import { useLocation } from 'react-router-dom';

import axios from "axios"


const CollaborationWindow = () => {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: '' });
    const [question, setQuestion] = useState(null); 
    const [collaborativeInput, setCollaborativeInput] = useState([]);
    const [code, setCode] = useState("#Enter your code here");
    const [language, setLanguage] = useState('python');
    const [popup, setPopup] = useState(false);
    const onClosePopup = () => setPopup(false);
    const navigate = useNavigate();
    const socket = useRef(null);
    const [canExtend, setCanExtend] = useState(false);
    const location = useLocation();
    const { sessionId, collaboratorId } = location.state || {};
    
    useEffect(() => {
      if (sessionId && collaboratorId) {
        socket.current = socketIOClient('http://localhost:3005', {
            query: {
                userId: getUserId(), // Replace with dynamic user ID
                sessionId: sessionId // Replace with dynamic session ID
            }
        });

        // Set up event listeners
        socket.current.on('join', (sessionId) => {
          console.log(`Joined session: ${sessionId}`);
          setSessionStarted(true);
          // Additional logic for joining session
      });

      socket.current.on('user-joined', (userId) => {
          console.log(`User ${userId} joined the session`);
          showToast('Get ready to collaborate and solve the challenge!');
          // Handle new user joining
      });

      socket.current.on('init-code', (question, codes) => {
          setCollaborativeInput(codes);
          setQuestion(question);
      });
      
      
      socket.current.on('code-changed', (line, code) => {
        // Update the specific line of code in the collaborative input
        const updatedInput = collaborativeInput.map((item, index) => 
            index === line ? { ...item, code: code } : item
        );
        setCollaborativeInput(updatedInput);
    });
    
    
    socket.current.on('cleared', (sessionId) => {
      setCollaborativeInput([]);
  });
  
  
  socket.current.on('time-extended', (totalTimeLeft) => {
      showToast('Timer extended for 15 minutes');
      setTimeRemaining(totalTimeLeft);
  });

  socket.current.on('system-terminate', (sessionId) => {
    showToast('Session terminated');
    setTimeout(() => navigate('/landing'), 1500); // Navigate to home or another route
});

socket.current.on('user-disconnected', (userId) => {
  console.log(`User ${userId} has disconnected`);
  // Update the UI to reflect the user's disconnection
  showToast(`Experiencing a temporary glitch. Reestablishing your connection...`);
  // Additional logic can be added here
});

socket.current.on('user-reconnected', (userId) => {
  console.log(`User ${userId} has reconnected`);
  // Handle the user's reconnection in the UI
  showToast(`Connection restored successfully. Let's keep going!`);
  // Additional logic can be added here
});

socket.current.on('notify-terminate', (sessionId) => {
  console.log(`Session ${sessionId} has been terminated by another user`);
  // Handle the session termination in the UI
  showToast('Session ended, redirecting to home page...');
  setTimeout(() => navigate('/landing'), 1500); // Redirect to home or another route
  // Any cleanup or finalization logic can be added here
});


socket.current.on('success-reconnected', (collaborativeInput) => {
    setCollaborativeInput(collaborativeInput);
});

return () => {
  socket.current.disconnect();
  socket.current.off('session-started');
};
 }
}, [sessionId, collaboratorId]);
    
    const userId = getUserId();

    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/home/${userId}`);
        if (response.status === 200) {
          const json = response.data;
          setQuestion(json.questionId);
        } else {
          console.log('Response is not ok:', response.statusText);
        }
      } catch (error) {
        console.error('Loading questions encountered error:', error);
      }
    };

    useEffect(() => {
      fetchQuestion();
    }, []);


    const showToast = (message) => {
        setToast({ visible: true, message });
        setTimeout(() => {
            setToast({ visible: false, message: '' });
        }, 1500);
    };



//    const handleExtendTimer = () => {
 //       console.log("Socket instance: ", socket.current);
   //     if (socket.current) {
    //      socket.current.emit('extend-timer', 900000); // 15 minutes in milliseconds
     //   showToast('Timer extended for 15 minutes');
     //   } else {
      //    console.log("Socket instance not available");
      //  }
   // };

   const handleEndSession = () => {
    // Check if the socket instance exists and sessionId is valid
    if (socket.current && sessionId) {
        // Emit a 'terminate-session' event to the server with the current sessionId
        socket.current.emit('user-terminate', { sessionId: sessionId });

        showToast('Session terminated');

        // Navigate to home or another route after a short delay
        setTimeout(() => navigate('/landing'), 1500);
    } else {
        console.log('Error: Socket not connected or invalid session ID');
    }
};
  

    const formatTime = (time) => {
        const totalSeconds = Math.floor(time / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = () => {
      showToast('Your code has been submitted');
      socket.current.emit('user-terminate', { sessionId: sessionId});
      setTimeout(() => navigate('/landing'), 1500);
    };

    const handleExtendTimer = () => {
      if (socket.current) {
        showToast('Timer extended for 15 minutes');
        socket.current.emit('extend-time'); // 15 minutes in milliseconds
      } else {
        console.log("reponse not available");
      }
    };

//    const handleExtendTimer = () => {
//              // Only allow extending if less than 2 minute is remaining
//      if (timeRemaining <= 120000 && socket.current) {
//          showToast("Timer extended for 15 minutes!");
//          socket.current.emit('extend-time'); 
//          setCanExtend(true);
//        } else {
//          showToast("You can only extend the timer in the last 2 minutes of this session.");
//              }
//          };
    
    // useEffect for the countdown logic
    useEffect(() => {
      let interval;
  
      if (sessionStarted && timeRemaining > 0) {
          interval = setInterval(() => {
              setTimeRemaining(prevTime => {
                  // When time runs out, show the popup and stop the interval
                  if (prevTime <= 1000) {
                      clearInterval(interval);
                      setPopup(true);
                      return 0;
                  }
                  // Otherwise, continue counting down
                  return prevTime - 1000;
              });
          }, 1000);
      }
  
      // Cleanup interval on component unmount or when session ends
      return () => {
          if (interval) {
              clearInterval(interval);
          }
      };
  }, [sessionStarted, timeRemaining]);
  

    return (
      <div className="collaboration-window">
        <Timer sessionId={sessionId} userId={userId} setTimeRemaining={setTimeRemaining} socket={socket.current}/>
          <Popup open={popup}>
              <div className="modal">
                  <div className="header"> Time Up </div>
                  <div className="content">
                      <div>Do you want to extend the time ?</div>
                  </div>
                  <div className="actions">
                      <button className="button extend-popup" onClick={(e) => {handleExtendTimer(); onClosePopup()}}>
                          Yes
                      </button>
                      <button className="button close-popup" onClick={(e) => {onClosePopup(); handleEndSession()}}>
                          No
                      </button>
                  </div>
              </div>
          </Popup>
        <div className="timer-bar">
          <div className="left">
            <span className="time-remaining">Time remaining: {formatTime(timeRemaining)}</span>
            <button className="extend-time" onClick={handleExtendTimer}>Extend Timer</button>
          </div>
          <div className="right">
            <button className="end-session" onClick={handleEndSession}>End Session</button>
          </div>
        </div>
        <div className="content-area">
          <div className="question-section">
          {question && (
            <>
              <h2>{question.title}</h2>
              <p>{question.description}</p>
            </>
          )}
          </div>
          <div className="editor-section">
            {/* Placeholder for code editor */}
            {/*<p>Code editor will go here...</p>*/}
              <div className="editor-section-inner">
                    <CodeEditor code={code} setCode={setCode} language={language} isReadOnly={false}/>
              </div>
              <div className="submit-button-container">
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
              </div>
          </div>

        </div>

      </div>
    );
};

export default CollaborationWindow;
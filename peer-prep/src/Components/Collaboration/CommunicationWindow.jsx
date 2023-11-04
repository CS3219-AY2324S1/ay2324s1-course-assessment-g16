import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Draggable from 'react-draggable';
import './CommunicationWindow.css';

const CommunicationWindow = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const remoteStream = useRef(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [callWaiting, setCallWaiting] = useState(false);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);



  useEffect(() => {
    // Initialize WebRTC peer connection
    peerConnection.current = new RTCPeerConnection();

    // Event listener for when remote track is received
    peerConnection.current.ontrack = event => {
      remoteStream.current = event.streams[0];
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream.current;
      }
    };

    // Initialize WebSocket connection
    const newSocket = io('http://localhost:3003', {
      query: { userId: 'user-id', sessionId: 'session-id' }
    });

    setSocket(newSocket);

    // Event listeners for WebRTC signaling
    newSocket.on('called', handleReceiveCall);
    newSocket.on('answered', handleAnswer);
    newSocket.on('ice-candidate', handleNewICECandidateMsg);

    // Cleanup on component unmount
    return () => {
      newSocket.close();
      peerConnection.current.close();
    };
  }, []);

  useEffect(() => {
    // Add a default message to the chat history on component mount
    setMessages([{
      text: "Welcome to the chat! You can drag this window around, and click the chat toggle button to open or close the chat.",
      fromSelf: false,
      isDefaultMessage: true
    }]);
  }, []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2000); // 
  };  

  const handleSendMessage = () => {
    if (!socket) return;
    if (!inputValue.trim()) return;

    const message = { text: inputValue, fromSelf: true };
    socket.emit('message', message);
    setMessages(prevMessages => 
        prevMessages.filter(m => !m.isDefaultMessage).concat(message)
      );
    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const startCall = async () => {
    try {
      // Access only audio since video is not required
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true});
      localAudioRef.current.srcObject = localStream;
  
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });
  
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('call', { offer });
      setCallWaiting(true); // Call is now waiting for the partner to accept
      showToast('Waiting for partner to join the call...');
    } catch (err) {
      showToast('Failed to access media devices.');
      console.error('Failed to start call', err);
    }
  };
  

  const handleReceiveCall = async (incoming) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incoming.offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit('answer', { answer });
    setShowIncomingCallModal(true);
    setIncomingOffer(incoming.offer);
  };

  const acceptCall = async () => {
    if (!incomingOffer || !peerConnection) {
      console.error("No incoming call to accept");
      return;
    }
  
    try {
      // Set the remote description to the offer received from the caller
      await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingOffer));
  
      // Create an answer to the offer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
  
      // Send the answer back to the caller
      socket.emit("answer", answer);
  
      // UI updates for being in call
      const callButton = document.getElementById('call-btn'); 
      if (callButton) {
        callButton.textContent = 'Hang Up';
        callButton.disabled = false;
      }
  
      showToast('Call accepted. Connected!');
  
      // Update state to reflect that we're in a call
      setIsInCall(true); // Assuming you have a state variable to track this
  
    } catch (error) {
      console.error("Error accepting call:", error);
      showToast('Error accepting the call.');
    }
  };
  

  const handleAnswer = async (incoming) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(incoming.answer));
  };

  const handleNewICECandidateMsg = async (incoming) => {
    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(incoming));
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  };

  const toggleCall = () => {
    if (isInCall) {
      endCall();
    } else {
      startCall();
    }
    setIsInCall(!isInCall);
  };

  const endCall = () => {
    // Emit the end-call event to notify the backend
    socket.emit("end-call");
  
    // Call the function to handle UI and stream cleanup
    endAudioConnection();
  
    // UI feedback for the user
    // Update the button text and disable the button
    const callButton = document.getElementById('call-btn'); 
    if (callButton) {
      callButton.textContent = 'Call Ended';
      callButton.disabled = true;
    }
  
    // Display a message to the user about the call ending
    showToast('Call ended by you.');
  };
  
  const endAudioConnection = () => {
    // Stop all tracks on the local media stream
    if (localAudioRef.current && localAudioRef.current.srcObject) {
      const tracks = localAudioRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      localAudioRef.current.srcObject = null;
    }
  
    // Close the peer connection if it's open
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach(sender => {
        peerConnection.current.removeTrack(sender);
      });
      peerConnection.current.close();
      peerConnection.current = null;
    }
  
    // UI feedback for the user
    // Update the button text and disable the button
    const callButton = document.getElementById('call-btn'); 
    if (callButton) {
      callButton.textContent = 'Call';
      callButton.disabled = false;
    }
  
    // Reset call state
    setIsInCall(false);
  
    // Display a message to the user about the call ending
    showToast('Call ended.');
  };
  
  

  const rejectCall = () => {
    socket.emit('end-call');
    setShowIncomingCallModal(false);
    showToast('Call rejected');
  };

  const IncomingCallModal = ({ onAccept, onReject }) => (
    <div className="incoming-call-modal">
      <div className="incoming-call-content">
        <h2>Incoming Call...</h2>
        <button onClick={onAccept}>Accept</button>
        <button onClick={onReject}>Reject</button>
      </div>
    </div>
  );
  
  

  return (
    <>
    {showIncomingCallModal && (
      <IncomingCallModal
        onAccept={acceptCall}
        onReject={rejectCall}/>
        )}
    {toast.visible && <div className="toast">{toast.message}</div>}
      {/* Chat toggle button */}
      <div className="chat-toggle-btn-container">
        <button 
          className="chat-toggle-btn" 
          onClick={() => setChatOpen(!chatOpen)}
        />
      </div>
  
      {/* Draggable chat window */}
      <Draggable bounds="parent">
        <div className={`chat-window-container ${chatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <span>Chat</span>
            {/* Call button */}
            <button 
              className={`call-btn ${isInCall ? 'hang-up-btn' : ''}`}
              onClick={toggleCall}
            >
              {isInCall ? 'Hang Up' : 'Call'}
            </button>
            {/* Local audio stream (hidden) */}
            <audio ref={localAudioRef} style={{ display: 'none' }} autoPlay muted></audio>
            {/* Remote audio stream */}
            <audio ref={remoteAudioRef} style={{ display: 'none' }} autoPlay></audio>
          </div>
          <div className="chat-history">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`message ${message.fromSelf ? 'my-message' : 'their-message'} ${message.isDefaultMessage ? 'default-message' : ''}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              className="message-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </Draggable>
    </>
  );
};  
  
  export default CommunicationWindow;
  
             
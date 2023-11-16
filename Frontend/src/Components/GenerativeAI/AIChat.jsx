import React, { useState, useEffect } from 'react';
import { getUserId } from '../../User/UserState';
import { getAIResponse } from './AIService';
import './AIChat.css';

const AIChat = () => {
  const userId = getUserId();
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [defaultMessageShown, setDefaultMessageShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatOpen && !defaultMessageShown) {
      const defaultMessage = {
        text: "Hello! 👋 I'm your AI assistant powered by GPT-3.5. Feel free to ask me anything! But remember, I might not always get things right!",
        fromSelf: false,
      };
      setResponses([defaultMessage]);
      setDefaultMessageShown(true);
    }
  }, [chatOpen, defaultMessageShown]);

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    // Add user's message to chat history
    setResponses(prevResponses => [...prevResponses, { text: trimmedPrompt, fromSelf: true }]);
    setPrompt(''); // Clear the input field

    setIsLoading(true); // Set loading state

    try {
      const aiResponse = await getAIResponse(userId, trimmedPrompt);
      if (aiResponse.status === 'success') {
        setResponses(prevResponses => [
          ...prevResponses,
          { text: aiResponse.reply, fromSelf: false },
        ]);
      } else {
        console.error('Error from AI:', aiResponse.message);
      }
    } catch (error) {
      console.error('Failed to submit prompt to AI:', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <div className={`aichat-toggle-btn-container ${chatOpen ? 'hide' : ''}`}>
        <button className="aichat-toggle-btn" onClick={() => setChatOpen(true)} />
      </div>
      {chatOpen && (
        <div className="aichat-container">
          <div className="aichat-header">
            <span>Chat with ChatGPT</span>
            <button onClick={() => setChatOpen(false)}>X</button> {/* Close button */}
          </div>
          <div className="aichat-history">
            {responses.map((message, index) => (
              <div key={index} className={`aimessage ${message.fromSelf ? 'aimy-message' : 'aitheir-message'}`}>
                {message.text}
              </div>
            ))}
            {isLoading && <div className="aimessage ailoading-message">Generating response...</div>}
          </div>
          <div className="aichat-input-area">
            <textarea
              className="aimessage-input"
              placeholder="Type your question..."
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button className="aisend-btn" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
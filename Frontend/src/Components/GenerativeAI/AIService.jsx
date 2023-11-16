import axios from 'axios';

const API_ENDPOINT = 'http://localhost:3008'; // Update to match backend endpoint

export const getAIResponse = async (userId, prompt) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/generate`, { userId, prompt });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw error;
  }
};

export const exitAISession = async (userId) => {
  try {
    await axios.delete(`${API_ENDPOINT}/exitGpt/${userId}`);
  } catch (error) {
    console.error('Error exiting AI session:', error);
    throw error;
  }
};

export const getAICache = async (userId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/getCache/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting AI cache:', error);
    throw error;
  }
};

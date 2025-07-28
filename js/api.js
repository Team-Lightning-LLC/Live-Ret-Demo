// API Configuration and Handler
// This file manages all communication with the backend

const API_CONFIG = {
  // Change this to your n8n webhook URL when ready
  baseUrl: 'http://localhost:5678/webhook', // You'll update this with your actual n8n URL
  endpoints: {
    chat: '/assistant-chat',
    clientInfo: '/client-info',
    createConsultation: '/create-consultation'
  }
};

class AssistantAPI {
  // Send a message to the AI assistant
  static async sendMessage(message, chatId, clientId) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.chat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          chatId: chatId,
          clientId: clientId,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      // Return null to trigger fallback behavior
      return null;
    }
  }
  
  // Get client information
  static async getClientInfo(clientId) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.clientInfo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: clientId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch client info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Client info error:', error);
      return null;
    }
  }
  
  // Create a new consultation
  static async createConsultation(clientId) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.createConsultation}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: clientId,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create consultation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create consultation error:', error);
      return null;
    }
  }
  
  // Check if API is available
  static async checkConnection() {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/health`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Make it available globally
window.AssistantAPI = AssistantAPI;

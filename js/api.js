// API Integration Layer
class VertesiaAPI {
  constructor() {
    this.configured = this.checkConfiguration();
  }
  
  checkConfiguration() {
    return CONFIG.api.endpoint && CONFIG.api.key && CONFIG.api.agentId;
  }
  
  async sendMessage(message, context) {
    if (!this.configured) {
      return this.getDemoResponse(message);
    }
    
    try {
      const response = await fetch(`${CONFIG.api.endpoint}/v1/interactions/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.api.key}`
        },
        body: JSON.stringify({
          agentId: CONFIG.api.agentId,
          type: 'conversation',
          messages: [
            {
              role: 'system',
              content: `Financial advisor assisting ${context.name} (${context.clientId}) from ${context.company} with their ${context.accountType}. Client age: ${context.age}.`
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return this.formatResponse(data);
      
    } catch (error) {
      console.error('API Error:', error);
      return this.getDemoResponse(message);
    }
  }
  
  formatResponse(data) {
    // Extract content from various possible response formats
    const content = data.content || data.message || data.response || data.text || '';
    
    return {
      content: content,
      timestamp: new Date()
    };
  }
  
  getDemoResponse(message) {
    // Simple demo responses for testing
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('borrow') || lowerMessage.includes('loan')) {
      return {
        content: `Based on James Jackson's UT Saver TSA 403(b) plan:

**Loan Eligibility**: Yes, participant loans are available
**Maximum Amount**: $50,000 or 50% of vested balance (whichever is less)
**Current Vested Balance**: $127,000
**Maximum Loan Available**: $50,000

The loan must be repaid within 5 years with quarterly payments. Interest rate is Prime + 1%.

*Source: UT Saver TSA Plan Document Section 7.1*`,
        timestamp: new Date()
      };
    }
    
    return {
      content: `I can help you with information about James Jackson's UT Saver TSA 403(b) plan. The system has access to plan documents, contribution limits, and participant-specific details. What specific information would you like to know?`,
      timestamp: new Date()
    };
  }
}

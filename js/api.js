// API Integration Layer - Vertesia Runs API
class VertesiaAPI {
  constructor() {
    this.configured = this.checkConfiguration();
    console.log('VertesiaAPI initialized:', { configured: this.configured });
  }
  
  checkConfiguration() {
    const hasConfig = CONFIG.api.endpoint && CONFIG.api.key && CONFIG.api.interactionId;
    if (!hasConfig) {
      console.log('Vertesia API not configured. Check config.js');
    }
    return hasConfig;
  }
  
  async sendMessage(message, context) {
    console.log('sendMessage called:', { message, context, configured: this.configured });
    
    if (!this.configured) {
      console.log('Using demo response - API not configured');
      return this.getDemoResponse(message);
    }
    
    try {
      // Create a run using Vertesia's /runs endpoint
      console.log('Creating run with Vertesia API');
      
      const requestBody = {
        interaction: CONFIG.api.interactionId,
        data: {
          message: message,
          clientContext: {
            clientId: context.clientId,
            name: context.name,
            company: context.company,
            accountType: context.accountType,
            age: context.age,
            balance: context.balance
          }
        },
        config: {
          environment: CONFIG.api.environmentId,
          model: "publishers/anthropic/models/claude-3-7-sonnet"
        },
        stream: false // Set to true if you want streaming responses
      };
      
      console.log('Request to /runs:', requestBody);
      
      const response = await fetch(`${CONFIG.api.endpoint}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.api.key}`,
          'x-interaction-tag': 'latest'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Run creation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const runData = await response.json();
      console.log('Run created:', runData);
      
      // If streaming is false, we need to poll or wait for the run to complete
      // For now, let's get the result directly if available
      if (runData.result) {
        return this.formatResponse(runData.result);
      }
      
      // If result not immediately available, we might need to poll the run status
      // For demo purposes, return the run ID and a message
      return {
        content: `Processing your request... (Run ID: ${runData.id})`,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('API Error:', error);
      return this.getDemoResponse(message);
    }
  }
  
  // Alternative: Use streaming endpoint
  async sendMessageStream(message, context) {
    if (!this.configured) {
      return this.getDemoResponse(message);
    }
    
    try {
      const requestBody = {
        interaction: CONFIG.api.interactionId,
        data: {
          message: message,
          clientContext: context
        },
        config: {
          environment: CONFIG.api.environmentId
        },
        stream: true
      };
      
      const response = await fetch(`${CONFIG.api.endpoint}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.api.key}`,
          'x-interaction-tag': 'latest'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        console.log('Stream chunk:', chunk);
        
        // Parse Server-Sent Events
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed['my-result']) {
                fullResponse += parsed['my-result'];
              }
            } catch (e) {
              // Handle non-JSON data
            }
          }
        }
      }
      
      return {
        content: fullResponse || 'Response received',
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('Stream API Error:', error);
      return this.getDemoResponse(message);
    }
  }
  
  formatResponse(result) {
    // Extract content from Vertesia result format
    let content = '';
    
    if (typeof result === 'string') {
      content = result;
    } else if (result['my-result']) {
      content = result['my-result'];
    } else {
      content = JSON.stringify(result);
    }
    
    return {
      content: content,
      timestamp: new Date()
    };
  }
  
  getDemoResponse(message) {
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
    
    if (lowerMessage.includes('contribution') || lowerMessage.includes('contribute')) {
      return {
        content: `For James Jackson's UT Saver TSA 403(b) plan in 2024:

**Annual Contribution Limits**:
- Basic limit: $23,000
- Age 50+ catch-up: Additional $7,500
- 15-year service catch-up: Up to $3,000 extra

**Current Status**:
- Year-to-date contributions: $18,500
- Remaining capacity: $4,500

**Employer Match**: 100% match on first 6% of salary

*Reference: IRS Notice 2023-75 and UT Saver TSA Plan Section 4.2*`,
        timestamp: new Date()
      };
    }
    
    return {
      content: `I can help you with information about James Jackson's UT Saver TSA 403(b) plan. The system has access to plan documents, contribution limits, and participant-specific details. What specific information would you like to know?`,
      timestamp: new Date()
    };
  }
}

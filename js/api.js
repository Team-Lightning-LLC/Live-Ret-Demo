javascript
// API Integration Layer - Vertesia Runs API
class VertesiaAPI {
  constructor() {
    this.configured = this.checkConfiguration();
    console.log('VertesiaAPI initialized:', { configured: this.configured });
  }

  checkConfiguration() {
    const hasConfig = CONFIG.api.endpoint && CONFIG.api.key && CONFIG.api.interactionId && CONFIG.api.environmentId;
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
        environment: CONFIG.api.environmentId,
        modelId: "publishers/anthropic/models/claude-3-7-sonnet",
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
        stream: false // Set to true if you want streaming responses
      };

      console.log('Request to /runs:', requestBody);

      const response = await fetch(`/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer `
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Run creation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(`API request failed: `);
      }

      const runData = await response.json();
      console.log('Run created:', runData);

      // Check the status of the run
      if (runData.status === 'completed') {
        return this.formatResponse(runData.result);
      } else {
        // If the run is not completed, you might want to implement polling here
        return {
          content: `Run created and processing. Status: . Run ID: `,
          timestamp: new Date()
        };
      }

    } catch (error) {
      console.error('API Error:', error);
      return this.getDemoResponse(message);
    }
  }

  async sendMessageStream(message, context) {
    if (!this.configured) {
      return this.getDemoResponse(message);
    }

    try {
      const requestBody = {
        interaction: CONFIG.api.interactionId,
        environment: CONFIG.api.environmentId,
        modelId: "publishers/anthropic/models/claude-3-7-sonnet",
        data: {
          message: message,
          clientContext: context
        },
        stream: true
      };

      const createRunResponse = await fetch(`/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer `
        },
        body: JSON.stringify(requestBody)
      });

      if (!createRunResponse.ok) {
        throw new Error(`API request failed: `);
      }

      const runData = await createRunResponse.json();
      const runId = runData.id;

      // Now that we have the run ID, we can start streaming
      const streamResponse = await fetch(`/runs//stream`, {
        headers: {
          'Authorization': `Bearer `
        }
      });

      if (!streamResponse.ok) {
        throw new Error(`Stream request failed: `);
      }

      const reader = streamResponse.body.getReader();
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
              if (parsed.delta) {
                fullResponse += parsed.delta;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
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
    } else if (result.delta) {
      content = result.delta;
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

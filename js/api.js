// Vertesia API Configuration
const VERTESIA_CONFIG = {
  apiUrl: 'https://api.vertesia.io', // Replace with your actual endpoint
  apiKey: '', // Your API key here
  agentId: '', // Your agent ID here
  interactionType: 'conversation'
};

// API Integration class
class VertesiaAPI {
  constructor() {
    this.config = VERTESIA_CONFIG;
  }

  // Execute agent with user message and context
  async executeAgent(message, clientContext) {
    try {
      const response = await fetch(`${this.config.apiUrl}/v1/interactions/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          agentId: this.config.agentId,
          type: this.config.interactionType,
          messages: [
            {
              role: 'system',
              content: this.buildSystemContext(clientContext)
            },
            {
              role: 'user',
              content: message
            }
          ],
          parameters: {
            clientId: clientContext.clientId,
            participantId: clientContext.clientId // P00051 for James Jackson
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // Handle streaming response
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        return this.handleStreamingResponse(response);
      }

      // Handle regular JSON response
      return await response.json();
    } catch (error) {
      console.error('Vertesia API Error:', error);
      throw error;
    }
  }

  // Build system context from client data
  buildSystemContext(client) {
    return `You are assisting ${client.name} from ${client.company} with their ${client.accountType} account. Client ID: ${client.clientId || 'N/A'}. Apply all relevant plan rules and regulations.`;
  }

  // Handle streaming responses
  async handleStreamingResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullResponse += parsed.content;
            }
          } catch (e) {
            // Handle non-JSON data
          }
        }
      }
    }

    return { content: fullResponse };
  }

  // Check if API is configured
  isConfigured() {
    return this.config.apiKey && this.config.apiKey.length > 0 && 
           this.config.agentId && this.config.agentId.length > 0;
  }
}

// Export instance
const vertesiaAPI = new VertesiaAPI();

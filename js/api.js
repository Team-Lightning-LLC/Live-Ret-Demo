async sendMessage(message, context) {
  console.log('sendMessage called:', { message, context, configured: this.configured });
  
  // Always use n8n webhook now instead of checking configuration
  try {
    console.log('Sending to n8n webhook');
    
    const response = await fetch('https://muinf.app.n8n.cloud/webhook-test/62377baa-ee4e-4802-9377-ccc0114a159b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        clientContext: {
          clientId: context.clientId,
          name: context.name,
          company: context.company,
          accountType: context.accountType,
          age: context.age,
          balance: context.balance
        }
      })
    });
    
    console.log('n8n webhook response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook error response:', errorText);
      throw new Error(`n8n webhook request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('n8n webhook response:', data);
    
    // Handle the response from n8n
    return {
      content: data.answer || data.message || data.response || JSON.stringify(data),
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('n8n webhook Error:', error);
    // Fall back to demo response if webhook fails
    return this.getDemoResponse(message);
  }
}

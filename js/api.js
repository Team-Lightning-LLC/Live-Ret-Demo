async sendMessage(message, context) {
  console.log('Sending to n8n webhook:', message);
  
  try {
    const response = await fetch('https://muinf.app.n8n.cloud/webhook-test/62377baa-ee4e-4802-9377-ccc0114a159b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: message,
        clientContext: {
          name: context.name,
          clientId: context.clientId,
          company: context.company,
          accountType: context.accountType,
          age: context.age,
          balance: context.balance
        }
      })
    });
    
    const data = await response.json();
    console.log('n8n response:', data);
    
    return {
      content: data.answer || data.message || JSON.stringify(data),
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('n8n webhook error:', error);
    return {
      content: 'Sorry, there was an error connecting to the service. Please try again.',
      timestamp: new Date()
    };
  }
}

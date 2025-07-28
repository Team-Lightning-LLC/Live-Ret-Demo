// Chat Manager - Handles all chat functionality
const ChatManager = {
  chats: new Map(),
  activeChat: null,
  isApiConnected: false,
  
  // Initialize chat manager
  init() {
    this.checkApiConnection();
  },
  
  // Check if API is connected
  async checkApiConnection() {
    if (window.AssistantAPI) {
      this.isApiConnected = await AssistantAPI.checkConnection();
      this.updateApiStatus(this.isApiConnected);
    }
  },
  
  // Update API status indicator
  updateApiStatus(isConnected) {
    const statusEl = document.getElementById('api-status');
    const statusTextEl = document.getElementById('api-status-text');
    
    if (statusEl && statusTextEl) {
      if (isConnected) {
        statusEl.className = 'api-status live';
        statusTextEl.textContent = 'Live Mode - Connected to Vertesia';
      } else {
        statusEl.className = 'api-status demo';
        statusTextEl.textContent = 'Demo Mode - Using Local Data';
      }
    }
  },
  
  // Create new consultation
  createConsultation(clientId) {
    const client = clientsData[clientId];
    if (!client) return null;
    
    const consultation = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientId: clientId,
      client: client,
      messages: [],
      startTime: new Date(),
      isActive: true
    };
    
    this.chats.set(consultation.id, consultation);
    return consultation;
  },
  
  // Add chat to sidebar
  addToSidebar(consultation) {
    const chatList = document.getElementById('chat-list');
    if (!chatList) return;
    
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.chatId = consultation.id;
    
    const timeAgo = this.getTimeAgo(consultation.startTime);
    
    chatItem.innerHTML = `
      <div class="chat-avatar">${consultation.client.avatar}</div>
      <div class="chat-details">
        <div class="chat-name">${consultation.client.name}</div>
        <div class="chat-preview">New consultation started</div>
      </div>
      <div class="chat-time">${timeAgo}</div>
    `;
    
    chatItem.addEventListener('click', () => {
      this.activateConsultation(consultation.id);
    });
    
    chatList.insertBefore(chatItem, chatList.firstChild);
    
    return chatItem;
  },
  
  // Get time ago string
  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  },
  
  // Format timestamp
  formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  },
  
  // Activate consultation
  activateConsultation(chatId) {
    const consultation = this.chats.get(chatId);
    if (!consultation) {
      console.error('Consultation not found:', chatId);
      return;
    }
    
    this.activeChat = consultation;
    
    // Show chat interface
    this.showChatInterface();
    
    // Update header
    this.updateChatHeader(consultation.client);
    
    // Render messages
    this.renderMessages(consultation.messages);
    
    // Update sidebar selection
    this.updateSidebarSelection(chatId);
  },
  
  // Show chat interface
  showChatInterface() {
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
  },
  
  // Update chat header
  updateChatHeader(client) {
    document.getElementById('header-avatar').textContent = client.avatar;
    document.getElementById('header-name').textContent = client.name;
    document.getElementById('header-details').textContent = `${client.company} • ${client.accountType}`;
  },
  
  // Update sidebar selection
  updateSidebarSelection(chatId) {
    // Remove active class from all items
    document.querySelectorAll('.chat-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to selected item
    const activeItem = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
    
    // Add API connected indicator if connected
    if (this.isApiConnected && activeItem) {
      activeItem.classList.add('api-connected');
    }
  },
  
  // Render client info card
  renderClientCard(client) {
    return `
      <div class="client-card">
        <div class="card-header">
          <div class="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h4>Client Information</h4>
        </div>
        <div class="client-details-grid">
          <div class="detail-item">
            <label>Full Name</label>
            <span>${client.name}</span>
          </div>
          <div class="detail-item">
            <label>Company</label>
            <span>${client.company}</span>
          </div>
          <div class="detail-item">
            <label>Account Type</label>
            <span>${client.accountType}</span>
          </div>
        </div>
      </div>
    `;
  },
  
  // Add message to consultation
  addMessage(chatId, content, isUser = false) {
    const consultation = this.chats.get(chatId);
    if (!consultation) return;
    
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content,
      isUser: isUser,
      timestamp: new Date()
    };
    
    consultation.messages.push(message);
    
    if (this.activeChat?.id === chatId) {
      this.renderMessage(message);
      this.scrollToBottom();
    }
    
    return message;
  },
  
  // Render single message
  renderMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.isUser ? 'user-message' : 'ai-message'}`;
    
    if (message.isUser) {
      messageEl.innerHTML = `
        <div class="message-content">
          <div class="message-text">${message.content}</div>
          <div class="message-time">${this.formatTime(message.timestamp)}</div>
        </div>
        <div class="message-avatar user-avatar">FA</div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="message-avatar ai-avatar">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
            <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text">${message.content}</div>
          <div class="message-time">${this.formatTime(message.timestamp)}</div>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageEl);
  },
  
  // Render all messages
  renderMessages(messages) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
    
    // Add client card first
    if (this.activeChat?.client) {
      const clientCardEl = document.createElement('div');
      clientCardEl.innerHTML = this.renderClientCard(this.activeChat.client);
      messagesContainer.appendChild(clientCardEl);
    }
    
    // Add all messages
    messages.forEach(message => {
      this.renderMessage(message);
    });
    
    this.scrollToBottom();
  },
  
  // Process AI response with cycling typing indicator
  async processAIResponse(userMessage, clientId) {
    if (!this.activeChat) return;
    
    // Show cycling typing indicator
    await this.showCyclingTypingIndicator();
    
    let aiResponse = null;
    
    // Try API first if connected
    if (this.isApiConnected && window.AssistantAPI) {
      const apiResponse = await AssistantAPI.sendMessage(
        userMessage,
        this.activeChat.id,
        clientId
      );
      
      if (apiResponse && apiResponse.aiResponse) {
        aiResponse = apiResponse.aiResponse;
      }
    }
    
    // Fallback to demo data if API fails or not connected
    if (!aiResponse) {
      aiResponse = generateAIResponse(userMessage, clientId);
    }
    
    // Add the AI response to chat
    this.addMessage(this.activeChat.id, aiResponse, false);
  },
  
  // Show cycling typing indicator with promise-based timing
  showCyclingTypingIndicator() {
    return new Promise((resolve) => {
      const messagesContainer = document.getElementById('chat-messages');
      
      // Create typing indicator
      const typingEl = document.createElement('div');
      typingEl.className = 'typing-indicator';
      typingEl.id = 'typing-indicator';
      typingEl.innerHTML = `
        <div class="message-avatar ai-avatar">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
            <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
          </svg>
        </div>
        <div class="typing-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="typing-text" id="typing-text">AssistantAI is retrieving client details...</div>
        </div>
      `;
      
      messagesContainer.appendChild(typingEl);
      this.scrollToBottom();
      
      // Define the typing steps
      const typingSteps = [
        "AssistantAI is retrieving client details...",
        "AssistantAI is researching scenario...",
        "AssistantAI is identifying relevant information...",
        "AssistantAI is compiling response..."
      ];
      
      let currentStep = 0;
      const typingTextEl = document.getElementById('typing-text');
      
      // Start with first step already shown
      currentStep = 1;
      
      // Create interval to cycle through steps
      const interval = setInterval(() => {
        if (currentStep < typingSteps.length) {
          typingTextEl.textContent = typingSteps[currentStep];
          currentStep++;
        } else {
          // Clear interval and remove typing indicator
          clearInterval(interval);
          typingEl.remove();
          resolve();
        }
      }, 1500); // Change step every 1.5 seconds
    });
  },
  
  // Scroll to bottom of messages
  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  
  // Generate export summary
  generateExportSummary() {
    if (!this.activeChat) return 'No active consultation to export.';
    
    const client = this.activeChat.client;
    const messages = this.activeChat.messages;
    
    let summary = `CONSULTATION SUMMARY\n\n`;
    summary += `Client: ${client.name}\n`;
    summary += `Company: ${client.company}\n`;
    summary += `Account Type: ${client.accountType}\n`;
    summary += `Date: ${new Date().toLocaleDateString()}\n`;
    summary += `Duration: ${this.getConsultationDuration()}\n\n`;
    
    summary += `DISCUSSION TOPICS:\n`;
    messages.forEach((msg, index) => {
      if (msg.isUser && index > 0) {
        summary += `- ${msg.content}\n`;
      }
    });
    
    summary += `\nRECOMMENDATIONS PROVIDED:\n`;
    summary += `- Reviewed account eligibility and options\n`;
    summary += `- Discussed regulatory compliance requirements\n`;
    summary += `- Provided relevant documentation references\n`;
    
    return summary;
  },
  
  // Get consultation duration
  getConsultationDuration() {
    if (!this.activeChat) return '0 minutes';
    
    const now = new Date();
    const start = this.activeChat.startTime;
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
  }
};

// Initialize when loaded
ChatManager.init();

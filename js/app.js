// AssistantAI 2.0 - Focused Demo Application
class AssistantAI {
  constructor() {
    this.api = new VertesiaAPI();
    this.activeChat = null;
    this.messages = [];
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateAPIStatus();
    
    // Show incoming call after delay
    setTimeout(() => this.showIncomingCall(), CONFIG.demo.incomingCallDelay);
  }
  
  setupEventListeners() {
    // Accept client
    document.getElementById('accept-client-btn')?.addEventListener('click', () => {
      this.acceptClient();
    });
    
    // Send message
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('message-input');
    
    sendBtn?.addEventListener('click', () => this.sendMessage());
    
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }
  
  updateAPIStatus() {
    const statusEl = document.getElementById('api-status');
    const statusDot = statusEl.querySelector('.status-dot');
    const statusText = statusEl.querySelector('.status-text');
    
    if (this.api.configured) {
      statusDot.className = 'status-dot connected';
      statusText.textContent = 'Live API Connected';
    } else {
      statusDot.className = 'status-dot demo';
      statusText.textContent = 'Demo Mode';
    }
  }
  
  showIncomingCall() {
    const banner = document.getElementById('client-banner');
    banner.style.display = 'block';
    
    setTimeout(() => {
      banner.classList.add('show');
    }, 100);
  }
  
  acceptClient() {
    const banner = document.getElementById('client-banner');
    banner.classList.remove('show');
    
    setTimeout(() => {
      banner.style.display = 'none';
      this.startConsultation();
    }, 300);
  }
  
  startConsultation() {
    this.activeChat = CONFIG.client;
    
    // Hide welcome, show chat
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
    
    // Update UI with client info
    document.getElementById('client-name').textContent = this.activeChat.name;
    document.getElementById('client-details').textContent = 
      `${this.activeChat.company} • ${this.activeChat.accountType}`;
    
    // Add to sidebar
    this.addToSidebar();
    
    // Show initial context message
    this.addContextMessage();
    
    // Focus input
    document.getElementById('message-input').focus();
  }
  
  addToSidebar() {
    const chatList = document.getElementById('chat-list');
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item active';
    chatItem.innerHTML = `
      <div class="chat-avatar">${this.activeChat.avatar}</div>
      <div class="chat-details">
        <div class="chat-name">${this.activeChat.name}</div>
        <div class="chat-preview">Active consultation</div>
      </div>
      <div class="chat-time">Now</div>
    `;
    chatList.appendChild(chatItem);
  }
  
  addContextMessage() {
    const contextHtml = `
      <div class="context-message">
        <div class="context-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Client Context Loaded
        </div>
        <div class="context-details">
          <div class="context-item">
            <span class="label">Participant ID:</span>
            <span class="value">${this.activeChat.clientId}</span>
          </div>
          <div class="context-item">
            <span class="label">Plan Type:</span>
            <span class="value">${this.activeChat.accountType}</span>
          </div>
          <div class="context-item">
            <span class="label">Vested Balance:</span>
            <span class="value">$127,000</span>
          </div>
        </div>
      </div>
    `;
    
    this.appendToChat(contextHtml);
  }
  
  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Clear input
    input.value = '';
    
    // Add user message
    this.addMessage(message, true);
    
    // Show typing indicator
    this.showTyping();
    
    // Get AI response
    const response = await this.api.sendMessage(message, this.activeChat);
    
    // Remove typing indicator
    this.hideTyping();
    
    // Add AI response
    this.addMessage(response.content, false);
  }
  
  addMessage(content, isUser) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'}">
        ${isUser ? '' : `
          <div class="message-avatar">
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
              <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
            </svg>
          </div>
        `}
        <div class="message-content">
          <div class="message-text">${this.formatContent(content)}</div>
        </div>
        ${isUser ? '<div class="message-avatar user-avatar">FA</div>' : ''}
      </div>
    `;
    
    this.appendToChat(messageHtml);
    this.messages.push({ content, isUser, timestamp: new Date() });
  }
  
  formatContent(content) {
    // Convert markdown-style formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
  
  showTyping() {
    const typingHtml = `
      <div class="typing-indicator" id="typing-indicator">
        <div class="message-avatar">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
            <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
          </svg>
        </div>
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    this.appendToChat(typingHtml);
  }
  
  hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }
  
  appendToChat(html) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.insertAdjacentHTML('beforeend', html);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  window.assistantAI = new AssistantAI();
});

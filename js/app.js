// AssistantAI 2.0 - Premium Enterprise Application
class AssistantAI {
  constructor() {
    this.api = new VertesiaAPI();
    this.activeChat = null;
    this.messages = [];
    this.viewMode = 'active'; // 'active' or 'archived'
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateAPIStatus();
    this.loadArchivedChats();
    
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
    const statusSubtext = statusEl.querySelector('.status-subtext');
    
    if (this.api.configured) {
      statusDot.className = 'status-dot connected';
      statusText.textContent = 'Live API Connected';
      statusSubtext.textContent = 'Vertesia Agent v2.0';
    } else {
      statusDot.className = 'status-dot demo';
      statusText.textContent = 'Demo Mode';
      statusSubtext.textContent = 'Sample Responses';
    }
  }
  
  loadArchivedChats() {
    const archivedList = document.getElementById('archived-chats');
    const chenData = CONFIG.clients['eleanor-chen'];
    
    const archivedItem = document.createElement('div');
    archivedItem.className = 'chat-item archived';
    archivedItem.innerHTML = `
      <div class="chat-avatar">
        <span>${chenData.avatar}</span>
        <div class="archived-indicator">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M12 2v20M2 12h20"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
      </div>
      <div class="chat-details">
        <div class="chat-name">${chenData.name}</div>
        <div class="chat-preview">403(b) loan consultation</div>
      </div>
      <div class="chat-meta">
        <div class="chat-time">1h ago</div>
        <div class="chat-status">Completed</div>
      </div>
    `;
    
    archivedItem.addEventListener('click', () => this.viewArchivedChat('eleanor-chen'));
    archivedList.appendChild(archivedItem);
  }
  
  viewArchivedChat(clientId) {
    const client = CONFIG.clients[clientId];
    if (!client || client.status !== 'archived') return;
    
    this.viewMode = 'archived';
    this.activeChat = client;
    
    // Hide welcome, show chat
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
    
    // Update UI for archived mode
    document.getElementById('client-name').textContent = client.name;
    document.getElementById('client-details').textContent = 
      `${client.company} • ${client.accountType}`;
    document.getElementById('avatar-text').textContent = client.avatar;
    document.getElementById('client-id').textContent = client.clientId;
    document.getElementById('client-age').textContent = `Age ${client.age}`;
    
    // Hide input for archived chats
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('archived-notice').style.display = 'flex';
    
    // Load archived messages
    this.loadArchivedMessages();
    
    // Update sidebar selection
    document.querySelectorAll('.chat-item').forEach(item => {
      item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
  }
  
  loadArchivedMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Add context message
    const contextHtml = `
      <div class="context-message archived">
        <div class="context-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <polyline points="9 11 12 14 22 4"/>
          </svg>
          Archived Consultation - ${new Date(CONFIG.archivedConversation.messages[0].timestamp).toLocaleDateString()}
        </div>
        <div class="context-details">
          <div class="context-item">
            <span class="label">Participant:</span>
            <span class="value">${this.activeChat.name}</span>
          </div>
          <div class="context-item">
            <span class="label">Balance:</span>
            <span class="value">${this.activeChat.balance}</span>
          </div>
          <div class="context-item">
            <span class="label">Outcome:</span>
            <span class="value">Loan inquiry resolved</span>
          </div>
        </div>
      </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', contextHtml);
    
    // Add archived messages
    CONFIG.archivedConversation.messages.forEach(msg => {
      this.addArchivedMessage(msg.content, msg.isUser, msg.timestamp);
    });
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
    this.viewMode = 'active';
    this.activeChat = CONFIG.clients['james-jackson'];
    
    // Hide welcome, show chat
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
    
    // Show input for active chats
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('archived-notice').style.display = 'none';
    
    // Update UI with client info
    document.getElementById('client-name').textContent = this.activeChat.name;
    document.getElementById('client-details').textContent = 
      `${this.activeChat.company} • ${this.activeChat.accountType}`;
    document.getElementById('avatar-text').textContent = this.activeChat.avatar;
    document.getElementById('client-id').textContent = this.activeChat.clientId;
    document.getElementById('client-age').textContent = `Age ${this.activeChat.age}`;
    
    // Add to sidebar
    this.addToSidebar();
    
    // Show initial context message
    this.addContextMessage();
    
    // Focus input
    document.getElementById('message-input').focus();
  }
  
  addToSidebar() {
    const chatList = document.getElementById('active-chats');
    chatList.innerHTML = ''; // Clear existing
    
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item active';
    chatItem.innerHTML = `
      <div class="chat-avatar">
        <span>${this.activeChat.avatar}</span>
        <div class="active-indicator"></div>
      </div>
      <div class="chat-details">
        <div class="chat-name">${this.activeChat.name}</div>
        <div class="chat-preview">Active consultation</div>
      </div>
      <div class="chat-meta">
        <div class="chat-time">Now</div>
        <div class="chat-status live">Live</div>
      </div>
    `;
    chatList.appendChild(chatItem);
  }
  
  addContextMessage() {
    const contextHtml = `
      <div class="context-message premium">
        <div class="context-shine"></div>
        <div class="context-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Client Context Synchronized
        </div>
        <div class="context-grid">
          <div class="context-item">
            <span class="label">Participant ID</span>
            <span class="value">${this.activeChat.clientId}</span>
          </div>
          <div class="context-item">
            <span class="label">Plan Type</span>
            <span class="value">${this.activeChat.accountType}</span>
          </div>
          <div class="context-item">
            <span class="label">Current Balance</span>
            <span class="value">${this.activeChat.balance}</span>
          </div>
          <div class="context-item">
            <span class="label">Vesting Status</span>
            <span class="value">100% Vested</span>
          </div>
        </div>
      </div>
    `;
    
    this.appendToChat(contextHtml);
  }
  
  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message || this.viewMode !== 'active') return;
    
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
          <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        ${isUser ? '<div class="message-avatar user-avatar">FA</div>' : ''}
      </div>
    `;
    
    this.appendToChat(messageHtml);
    this.messages.push({ content, isUser, timestamp: new Date() });
  }
  
  addArchivedMessage(content, isUser, timestamp) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'} archived">
        ${isUser ? '' : `
          <div class="message-avatar">
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
              <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
            </svg>
          </div>
        `}
        <div class="message-content">
          <div class="message-text">${this.formatContent(content)}</div>
          <div class="message-time">${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        ${isUser ? '<div class="message-avatar user-avatar">EC</div>' : ''}
      </div>
    `;
    
    this.appendToChat(messageHtml);
  }
  
  formatContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/^- /gm, '• ');
  }
  
  showTyping() {
    const typingHtml = `
      <div class="typing-indicator" id="typing-indicator">
        <div class="message-avatar">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6">
            <path d="M50,10 C70,10 85,25 85,45 C85,65 70,80 50,80 C30,80 15,65 15,45 C15,30 25,20 40,20 C50,20 55,25 55,35 C55,45 50,50 40,50 C35,50 32,47 32,42"/>
          </svg>
        </div>
        <div class="typing-bubble">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="typing-text">Analyzing request...</div>
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

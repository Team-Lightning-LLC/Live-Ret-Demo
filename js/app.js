// AssistantAI 2.0 - Premium Enterprise Application (Webhook Version)
class AssistantAI {
  constructor() {
    this.activeChat = null;
    this.activeChatId = null;
    this.messages = {};
    this.viewMode = 'active'; // 'active' or 'archived'

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadArchivedChats();
    setTimeout(() => this.showIncomingCall(), 2000);
  }

  setupEventListeners() {
    document.getElementById('accept-client-btn')?.addEventListener('click', () => this.acceptClient());
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('message-input');
    sendBtn?.addEventListener('click', () => this.sendMessage());
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
  }

  loadArchivedChats() {
    const archivedList = document.getElementById('archived-chats');
    const chenData = CONFIG.clients['eleanor-chen'];
    const archivedItem = document.createElement('div');
    archivedItem.className = 'chat-item archived';
    archivedItem.dataset.chatId = 'eleanor-chen';
    archivedItem.innerHTML = `
      <div class="chat-avatar"><span>${chenData.avatar}</span></div>
      <div class="chat-details">
        <div class="chat-name">${chenData.name}</div>
        <div class="chat-preview">403(b) loan consultation</div>
      </div>
      <div class="chat-meta">
        <div class="chat-time">1h ago</div>
        <div class="chat-status">Completed</div>
      </div>`;
    archivedItem.addEventListener('click', () => this.viewArchivedChat('eleanor-chen'));
    archivedList.appendChild(archivedItem);
  }

  viewArchivedChat(clientId) {
    const client = CONFIG.clients[clientId];
    if (!client || client.status !== 'archived') return;
    this.viewMode = 'archived';
    this.activeChat = client;
    this.activeChatId = clientId;
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
    document.getElementById('client-name').textContent = client.name;
    document.getElementById('client-details').textContent = `${client.company} • ${client.accountType}`;
    document.getElementById('avatar-text').textContent = client.avatar;
    document.getElementById('client-id').textContent = client.clientId;
    document.getElementById('client-age').textContent = `Age ${client.age}`;
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('archived-notice').style.display = 'flex';
    this.loadArchivedMessages();
    this.updateSidebarSelection(clientId);
  }

  updateSidebarSelection(selectedId) {
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    const selectedItem = document.querySelector(`[data-chat-id="${selectedId}"]`);
    if (selectedItem) selectedItem.classList.add('active');
  }

  loadArchivedMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    const contextHtml = `
      <div class="context-message archived">
        <div class="context-header">Archived Consultation - ${new Date(CONFIG.archivedConversation.messages[0].timestamp).toLocaleDateString()}</div>
        <div class="context-details">
          <div class="context-item"><span class="label">Participant:</span><span class="value">${this.activeChat.name}</span></div>
          <div class="context-item"><span class="label">Balance:</span><span class="value">${this.activeChat.balance}</span></div>
          <div class="context-item"><span class="label">Outcome:</span><span class="value">Loan inquiry resolved</span></div>
        </div>
      </div>`;
    chatMessages.insertAdjacentHTML('beforeend', contextHtml);
    CONFIG.archivedConversation.messages.forEach(msg => {
      this.addArchivedMessage(msg.content, msg.isUser, new Date(msg.timestamp));
    });
  }

  showIncomingCall() {
    const banner = document.getElementById('client-banner');
    banner.style.display = 'block';
    setTimeout(() => banner.classList.add('show'), 100);
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
    this.activeChatId = 'james-jackson';
    if (!this.messages[this.activeChatId]) this.messages[this.activeChatId] = [];
    document.getElementById('welcome-state').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('archived-notice').style.display = 'none';
    document.getElementById('client-name').textContent = this.activeChat.name;
    document.getElementById('client-details').textContent = `${this.activeChat.company} • ${this.activeChat.accountType}`;
    document.getElementById('avatar-text').textContent = this.activeChat.avatar;
    document.getElementById('client-id').textContent = this.activeChat.clientId;
    document.getElementById('client-age').textContent = `Age ${this.activeChat.age}`;
    this.addToSidebar();
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    this.addContextMessage();
    this.messages[this.activeChatId].forEach(msg => this.addMessage(msg.content, msg.isUser, false));
    document.getElementById('message-input').focus();
  }

  addToSidebar() {
    const chatList = document.getElementById('active-chats');
    let existingItem = document.querySelector(`[data-chat-id="james-jackson"]`);
    if (!existingItem) {
      existingItem = document.createElement('div');
      existingItem.className = 'chat-item';
      existingItem.dataset.chatId = 'james-jackson';
      chatList.appendChild(existingItem);
    }
    existingItem.className = 'chat-item active';
    existingItem.innerHTML = `
      <div class="chat-avatar"><span>${this.activeChat.avatar}</span><div class="active-indicator"></div></div>
      <div class="chat-details"><div class="chat-name">${this.activeChat.name}</div><div class="chat-preview">Active consultation</div></div>
      <div class="chat-meta"><div class="chat-time">Now</div><div class="chat-status live">Live</div></div>`;
    existingItem.addEventListener('click', () => {
      if (this.viewMode !== 'active' || this.activeChatId !== 'james-jackson') this.startConsultation();
    });
    this.updateSidebarSelection('james-jackson');
  }

  addContextMessage() {
    const contextHtml = `
      <div class="context-message premium">
        <div class="context-header">Client Context Synchronized</div>
        <div class="context-grid">
          <div class="context-item"><span class="label">Participant ID</span><span class="value">${this.activeChat.clientId}</span></div>
          <div class="context-item"><span class="label">Plan Type</span><span class="value">${this.activeChat.accountType}</span></div>
          <div class="context-item"><span class="label">Current Balance</span><span class="value">${this.activeChat.balance}</span></div>
          <div class="context-item"><span class="label">Vesting Status</span><span class="value">100% Vested</span></div>
        </div>
      </div>`;
    this.appendToChat(contextHtml);
  }

  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (!message || this.viewMode !== 'active') return;
    input.value = '';
    this.addMessage(message, true, true);
    this.showTyping();
    try {
      const response = await fetch('https://your-n8n-webhook-url.com/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      this.hideTyping();
      this.addMessage(result.result || result.message || JSON.stringify(result), false, true);
    } catch (err) {
      console.error('Webhook error:', err);
      this.hideTyping();
      this.addMessage('Sorry, there was an error processing your request.', false, true);
    }
  }

  addMessage(content, isUser, saveToHistory = false) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'}">
        <div class="message-content">
          <div class="message-text">${this.formatContent(content)}</div>
          <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        ${isUser ? '<div class="message-avatar user-avatar">FA</div>' : ''}
      </div>`;
    this.appendToChat(messageHtml);
    if (saveToHistory && this.activeChatId) {
      this.messages[this.activeChatId].push({ content, isUser, timestamp: new Date() });
    }
  }

  addArchivedMessage(content, isUser, timestamp) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'} archived">
        <div class="message-content">
          <div class="message-text">${this.formatContent(content)}</div>
          <div class="message-time">${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        ${isUser ? '<div class="message-avatar user-avatar">EC</div>' : ''}
      </div>`;
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
        <div class="typing-bubble">
          <div class="typing-dots"><span></span><span></span><span></span></div>
          <div class="typing-text">Analyzing request...</div>
        </div>
      </div>`;
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

document.addEventListener('DOMContentLoaded', () => {
  window.assistantAI = new AssistantAI();
});

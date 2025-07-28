// Main Application Controller
class AssistantAI {
  constructor() {
    this.initializeApp();
    this.bindEvents();
    this.loadExistingConsultations();
    this.startIncomingCallTimer();
  }
  
  initializeApp() {
    console.log('AssistantAI initialized');
    this.showWelcomeState();
    
    // Check API connection periodically
    setInterval(() => {
      ChatManager.checkApiConnection();
    }, 30000); // Check every 30 seconds
  }
  
  acceptClient(clientId) {
    this.hideClientBanner();
    this.startNewConsultation(clientId, true);
  }
  
  declineClient() {
    this.hideClientBanner();
    
    // Show decline message
    const welcomeContent = document.querySelector('.welcome-content');
    welcomeContent.innerHTML = `
      <div class="decline-message">
        <div class="decline-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2>Consultation Declined</h2>
        <p>The consultation request has been declined.</p>
      </div>
    `;
    
    // Reset after 3 seconds
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
  
  loadExistingConsultations() {
    // Create Dr. Chen's consultation (older)
    const chenConsultation = ChatManager.createConsultation('eleanor-chen');
    if (chenConsultation) {
      chenConsultation.startTime = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago
      chenConsultation.messages = [
        {
          id: 'msg-ec-1',
          content: "How much can I borrow from my 403b??",
          isUser: true,
          timestamp: new Date(Date.now() - 44 * 60 * 1000)
        },
        {
          id: 'msg-ec-2',
          content: aiResponses['eleanor-chen']['borrowing'],
          isUser: false,
          timestamp: new Date(Date.now() - 43 * 60 * 1000)
        }
      ];
      
      const chatItem = ChatManager.addToSidebar(chenConsultation);
      const previewEl = chatItem.querySelector('.chat-preview');
      if (previewEl) {
        previewEl.textContent = '403(b) loan inquiry completed';
      }
    }
  }
  
  startIncomingCallTimer() {
    // Show incoming call after 30 seconds
    setTimeout(() => {
      this.showIncomingCall();
    }, 30000);
  }
  
  showIncomingCall() {
    const banner = document.getElementById('client-banner');
    banner.style.display = 'flex';
    banner.style.transform = 'translateY(-100%)';
    banner.style.opacity = '0';
    
    // Animate in
    setTimeout(() => {
      banner.style.transform = 'translateY(0)';
      banner.style.opacity = '1';
    }, 100);
  }
  
  bindEvents() {
    // Client banner actions
    document.getElementById('accept-client-btn')?.addEventListener('click', () => {
      this.acceptClient('james-jackson');
    });
    
    document.getElementById('decline-client-btn')?.addEventListener('click', () => {
      this.declineClient();
    });
    
    // Manual new consultation
    document.getElementById('manual-new-chat-btn')?.addEventListener('click', () => {
      this.startBlankConsultation();
    });
    
    // Message input
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn?.addEventListener('click', () => {
      this.sendMessage();
    });
    
    messageInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize textarea
    messageInput?.addEventListener('input', (e) => {
      this.autoResizeTextarea(e.target);
    });
    
    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const suggestion = btn.dataset.suggestion;
        messageInput.value = suggestion;
        this.sendMessage();
      });
    });
    
    // Header actions
    document.getElementById('call-btn')?.addEventListener('click', () => {
      this.showCallModal();
    });
    
    document.getElementById('export-btn')?.addEventListener('click', () => {
      this.showExportModal();
    });
    
    // Modal actions
    document.getElementById('end-call-btn')?.addEventListener('click', () => {
      this.hideCallModal();
    });
    
    document.getElementById('close-export-btn')?.addEventListener('click', () => {
      this.hideExportModal();
    });
    
    document.getElementById('cancel-export-btn')?.addEventListener('click', () => {
      this.hideExportModal();
    });
    
    // Settings
    document.getElementById('settings-btn')?.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
    
    // Click outside modals to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.hideAllModals();
      }
    });
  }
  
  showWelcomeState() {
    document.getElementById('welcome-state').style.display = 'block';
    document.getElementById('chat-interface').style.display = 'none';
  }
  
  hideClientBanner() {
    const banner = document.getElementById('client-banner');
    banner.style.transform = 'translateY(-100%)';
    banner.style.opacity = '0';
    
    setTimeout(() => {
      banner.style.display = 'none';
    }, 300);
  }
  
  startBlankConsultation() {
    // Create a blank consultation without a specific client
    const blankConsultation = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientId: 'manual',
      client: {
        id: 'manual',
        name: 'Manual Entry',
        company: 'Enter client details',
        accountType: 'To be determined',
        avatar: 'ME'
      },
      messages: [],
      startTime: new Date(),
      isActive: true
    };
    
    ChatManager.chats.set(blankConsultation.id, blankConsultation);
    ChatManager.addToSidebar(blankConsultation);
    ChatManager.activateConsultation(blankConsultation.id);
  }
  
  startNewConsultation(clientId, isAccepted = false) {
    const consultation = ChatManager.createConsultation(clientId);
    if (!consultation) return;
    
    ChatManager.addToSidebar(consultation);
    ChatManager.activateConsultation(consultation.id);
  }
  
  sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message || !ChatManager.activeChat) return;
    
    ChatManager.addMessage(ChatManager.activeChat.id, message, true);
    
    messageInput.value = '';
    this.autoResizeTextarea(messageInput);
    
    ChatManager.processAIResponse(message, ChatManager.activeChat.clientId);
  }
  
  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
  
  showCallModal() {
    document.getElementById('call-modal').classList.add('active');
  }
  
  hideCallModal() {
    document.getElementById('call-modal').classList.remove('active');
  }
  
  showExportModal() {
    const summary = ChatManager.generateExportSummary();
    document.getElementById('export-summary').textContent = summary;
    document.getElementById('export-modal').classList.add('active');
  }
  
  hideExportModal() {
    document.getElementById('export-modal').classList.remove('active');
  }
  
  hideAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AssistantAI();
});

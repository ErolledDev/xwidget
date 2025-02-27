(function() {
  class BusinessChatPlugin {
    constructor(options) {
      this.options = options || {};
      this.uid = options.uid;
      this.initialized = false;
      this.messages = [];
      this.settings = null;
      this.autoReplies = [];
      this.advancedReplies = [];
      this.isTyping = false;
      this.unreadCount = 1;
      
      // Initialize the chat widget
      this.init();
    }
    
    async init() {
      if (this.initialized) return;
      
      try {
        // Load settings and auto-replies from Supabase
        await this.loadData();
        
        // Create widget UI
        this.createWidgetUI();
        
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize chat widget:', error);
      }
    }
    
    async loadData() {
      try {
        // Fetch widget settings
        const settingsResponse = await fetch(`https://usyavvmfddorgmitctym.supabase.co/rest/v1/widget_settings?user_id=eq.${this.uid}&select=*`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeWF2dm1mZGRvcmdtaXRjdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Njc0MTUsImV4cCI6MjA1NjI0MzQxNX0.Oxz6W0XLIYEmxGFBhh3FRX5kjHH6JIZ7ZKH2_ORlb60',
            'Content-Type': 'application/json'
          }
        });
        
        const settingsData = await settingsResponse.json();
        this.settings = settingsData[0] || {
          business_name: 'Business Chat',
          representative_name: 'Support Agent',
          brand_color: '#3B82F6',
          business_description: 'How can we help you today?'
        };
        
        // Fetch auto-replies
        const repliesResponse = await fetch(`https://usyavvmfddorgmitctym.supabase.co/rest/v1/auto_replies?user_id=eq.${this.uid}&select=*`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeWF2dm1mZGRvcmdtaXRjdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Njc0MTUsImV4cCI6MjA1NjI0MzQxNX0.Oxz6W0XLIYEmxGFBhh3FRX5kjHH6JIZ7ZKH2_ORlb60',
            'Content-Type': 'application/json'
          }
        });
        
        const repliesData = await repliesResponse.json();
        this.autoReplies = repliesData || [];
        
        // Fetch advanced replies
        const advancedRepliesResponse = await fetch(`https://usyavvmfddorgmitctym.supabase.co/rest/v1/advanced_replies?user_id=eq.${this.uid}&select=*`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeWF2dm1mZGRvcmdtaXRjdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Njc0MTUsImV4cCI6MjA1NjI0MzQxNX0.Oxz6W0XLIYEmxGFBhh3FRX5kjHH6JIZ7ZKH2_ORlb60',
            'Content-Type': 'application/json'
          }
        });
        
        const advancedRepliesData = await advancedRepliesResponse.json();
        this.advancedReplies = advancedRepliesData || [];
      } catch (error) {
        console.error('Failed to load widget data:', error);
      }
    }
    
    createWidgetUI() {
      // Add styles to document
      this.addStyles();
      
      // Create widget container
      const container = document.createElement('div');
      container.id = 'business-chat-widget';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      document.body.appendChild(container);
      
      // Create chat button
      const chatButton = document.createElement('div');
      chatButton.id = 'business-chat-button';
      chatButton.className = 'business-chat-button-pulse';
      chatButton.style.width = '60px';
      chatButton.style.height = '60px';
      chatButton.style.borderRadius = '50%';
      chatButton.style.backgroundColor = this.settings?.brand_color || '#3B82F6';
      chatButton.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
      chatButton.style.display = 'flex';
      chatButton.style.alignItems = 'center';
      chatButton.style.justifyContent = 'center';
      chatButton.style.cursor = 'pointer';
      chatButton.style.transition = 'all 0.3s ease';
      chatButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      `;
      container.appendChild(chatButton);
      
      // Create notification badge
      const notificationBadge = document.createElement('div');
      notificationBadge.id = 'business-chat-notification';
      notificationBadge.style.position = 'absolute';
      notificationBadge.style.top = '-5px';
      notificationBadge.style.right = '-5px';
      notificationBadge.style.backgroundColor = '#FF5252';
      notificationBadge.style.color = 'white';
      notificationBadge.style.borderRadius = '50%';
      notificationBadge.style.width = '22px';
      notificationBadge.style.height = '22px';
      notificationBadge.style.display = 'flex';
      notificationBadge.style.alignItems = 'center';
      notificationBadge.style.justifyContent = 'center';
      notificationBadge.style.fontSize = '12px';
      notificationBadge.style.fontWeight = 'bold';
      notificationBadge.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      notificationBadge.textContent = this.unreadCount.toString();
      chatButton.appendChild(notificationBadge);
      
      // Create chat window (initially hidden)
      const chatWindow = document.createElement('div');
      chatWindow.id = 'business-chat-window';
      chatWindow.style.position = 'absolute';
      chatWindow.style.bottom = '80px';
      chatWindow.style.right = '0';
      chatWindow.style.width = '380px';
      chatWindow.style.maxWidth = '100vw';
      chatWindow.style.height = '580px';
      chatWindow.style.maxHeight = 'calc(100vh - 100px)';
      chatWindow.style.backgroundColor = 'white';
      chatWindow.style.borderRadius = '16px';
      chatWindow.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
      chatWindow.style.display = 'none';
      chatWindow.style.flexDirection = 'column';
      chatWindow.style.overflow = 'hidden';
      chatWindow.style.transition = 'all 0.3s ease';
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'translateY(20px) scale(0.95)';
      container.appendChild(chatWindow);
      
      // Create chat header
      const chatHeader = document.createElement('div');
      chatHeader.style.padding = '20px';
      chatHeader.style.background = this.settings?.brand_color || '#3B82F6';
      chatHeader.style.color = 'white';
      chatHeader.style.borderTopLeftRadius = '16px';
      chatHeader.style.borderTopRightRadius = '16px';
      chatHeader.style.position = 'relative';
      chatHeader.style.zIndex = '1';
      chatHeader.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      
      // Add a subtle gradient for the header background instead of pattern
      const brandColor = this.settings?.brand_color || '#3B82F6';
      const lighterColor = this.lightenDarkenColor(brandColor, 20);
      const darkerColor = this.lightenDarkenColor(brandColor, -20);
      
      chatHeader.style.backgroundImage = `linear-gradient(135deg, ${darkerColor} 0%, ${brandColor} 50%, ${lighterColor} 100%)`;
      
      chatHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; margin-right: 14px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <div style="font-weight: bold; font-size: 18px; color: white; margin-bottom: 2px;">${this.settings?.business_name || 'Business Chat'}</div>
              <div style="font-size: 13px; opacity: 0.9; color: white; display: flex; align-items: center;">
                <span style="display: inline-block; width: 8px; height: 8px; background-color: #4ADE80; border-radius: 50%; margin-right: 6px;"></span>
                Chat with ${this.settings?.representative_name || 'Support'}
              </div>
            </div>
          </div>
          <div id="business-chat-close" style="cursor: pointer; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      `;
      chatWindow.appendChild(chatHeader);
      
      // Create chat messages container
      const chatMessages = document.createElement('div');
      chatMessages.id = 'business-chat-messages';
      chatMessages.style.flex = '1';
      chatMessages.style.padding = '20px';
      chatMessages.style.overflowY = 'auto';
      chatMessages.style.backgroundColor = '#f9fafb';
      // Remove pattern background
      chatMessages.style.backgroundImage = 'none';
      chatWindow.appendChild(chatMessages);
      
      // Add welcome message
      const welcomeMessage = document.createElement('div');
      welcomeMessage.className = 'business-chat-message business-chat-message-bot';
      welcomeMessage.innerHTML = `
        <div class="business-chat-message-content">
          ${this.settings?.business_description || 'How can we help you today?'}
        </div>
        <div class="business-chat-message-time">${this.formatTime(new Date())}</div>
      `;
      chatMessages.appendChild(welcomeMessage);
      
      // Create advanced replies container (initially hidden)
      const advancedRepliesContainer = document.createElement('div');
      advancedRepliesContainer.id = 'business-chat-advanced-replies';
      advancedRepliesContainer.style.display = 'none';
      advancedRepliesContainer.style.padding = '12px 16px';
      advancedRepliesContainer.style.borderTop = '1px solid #eaeaea';
      advancedRepliesContainer.style.backgroundColor = '#f0f0f0';
      advancedRepliesContainer.style.textAlign = 'left';
      chatWindow.appendChild(advancedRepliesContainer);
      
      // Create typing indicator (initially hidden)
      const typingIndicator = document.createElement('div');
      typingIndicator.id = 'business-chat-typing';
      typingIndicator.className = 'business-chat-message business-chat-message-bot business-chat-typing-indicator';
      typingIndicator.style.display = 'none';
      typingIndicator.innerHTML = `
        <div class="business-chat-message-content">
          <div class="business-chat-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      chatMessages.appendChild(typingIndicator);
      
      // Create chat input area
      const chatInputArea = document.createElement('div');
      chatInputArea.style.padding = '16px 20px';
      chatInputArea.style.borderTop = '1px solid #eaeaea';
      chatInputArea.style.backgroundColor = 'white';
      chatInputArea.innerHTML = `
        <div style="display: flex; align-items: center;">
          <input id="business-chat-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 14px 18px; border: 1px solid #e0e0e0; border-radius: 24px; outline: none; font-size: 14px; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <button id="business-chat-send" style="margin-left: 10px; background-color: ${this.settings?.brand_color || '#3B82F6'}; color: white; border: none; border-radius: 50%; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: all 0.2s ease;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      `;
      chatWindow.appendChild(chatInputArea);
      
      // Add event listeners
      chatButton.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
        setTimeout(() => {
          chatWindow.style.opacity = '1';
          chatWindow.style.transform = 'translateY(0) scale(1)';
        }, 10);
        chatButton.style.display = 'none';
        notificationBadge.style.display = 'none';
        this.unreadCount = 0;
      });
      
      const closeButton = document.getElementById('business-chat-close');
      closeButton.addEventListener('click', () => {
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          chatWindow.style.display = 'none';
          chatButton.style.display = 'flex';
        }, 300);
      });
      
      closeButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      });
      
      closeButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      
      const chatInput = document.getElementById('business-chat-input');
      const chatSend = document.getElementById('business-chat-send');
      
      const self = this; // Store reference to 'this' for use in event handlers
      
      chatInput.addEventListener('focus', function() {
        this.style.boxShadow = `0 0 0 2px ${self.settings?.brand_color || '#3B82F6'}30`;
      });
      
      chatInput.addEventListener('blur', function() {
        this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
      });
      
      chatSend.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      chatSend.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
      });
      
      const sendMessage = () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Hide any advanced replies
        this.hideAdvancedReplies();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message with delay
        setTimeout(() => {
          this.hideTypingIndicator();
          
          // Check for advanced replies first
          const matchedAdvancedReplies = this.findMatchingAdvancedReplies(message);
          
          if (matchedAdvancedReplies.length > 0) {
            // If we have advanced replies, show them
            this.showAdvancedReplies(matchedAdvancedReplies);
            this.addMessage("I found some information that might help:", 'bot');
          } else {
            // Otherwise process as regular auto-reply
            this.processAutoReply(message);
          }
        }, Math.random() * 1000 + 500); // Random delay between 500ms and 1500ms
      };
      
      chatSend.addEventListener('click', sendMessage);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
      
      // Add responsive styles for mobile
      this.addResponsiveStyles();
    }
    
    addStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .business-chat-button-pulse {
          animation: business-chat-pulse 2s infinite;
        }
        
        @keyframes business-chat-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .business-chat-message {
          margin-bottom: 16px;
          max-width: 85%;
          animation: business-chat-fade-in 0.3s ease;
        }
        
        .business-chat-message-bot {
          align-self: flex-start;
          margin-right: auto;
        }
        
        .business-chat-message-user {
          align-self: flex-end;
          margin-left: auto;
        }
        
        .business-chat-message-content {
          padding: 14px 18px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .business-chat-message-bot .business-chat-message-content {
          background-color: white;
          border-bottom-left-radius: 4px;
          border: 1px solid #e5e7eb;
        }
        
        .business-chat-message-user .business-chat-message-content {
          background-color: ${this.settings?.brand_color || '#3B82F6'};
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .business-chat-message-time {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 4px;
          padding-left: 4px;
        }
        
        @keyframes business-chat-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .business-chat-typing-dots {
          display: flex;
          align-items: center;
          height: 16px;
        }
        
        .business-chat-typing-dots span {
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #9ca3af;
          display: inline-block;
          margin-right: 4px;
          animation: business-chat-typing 1.4s infinite ease-in-out both;
        }
        
        .business-chat-typing-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .business-chat-typing-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes business-chat-typing {
          0%, 80%, 100% { 
            transform: scale(0.6);
          }
          40% { 
            transform: scale(1);
          }
        }
        
        #business-chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        #business-chat-messages::-webkit-scrollbar-track {
          background: transparent; 
        }
        
        #business-chat-messages::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 20px;
        }
        
        #business-chat-messages {
          display: flex;
          flex-direction: column;
          scroll-behavior: smooth;
        }
        
        #business-chat-input {
          font-size: 14px;
        }
        
        #business-chat-input::placeholder {
          color: #9ca3af;
        }
        
        #business-chat-button {
          transform: scale(1);
          transition: transform 0.3s ease;
        }
        
        #business-chat-button:hover {
          transform: scale(1.05);
        }
        
        .business-chat-advanced-reply-button {
          display: block;
          margin: 8px 0;
          padding: 12px 16px;
          background-color: white;
          color: ${this.settings?.brand_color || '#3B82F6'};
          border: 1px solid ${this.settings?.brand_color || '#3B82F6'};
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-align: left;
          width: 100%;
        }
        
        .business-chat-advanced-reply-button:hover {
          background-color: ${this.settings?.brand_color || '#3B82F6'};
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        /* Enhanced animations and effects */
        #business-chat-window {
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .business-chat-message-content {
          transition: all 0.2s ease;
        }
        
        .business-chat-message-content:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        #business-chat-send {
          position: relative;
          overflow: hidden;
        }
        
        #business-chat-send:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.3s ease;
        }
        
        #business-chat-send:active:after {
          transform: scale(1);
          opacity: 0;
          transition: 0s;
        }
        
        #business-chat-button {
          position: relative;
          overflow: hidden;
        }
        
        #business-chat-button:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.3s ease;
        }
        
        #business-chat-button:active:after {
          transform: scale(1);
          opacity: 0;
          transition: 0s;
        }
      `;
      document.head.appendChild(style);
    }
    
    addResponsiveStyles() {
      const mediaQuery = window.matchMedia('(max-width: 480px)');
      
      const applyMobileStyles = (matches) => {
        const chatWindow = document.getElementById('business-chat-window');
        const chatButton = document.getElementById('business-chat-button');
        
        if (matches) {
          // Mobile styles
          chatWindow.style.width = '100%';
          chatWindow.style.right = '0';
          chatWindow.style.bottom = '0';
          chatWindow.style.borderRadius = '16px 16px 0 0';
          chatWindow.style.height = '85vh';
          
          chatButton.style.width = '54px';
          chatButton.style.height = '54px';
        } else {
          // Desktop styles
          chatWindow.style.width = '380px';
          chatWindow.style.right = '0';
          chatWindow.style.bottom = '80px';
          chatWindow.style.borderRadius = '16px';
          chatWindow.style.height = '580px';
          
          chatButton.style.width = '60px';
          chatButton.style.height = '60px';
        }
      };
      
      // Apply styles initially
      applyMobileStyles(mediaQuery.matches);
      
      // Add listener for screen size changes
      mediaQuery.addEventListener('change', (e) => {
        applyMobileStyles(e.matches);
      });
    }
    
    addMessage(text, sender) {
      const chatMessages = document.getElementById('business-chat-messages');
      const messageElement = document.createElement('div');
      
      messageElement.className = `business-chat-message business-chat-message-${sender}`;
      
      const currentTime = new Date();
      
      messageElement.innerHTML = `
        <div class="business-chat-message-content">${text}</div>
        <div class="business-chat-message-time">${this.formatTime(currentTime)}</div>
      `;
      
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Store message
      this.messages.push({ text, sender, time: currentTime });
      
      // Update unread count if chat window is closed
      if (document.getElementById('business-chat-window').style.display === 'none' && sender === 'bot') {
        this.unreadCount++;
        const notificationBadge = document.getElementById('business-chat-notification');
        notificationBadge.textContent = this.unreadCount.toString();
        notificationBadge.style.display = 'flex';
      }
    }
    
    showTypingIndicator() {
      if (this.isTyping) return;
      
      this.isTyping = true;
      const typingIndicator = document.getElementById('business-chat-typing');
      typingIndicator.style.display = 'block';
      
      const chatMessages = document.getElementById('business-chat-messages');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
      this.isTyping = false;
      const typingIndicator = document.getElementById('business-chat-typing');
      typingIndicator.style.display = 'none';
    }
    
    findMatchingAdvancedReplies(userMessage) {
      // Check for matching advanced replies
      const matches = [];
      
      for (const reply of this.advancedReplies) {
        let isMatch = false;
        
        switch (reply.match_type) {
          case 'exact':
            isMatch = userMessage.toLowerCase() === reply.keyword.toLowerCase();
            break;
          case 'fuzzy':
            isMatch = this.fuzzyMatch(userMessage.toLowerCase(), reply.keyword.toLowerCase());
            break;
          case 'regex':
            try {
              const regex = new RegExp(reply.keyword, 'i');
              isMatch = regex.test(userMessage);
            } catch (e) {
              isMatch = false;
            }
            break;
          case 'contains':
            isMatch = userMessage.toLowerCase().includes(reply.keyword.toLowerCase());
            break;
        }
        
        if (isMatch) {
          matches.push(reply);
          // Limit to 3 matches
          if (matches.length >= 3) break;
        }
      }
      
      return matches;
    }
    
    showAdvancedReplies(replies) {
      const container = document.getElementById('business-chat-advanced-replies');
      container.innerHTML = '';
      container.style.display = 'block';
      
      // Add a title
      const title = document.createElement('div');
      title.style.fontSize = '13px';
      title.style.color = '#4b5563';
      title.style.marginBottom = '10px';
      title.style.fontWeight = '500';
      title.textContent = 'Quick options:';
      container.appendChild(title);
      
      // Add buttons for each reply
      for (const reply of replies) {
        const button = document.createElement('a');
        button.className = 'business-chat-advanced-reply-button';
        button.textContent = reply.button_text;
        
        // Add icon to the button
        const iconContainer = document.createElement('div');
        iconContainer.style.display = 'flex';
        iconContainer.style.alignItems = 'center';
        
        const icon = document.createElement('span');
        icon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            ${reply.url ? 
              '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>' : 
              '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'}
          </svg>
        `;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = reply.button_text;
        
        iconContainer.appendChild(icon);
        iconContainer.appendChild(textSpan);
        button.innerHTML = '';
        button.appendChild(iconContainer);
        
        if (reply.url) {
          button.href = reply.url;
          button.target = '_blank';
        } else {
          button.href = 'javascript:void(0)';
          button.addEventListener('click', () => {
            // Hide advanced replies
            this.hideAdvancedReplies();
            
            // Add the response as a bot message
            this.addMessage(reply.response, 'bot');
          });
        }
        
        container.appendChild(button);
      }
      
      // Scroll to show the buttons
      const chatMessages = document.getElementById('business-chat-messages');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    hideAdvancedReplies() {
      const container = document.getElementById('business-chat-advanced-replies');
      container.style.display = 'none';
      container.innerHTML = '';
    }
    
    processAutoReply(userMessage) {
      // Check for matching auto-replies
      let matchedReply = null;
      
      for (const reply of this.autoReplies) {
        let isMatch = false;
        
        switch (reply.match_type) {
          case 'exact':
            isMatch = userMessage.toLowerCase() === reply.keyword.toLowerCase();
            break;
          case 'fuzzy':
            isMatch = this.fuzzyMatch(userMessage.toLowerCase(), reply.keyword.toLowerCase());
            break;
          case 'regex':
            try {
              const regex = new RegExp(reply.keyword, 'i');
              isMatch = regex.test(userMessage);
            } catch (e) {
              isMatch = false;
            }
            break;
          case 'synonym':
            isMatch = userMessage.toLowerCase() === reply.keyword.toLowerCase();
            if (!isMatch && reply.synonyms) {
              isMatch = reply.synonyms.some(s => s.toLowerCase() === userMessage.toLowerCase());
            }
            break;
        }
        
        if (isMatch) {
          matchedReply = reply;
          break;
        }
      }
      
      if (matchedReply) {
        this.addMessage(matchedReply.response, 'bot');
      } else {
        this.addMessage("Thank you for your message. We'll get back to you as soon as possible.", 'bot');
      }
    }
    
    fuzzyMatch(str1, str2) {
      // Simple fuzzy matching algorithm
      if (str1.includes(str2) || str2.includes(str1)) return true;
      
      // Check if more than 70% of characters match
      let matches = 0;
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;
      
      for (let i = 0; i < shorter.length; i++) {
        if (longer.includes(shorter[i])) {
          matches++;
        }
      }
      
      return matches / shorter.length > 0.7;
    }
    
    formatTime(date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    
    hexToRgb(hex) {
      // Remove # if present
      hex = hex.replace(/^#/, '');
      
      // Parse hex values
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      
      return { r, g, b };
    }
    
    lightenDarkenColor(col, amt) {
      let usePound = false;
      
      if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
      }
      
      let num = parseInt(col, 16);
      
      let r = (num >> 16) + amt;
      if (r > 255) r = 255;
      else if (r < 0) r = 0;
      
      let b = ((num >> 8) & 0x00FF) + amt;
      if (b > 255) b = 255;
      else if (b < 0) b = 0;
      
      let g = (num & 0x0000FF) + amt;
      if (g > 255) g = 255;
      else if (g < 0) g = 0;
      
      return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    }
  }
  
  // Expose to global scope
  window.BusinessChatPlugin = BusinessChatPlugin;
})();
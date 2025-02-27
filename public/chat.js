(function() {
  class BusinessChatPlugin {
    constructor(options) {
      this.options = options || {};
      this.uid = options.uid;
      this.initialized = false;
      this.messages = [];
      this.settings = null;
      this.autoReplies = [];
      this.isTyping = false;
      
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
      notificationBadge.textContent = '1';
      chatButton.appendChild(notificationBadge);
      
      // Create chat window (initially hidden)
      const chatWindow = document.createElement('div');
      chatWindow.id = 'business-chat-window';
      chatWindow.style.position = 'absolute';
      chatWindow.style.bottom = '80px';
      chatWindow.style.right = '0';
      chatWindow.style.width = '360px';
      chatWindow.style.maxWidth = '100vw';
      chatWindow.style.height = '520px';
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
      chatHeader.style.padding = '18px';
      chatHeader.style.background = this.settings?.brand_color || '#3B82F6';
      chatHeader.style.color = 'white';
      chatHeader.style.borderTopLeftRadius = '16px';
      chatHeader.style.borderTopRightRadius = '16px';
      chatHeader.style.position = 'relative';
      chatHeader.style.zIndex = '1';
      chatHeader.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      
      chatHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div style="font-weight: bold; font-size: 18px; color: white;">${this.settings?.business_name || 'Business Chat'}</div>
              <div style="font-size: 13px; opacity: 0.9; color: white;">Chat with ${this.settings?.representative_name || 'Support'}</div>
            </div>
          </div>
          <div id="business-chat-close" style="cursor: pointer; width: 34px; height: 34px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
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
      chatMessages.style.padding = '16px';
      chatMessages.style.overflowY = 'auto';
      chatMessages.style.backgroundColor = '#f9f9f9';
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
      chatInputArea.style.padding = '14px 16px';
      chatInputArea.style.borderTop = '1px solid #eaeaea';
      chatInputArea.style.backgroundColor = '#f9f9f9';
      chatInputArea.innerHTML = `
        <div style="display: flex; align-items: center;">
          <input id="business-chat-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 14px; border: 1px solid #e0e0e0; border-radius: 24px; outline: none; font-size: 14px; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <button id="business-chat-send" style="margin-left: 8px; background-color: ${this.settings?.brand_color || '#3B82F6'}; color: white; border: none; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: all 0.2s ease;">
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
      });
      
      document.getElementById('business-chat-close').addEventListener('click', () => {
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          chatWindow.style.display = 'none';
          chatButton.style.display = 'flex';
        }, 300);
      });
      
      document.getElementById('business-chat-close').addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      });
      
      document.getElementById('business-chat-close').addEventListener('mouseout', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      
      const chatInput = document.getElementById('business-chat-input');
      const chatSend = document.getElementById('business-chat-send');
      
      chatInput.addEventListener('focus', function() {
        this.style.boxShadow = `0 0 0 2px ${this.settings?.brand_color || '#3B82F6'}30`;
      }.bind(this));
      
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
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process auto-reply with delay
        setTimeout(() => {
          this.hideTypingIndicator();
          this.processAutoReply(message);
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
          margin-bottom: 14px;
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
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .business-chat-message-bot .business-chat-message-content {
          background-color: #f0f0f0;
          border-bottom-left-radius: 4px;
        }
        
        .business-chat-message-user .business-chat-message-content {
          background-color: ${this.settings?.brand_color || '#3B82F6'};
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .business-chat-message-time {
          font-size: 10px;
          color: #999;
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
          background-color: #aaa;
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
          color: #aaa;
        }
        
        #business-chat-button {
          transform: scale(1);
          transition: transform 0.3s ease;
        }
        
        #business-chat-button:hover {
          transform: scale(1.05);
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
          chatWindow.style.height = '80vh';
          
          chatButton.style.width = '50px';
          chatButton.style.height = '50px';
        } else {
          // Desktop styles
          chatWindow.style.width = '360px';
          chatWindow.style.right = '0';
          chatWindow.style.bottom = '80px';
          chatWindow.style.borderRadius = '16px';
          chatWindow.style.height = '520px';
          
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
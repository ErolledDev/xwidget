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
      chatButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      chatButton.style.display = 'flex';
      chatButton.style.alignItems = 'center';
      chatButton.style.justifyContent = 'center';
      chatButton.style.cursor = 'pointer';
      chatButton.style.transition = 'all 0.3s ease';
      chatButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
      notificationBadge.style.width = '20px';
      notificationBadge.style.height = '20px';
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
      chatWindow.style.width = '350px';
      chatWindow.style.height = '500px';
      chatWindow.style.backgroundColor = 'white';
      chatWindow.style.borderRadius = '12px';
      chatWindow.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.2)';
      chatWindow.style.display = 'none';
      chatWindow.style.flexDirection = 'column';
      chatWindow.style.overflow = 'hidden';
      chatWindow.style.transition = 'all 0.3s ease';
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'translateY(20px) scale(0.95)';
      container.appendChild(chatWindow);
      
      // Create chat header
      const chatHeader = document.createElement('div');
      chatHeader.style.padding = '16px';
      chatHeader.style.background = `linear-gradient(135deg, ${this.settings?.brand_color || '#3B82F6'}, ${this.lightenDarkenColor(this.settings?.brand_color || '#3B82F6', 30)})`;
      chatHeader.style.color = 'white';
      chatHeader.style.borderTopLeftRadius = '12px';
      chatHeader.style.borderTopRightRadius = '12px';
      chatHeader.style.position = 'relative';
      chatHeader.style.zIndex = '1';
      chatHeader.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      
      // Add header pattern
      chatHeader.style.backgroundImage = `
        radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 20%),
        radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 20%)
      `;
      
      chatHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; margin-right: 10px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div style="font-weight: bold; font-size: 16px;">${this.settings?.business_name || 'Business Chat'}</div>
              <div style="font-size: 12px; opacity: 0.9;">Chat with ${this.settings?.representative_name || 'Support'}</div>
            </div>
          </div>
          <div id="business-chat-close" style="cursor: pointer; width: 30px; height: 30px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      chatMessages.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23f0f0f0\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")';
      chatMessages.style.backgroundSize = '300px 300px';
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
      chatInputArea.style.padding = '12px 16px';
      chatInputArea.style.borderTop = '1px solid #e0e0e0';
      chatInputArea.style.backgroundColor = '#f9f9f9';
      chatInputArea.innerHTML = `
        <div style="display: flex; align-items: center;">
          <input id="business-chat-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 12px; border: 1px solid #e0e0e0; border-radius: 24px; outline: none; font-size: 14px; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <button id="business-chat-send" style="margin-left: 8px; background-color: ${this.settings?.brand_color || '#3B82F6'}; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: all 0.2s ease;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div style="margin-top: 8px; text-align: center; font-size: 11px; color: #999;">
          Powered by <a href="https://widget-chat-app.netlify.app" target="_blank" style="color: ${this.settings?.brand_color || '#3B82F6'}; text-decoration: none;">Widget Chat</a>
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
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .business-chat-message {
          margin-bottom: 12px;
          max-width: 80%;
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
          line-height: 1.4;
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
      `;
      document.head.appendChild(style);
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
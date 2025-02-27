(function() {
  class BusinessChatPlugin {
    constructor(options) {
      this.options = options || {};
      this.uid = options.uid;
      this.initialized = false;
      this.messages = [];
      this.settings = null;
      this.autoReplies = [];
      
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
      // Create widget container
      const container = document.createElement('div');
      container.id = 'business-chat-widget';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
      
      // Create chat button
      const chatButton = document.createElement('div');
      chatButton.id = 'business-chat-button';
      chatButton.style.width = '60px';
      chatButton.style.height = '60px';
      chatButton.style.borderRadius = '50%';
      chatButton.style.backgroundColor = this.settings?.brand_color || '#3B82F6';
      chatButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      chatButton.style.display = 'flex';
      chatButton.style.alignItems = 'center';
      chatButton.style.justifyContent = 'center';
      chatButton.style.cursor = 'pointer';
      chatButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
      container.appendChild(chatButton);
      
      // Create chat window (initially hidden)
      const chatWindow = document.createElement('div');
      chatWindow.id = 'business-chat-window';
      chatWindow.style.position = 'absolute';
      chatWindow.style.bottom = '70px';
      chatWindow.style.right = '0';
      chatWindow.style.width = '350px';
      chatWindow.style.height = '450px';
      chatWindow.style.backgroundColor = 'white';
      chatWindow.style.borderRadius = '10px';
      chatWindow.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      chatWindow.style.display = 'none';
      chatWindow.style.flexDirection = 'column';
      chatWindow.style.overflow = 'hidden';
      container.appendChild(chatWindow);
      
      // Create chat header
      const chatHeader = document.createElement('div');
      chatHeader.style.padding = '15px';
      chatHeader.style.backgroundColor = this.settings?.brand_color || '#3B82F6';
      chatHeader.style.color = 'white';
      chatHeader.style.borderTopLeftRadius = '10px';
      chatHeader.style.borderTopRightRadius = '10px';
      chatHeader.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: bold; font-size: 16px;">${this.settings?.business_name || 'Business Chat'}</div>
            <div style="font-size: 12px; opacity: 0.8;">Chat with ${this.settings?.representative_name || 'Support'}</div>
          </div>
          <div id="business-chat-close" style="cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      chatMessages.style.padding = '15px';
      chatMessages.style.overflowY = 'auto';
      chatWindow.appendChild(chatMessages);
      
      // Add welcome message
      const welcomeMessage = document.createElement('div');
      welcomeMessage.style.backgroundColor = '#f0f0f0';
      welcomeMessage.style.borderRadius = '10px';
      welcomeMessage.style.padding = '10px';
      welcomeMessage.style.marginBottom = '10px';
      welcomeMessage.style.maxWidth = '80%';
      welcomeMessage.innerHTML = `
        <div style="font-size: 14px;">${this.settings?.business_description || 'How can we help you today?'}</div>
      `;
      chatMessages.appendChild(welcomeMessage);
      
      // Create chat input area
      const chatInputArea = document.createElement('div');
      chatInputArea.style.padding = '15px';
      chatInputArea.style.borderTop = '1px solid #e0e0e0';
      chatInputArea.innerHTML = `
        <div style="display: flex;">
          <input id="business-chat-input" type="text" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 20px; outline: none;">
          <button id="business-chat-send" style="margin-left: 10px; background-color: ${this.settings?.brand_color || '#3B82F6'}; color: white; border: none; border-radius: 20px; padding: 0 15px; cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        chatButton.style.display = 'none';
      });
      
      document.getElementById('business-chat-close').addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatButton.style.display = 'flex';
      });
      
      const chatInput = document.getElementById('business-chat-input');
      const chatSend = document.getElementById('business-chat-send');
      
      const sendMessage = () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Process auto-reply
        setTimeout(() => {
          this.processAutoReply(message);
        }, 500);
      };
      
      chatSend.addEventListener('click', sendMessage);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
    
    addMessage(text, sender) {
      const chatMessages = document.getElementById('business-chat-messages');
      const messageElement = document.createElement('div');
      
      if (sender === 'user') {
        messageElement.style.backgroundColor = '#e1f5fe';
        messageElement.style.alignSelf = 'flex-end';
        messageElement.style.marginLeft = 'auto';
      } else {
        messageElement.style.backgroundColor = '#f0f0f0';
        messageElement.style.alignSelf = 'flex-start';
        messageElement.style.marginRight = 'auto';
      }
      
      messageElement.style.borderRadius = '10px';
      messageElement.style.padding = '10px';
      messageElement.style.marginBottom = '10px';
      messageElement.style.maxWidth = '80%';
      messageElement.style.display = 'block';
      messageElement.innerHTML = `
        <div style="font-size: 14px;">${text}</div>
      `;
      
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Store message
      this.messages.push({ text, sender });
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
  }
  
  // Expose to global scope
  window.BusinessChatPlugin = BusinessChatPlugin;
})();
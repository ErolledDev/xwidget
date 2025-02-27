import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Copy } from 'lucide-react';

const InstallCode: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const installCode = `<script src="https://widget-chat-app.netlify.app/chat.js"></script>

<script>
  new BusinessChatPlugin({
    uid: '${user?.id || 'YOUR_UID'}'
  });
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Install Widget on Your Website</h2>
      
      <p className="mb-4 text-gray-600">
        Copy and paste this code snippet into your website's HTML, just before the closing <code>&lt;/body&gt;</code> tag:
      </p>
      
      <div className="relative">
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          <code>{installCode}</code>
        </pre>
        
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4" />
        </button>
        
        {copied && (
          <div className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded text-sm">
            Copied!
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">How it works</h3>
        <p className="text-blue-700">
          This widget will add a chat button to the bottom right corner of your website. When visitors click on it, they can start a conversation with your business. The widget will automatically respond based on your auto-reply settings.
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Widget Preview</h3>
        <div className="border border-gray-300 rounded-md p-6 bg-gray-50 relative">
          <div className="flex items-center justify-between bg-blue-500 text-white p-3 rounded-t-md absolute top-0 left-0 right-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <div className="font-bold">Your Business</div>
                <div className="text-xs opacity-80">Chat with Support</div>
              </div>
            </div>
            <div className="cursor-pointer w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
          
          <div className="mt-16 mb-14 min-h-[100px] max-h-[200px] overflow-y-auto p-2">
            <div className="bg-gray-200 p-3 rounded-[18px] rounded-bl-[4px] mb-2 max-w-[80%] shadow-sm">
              <p className="text-sm">How can I help you today?</p>
              <div className="text-[10px] text-gray-500 mt-1">10:30 AM</div>
            </div>
            <div className="bg-blue-500 p-3 rounded-[18px] rounded-br-[4px] mb-2 max-w-[80%] ml-auto text-white shadow-sm">
              <p className="text-sm">Do you offer free shipping?</p>
              <div className="text-[10px] text-blue-100 mt-1 text-right">10:31 AM</div>
            </div>
            <div className="bg-gray-200 p-3 rounded-[18px] rounded-bl-[4px] max-w-[80%] shadow-sm">
              <p className="text-sm">Yes, we offer free shipping on all orders over $50!</p>
              <div className="text-[10px] text-gray-500 mt-1">10:31 AM</div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white rounded-b-md">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled
              />
              <button className="bg-blue-500 text-white p-2 rounded-r-full w-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="text-center text-xs text-gray-400 mt-2">
              Powered by <span className="text-blue-500">Widget Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallCode;
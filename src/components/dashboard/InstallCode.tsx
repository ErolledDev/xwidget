import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Copy, Code, CheckCircle, ExternalLink } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Code className="h-5 w-5 mr-2 text-blue-500" />
        Install Widget on Your Website
      </h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <p className="mb-4 text-gray-600">
          Copy and paste this code snippet into your website's HTML, just before the closing <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">&lt;/body&gt;</code> tag:
        </p>
        
        <div className="relative">
          <pre className="bg-gray-900 text-white p-5 rounded-md overflow-x-auto text-sm">
            <code>{installCode}</code>
          </pre>
          
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
          <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            How it works
          </h3>
          <p className="text-blue-700">
            This widget will add a chat button to the bottom right corner of your website. When visitors click on it, they can start a conversation with your business. The widget will automatically respond based on your auto-reply settings.
          </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <ExternalLink className="h-5 w-5 mr-2 text-blue-500" />
          Implementation Guide
        </h3>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">1. Add to your HTML</h4>
            <p className="text-gray-600 text-sm">
              Place the code snippet just before the closing <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">&lt;/body&gt;</code> tag in your HTML file.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">2. Verify Installation</h4>
            <p className="text-gray-600 text-sm">
              After adding the code, refresh your website and you should see the chat button appear in the bottom right corner of your page.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">3. Test Your Widget</h4>
            <p className="text-gray-600 text-sm">
              Click on the chat button to open the widget and try sending a message to test your auto-replies.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-2">Need help?</h4>
            <p className="text-gray-600 text-sm">
              If you're having trouble implementing the widget on your website, please contact our support team for assistance.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-md h-64 border border-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center mb-4">
                  <MessageSquareIcon className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-700 font-medium">Your chat widget is ready to use!</p>
                <p className="text-gray-500 text-sm mt-2">Customize it in the Widget Settings tab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Square Icon component
const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default InstallCode;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Copy } from 'lucide-react';

const InstallCode: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const installCode = `<script src="https://widegetai.netlify.app/chat.js"></script>

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
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <p className="text-center text-gray-500 italic">
            Widget preview will be available after deployment
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallCode;
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-6">
          <MessageSquare className="h-10 w-10 text-blue-500" />
          <h1 className="text-2xl font-bold ml-2">Widget Chat</h1>
        </div>
        
        <p className="text-gray-600 mb-6 text-center">
          Add a customizable chat widget to your website in minutes.
        </p>
        
        <div className="space-y-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="w-full block text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">Easy Installation</h2>
          <div className="bg-gray-100 p-3 rounded">
            <code className="text-sm">
              {`<script src="https://widget-chat-app.netlify.app/chat.js"></script>

<script>
  new BusinessChatPlugin({
    uid: 'YOUR_UID'
  });
</script>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
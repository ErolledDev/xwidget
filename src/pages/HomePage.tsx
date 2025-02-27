import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CheckCircle, ArrowRight, Code, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Widget Chat</h1>
          </div>
          <div>
            {user ? (
              <Link 
                to="/dashboard" 
                className="btn-primary"
              >
                Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="btn-secondary"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Connect with your website visitors <span className="text-indigo-600">instantly</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Add a beautiful, customizable chat widget to your website in minutes. Engage with your visitors and provide instant support.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <Link 
                    to="/dashboard" 
                    className="btn-primary text-base px-6 py-3"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn-primary text-base px-6 py-3"
                    >
                      Start for Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn-secondary text-base px-6 py-3"
                    >
                      Login to Account
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Widget Chat</h3>
                    <p className="text-xs text-gray-500">Online now</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Hi there! How can I help you today?</p>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm text-indigo-800">I'm interested in your services.</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Great! I'd be happy to tell you more about what we offer.</p>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full z-[-1]"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-indigo-200 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to engage with your website visitors and provide excellent customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Replies</h3>
              <p className="text-gray-600">
                Set up automatic responses to common questions to provide instant support to your visitors.
              </p>
            </div>
            
            <div className="card p-6 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">
                Match your brand colors and style to create a seamless experience for your website visitors.
              </p>
            </div>
            
            <div className="card p-6 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Installation</h3>
              <p className="text-gray-600">
                Add the widget to your website with just a few lines of code. No technical expertise required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Installation</h2>
              <p className="text-lg text-gray-600 mb-6">
                Adding the chat widget to your website is as easy as copying and pasting a few lines of code.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Copy the installation code from your dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Paste it into your website's HTML before the closing body tag</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Refresh your website and see the chat widget in action</span>
                </li>
              </ul>
              {!user && (
                <Link 
                  to="/register" 
                  className="btn-primary inline-flex"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2">Installation Code</div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<script src="https://widget-chat-app.netlify.app/chat.js"></script>

<script>
  new BusinessChatPlugin({
    uid: 'YOUR_UID'
  });
</script>`}</code>
              </pre>
              <p className="mt-4 text-sm text-gray-600">
                Replace <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600">YOUR_UID</code> with your unique user ID from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <MessageCircle className="h-8 w-8 text-indigo-400" />
              <h2 className="ml-2 text-xl font-bold">Widget Chat</h2>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Widget Chat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
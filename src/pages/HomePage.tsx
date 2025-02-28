import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CheckCircle, ArrowRight, Code, Settings, MessageCircle, Bot, Sparkles, Zap, Layers, ChevronRight, Star, Users, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
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
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full opacity-50"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-indigo-100 rounded-full opacity-30"></div>
          <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-indigo-50 rounded-full opacity-70"></div>
          <div className="hidden md:block absolute top-1/4 right-1/3 w-6 h-6 bg-indigo-300 rounded-full"></div>
          <div className="hidden md:block absolute bottom-1/4 left-1/3 w-8 h-8 bg-indigo-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-block px-4 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                Engage with your visitors in real-time
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Smart chat widget with <span className="text-indigo-600 relative">
                  AI-powered
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5C32.3333 1.16667 96.6 -4.5 144 5.5C191.4 15.5 277.667 11.1667 299 5.5" stroke="#818cf8" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span> responses
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                Add a beautiful, customizable chat widget to your website in minutes. Engage with your visitors using intelligent auto-replies and AI-powered conversations.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <Link 
                    to="/dashboard" 
                    className="btn-primary text-base px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn-primary text-base px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Start for Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn-secondary text-base px-8 py-4 rounded-xl"
                    >
                      Login to Account
                    </Link>
                  </>
                )}
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                No credit card required • Free plan available
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-100 rounded-full opacity-50 animate-pulse-slow"></div>
              
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:scale-105 duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Widget Chat</h3>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <p className="text-xs text-gray-500">Online now</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Hi there! How can I help you today?</p>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm text-indigo-800">Do you offer AI-powered responses?</p>
                    <p className="text-xs text-indigo-500 mt-1">Just now</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Yes! Our AI mode can generate intelligent responses based on your business context and customer questions.</p>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm text-indigo-800">That sounds amazing!</p>
                    <p className="text-xs text-indigo-500 mt-1">Just now</p>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Quick reply buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors">
                    Pricing plans
                  </button>
                  <button className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors">
                    Features
                  </button>
                  <button className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors">
                    Contact support
                  </button>
                </div>
              </div>
              
              {/* Chat button */}
              <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                <MessageCircle className="h-8 w-8" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </div>
            </div>
          </div>
          
          {/* Trusted by section */}
          <div className="mt-20 text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Trusted by innovative companies</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              <div className="text-gray-400 font-semibold text-xl">ACME Inc.</div>
              <div className="text-gray-400 font-semibold text-xl">TechFlow</div>
              <div className="text-gray-400 font-semibold text-xl">Quantum</div>
              <div className="text-gray-400 font-semibold text-xl">Elevate</div>
              <div className="text-gray-400 font-semibold text-xl">Pinnacle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to engage visitors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Provide excellent customer support with our comprehensive set of tools designed to enhance communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Auto Replies</h3>
              <p className="text-gray-600 mb-4">
                Set up automatic responses to common questions with multiple matching options including exact, fuzzy, regex, and synonym matching.
              </p>
              <Link to="/register" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Bot className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Mode</h3>
              <p className="text-gray-600 mb-4">
                Enable AI responses for questions that don't match your auto-replies. Customize the AI with your business context for relevant answers.
              </p>
              <Link to="/register" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Layers className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Replies</h3>
              <p className="text-gray-600 mb-4">
                Create interactive buttons that provide additional information or redirect users to specific pages on your website.
              </p>
              <Link to="/register" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Additional features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Easy Setup</h4>
                <p className="text-gray-600 text-sm">Install with a simple code snippet on any website</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Customizable</h4>
                <p className="text-gray-600 text-sm">Match your brand colors and style perfectly</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Analytics</h4>
                <p className="text-gray-600 text-sm">Track conversations and visitor engagement</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">Mobile Friendly</h4>
                <p className="text-gray-600 text-sm">Works perfectly on all devices and screen sizes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Mode Highlight Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-100 rounded-full opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-4">
                AI-Powered
              </div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Intelligent Conversations</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Our AI mode takes your chat widget to the next level by providing intelligent, context-aware responses to your visitors' questions, even when you're not available.
              </p>
              <ul className="space-y-5 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <span className="text-gray-700">Customize AI with your business context for relevant responses</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <span className="text-gray-700">Choose from multiple AI models including GPT-3.5, GPT-4, and Claude</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <span className="text-gray-700">Fallback to AI when no auto-reply matches a visitor's question</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <span className="text-gray-700">Provide instant, helpful responses even when you're not available</span>
                </li>
              </ul>
              {!user && (
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Try AI Mode
                  <Zap className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 transform transition-all hover:scale-105 duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Powered by advanced AI</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-indigo-100 rounded-lg p-4 max-w-xs ml-auto">
                  <p className="text-sm text-indigo-800">Do you offer international shipping?</p>
                  <p className="text-xs text-indigo-600 mt-1">2:34 PM</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                  <p className="text-sm text-gray-800">Yes, we do offer international shipping to most countries! Shipping costs vary depending on the destination and order size. You can see the exact shipping cost at checkout. Is there a specific country you're asking about?</p>
                  <div className="flex items-center mt-2">
                    <Bot className="h-3 w-3 text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">AI-generated response</p>
                  </div>
                </div>
                
                <div className="bg-indigo-100 rounded-lg p-4 max-w-xs ml-auto">
                  <p className="text-sm text-indigo-800">What's your return policy?</p>
                  <p className="text-xs text-indigo-600 mt-1">2:36 PM</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                  <p className="text-sm text-gray-800">You can return any item within 30 days for a full refund. Just keep the original packaging. Would you like me to explain the return process in more detail?</p>
                  <div className="flex items-center mt-2">
                    <Bot className="h-3 w-3 text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">AI-generated response</p>
                  </div>
                </div>
              </div>
              
              {/* AI confidence indicator */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-600">AI confidence</p>
                  <p className="text-xs font-medium text-green-600">High (95%)</p>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-4">
                Easy Setup
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Simple Installation</h2>
              <p className="text-lg text-gray-600 mb-8">
                Adding the chat widget to your website is as easy as copying and pasting a few lines of code. No technical expertise required.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">1</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Copy the code</h4>
                    <p className="text-gray-600">Get your unique installation code from your dashboard</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Paste into your website</h4>
                    <p className="text-gray-600">Add the code to your site before the closing body tag</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">3</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">Start chatting</h4>
                    <p className="text-gray-600">Your widget is now live and ready to engage visitors</p>
                  </div>
                </div>
              </div>
              {!user && (
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Get Your Code
                  <Code className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-xl overflow-hidden relative">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-gray-400 text-sm">index.html</div>
              </div>
              <pre className="text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono bg-gray-800 border border-gray-700">
                <code>{`<script src="https://widget-chat-app.netlify.app/chat.js"></script>

<script>
  new BusinessChatPlugin({
    uid: 'YOUR_UID'
  });
</script>`}</code>
              </pre>
              
              <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 mb-2">
                  Replace <code className="bg-gray-700 px-1.5 py-0.5 rounded text-pink-400">YOUR_UID</code> with your unique user ID from the dashboard.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                  Works with any website platform
                </div>
              </div>
              
              {/* Code animation effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What our customers say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how Widget Chat has helped businesses improve customer engagement and support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "Widget Chat has transformed how we interact with our customers. The AI responses are incredibly accurate and have saved our team countless hours."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">CEO, TechFlow</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The setup was incredibly easy, and our customers love the instant responses. We've seen a 40% increase in customer satisfaction since implementing Widget Chat."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-500">CTO, Elevate</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The advanced reply feature has been a game-changer for our business. We can now provide detailed information and direct customers to the right resources instantly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500">Marketing Director, Quantum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-4">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for your business. All plans include a 14-day free trial.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600 mb-6">Perfect for small websites and personal projects</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Basic chat widget</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Up to 100 messages/month</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>5 auto-replies</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Basic customization</span>
                  </li>
                </ul>
                <Link 
                  to="/register" 
                  className="block w-full py-3 px-4 text-center bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-xl border-2 border-indigo-500 overflow-hidden shadow-lg relative transform scale-105">
              <div className="absolute top-0 left-0 right-0 bg-indigo-500 text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
              <div className="p-8 pt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-600 mb-6">Ideal for growing businesses and e-commerce</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Advanced chat widget</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Unlimited messages</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Unlimited auto-replies</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Advanced customization</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>AI-powered responses</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
                <Link 
                  to="/register" 
                  className="block w-full py-3 px-4 text-center bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large businesses with custom requirements</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Link 
                  to="/register" 
                  className="block w-full py-3 px-4 text-center bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to enhance your website with smart chat?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of businesses using Widget Chat to engage visitors and provide instant support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl font-medium text-lg shadow-md transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl font-medium text-lg shadow-md transition-colors"
                 >
                  Start for Free
                </Link>
                <Link 
                  to="/login" 
                  className="bg-indigo-700 text-white hover:bg-indigo-800 px-8 py-4 rounded-xl font-medium text-lg shadow-md transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-indigo-200 text-sm">No credit card required for free trial</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about Widget Chat.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How does the AI-powered mode work?</h3>
              <p className="text-gray-600">
                Our AI-powered mode uses advanced language models to generate intelligent responses based on your business context. When a visitor asks a question that doesn't match any of your auto-replies, the AI will generate a relevant response using the information you've provided about your business.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I customize the appearance of the chat widget?</h3>
              <p className="text-gray-600">
                Yes, you can fully customize the appearance of the chat widget to match your brand. You can change the colors, fonts, and even the position of the widget on your website. All customization options are available in the Widget Settings tab of your dashboard.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is there a limit to the number of auto-replies I can create?</h3>
              <p className="text-gray-600">
                The Free plan allows up to 5 auto-replies, while the Pro and Enterprise plans offer unlimited auto-replies. You can create auto-replies for common questions and use different matching methods including exact match, fuzzy match, regex, and synonym matching.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I install the chat widget on my website?</h3>
              <p className="text-gray-600">
                Installing the chat widget is simple. Just copy the installation code from your dashboard and paste it into your website's HTML before the closing body tag. The widget will appear immediately on your website. No technical expertise required.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I see analytics for the chat conversations?</h3>
              <p className="text-gray-600">
                Yes, the Pro and Enterprise plans include an analytics dashboard where you can see detailed information about your chat conversations, including the number of conversations, most common questions, and visitor engagement metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-6">
                <MessageCircle className="h-8 w-8 text-indigo-400" />
                <h2 className="ml-2 text-xl font-bold">Widget Chat</h2>
              </div>
              <p className="text-gray-400 mb-6">
                Add a customizable chat widget to your website in minutes. Engage with your visitors and provide instant support.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">AI Mode</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Analytics</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">API Reference</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Widget Chat. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link to="/" className="text-gray-400 hover:text-white text-sm mr-6 transition-colors">Privacy Policy</Link>
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
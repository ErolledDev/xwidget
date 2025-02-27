import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WidgetSettings from '../components/dashboard/WidgetSettings';
import AutoReply from '../components/dashboard/AutoReply';
import AdvancedReply from '../components/dashboard/AdvancedReply';
import InstallCode from '../components/dashboard/InstallCode';
import { LogOut, Settings, MessageSquare, Code, Link as LinkIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'auto-reply') return 'auto-reply';
    if (path === 'advanced-reply') return 'advanced-reply';
    if (path === 'install') return 'install';
    return 'settings';
  });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-bold">Widget Chat Dashboard</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b">
            <nav className="flex flex-wrap">
              <Link
                to="/dashboard"
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Widget Settings
              </Link>
              <Link
                to="/dashboard/auto-reply"
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'auto-reply'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('auto-reply')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Auto Reply
              </Link>
              <Link
                to="/dashboard/advanced-reply"
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'advanced-reply'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('advanced-reply')}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Advanced Reply
              </Link>
              <Link
                to="/dashboard/install"
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'install'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('install')}
              >
                <Code className="h-4 w-4 mr-2" />
                Install Code
              </Link>
            </nav>
          </div>

          <div className="p-6">
            <Routes>
              <Route path="/" element={<WidgetSettings />} />
              <Route path="/auto-reply" element={<AutoReply />} />
              <Route path="/advanced-reply" element={<AdvancedReply />} />
              <Route path="/install" element={<InstallCode />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { BarChart, ClipboardList, Clock, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <BarChart className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-indigo-100 p-4 rounded-full mb-6">
            <ClipboardList className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
          <p className="text-gray-600 max-w-lg mx-auto mb-6">
            We're working on building a comprehensive analytics dashboard to help you track and analyze your chat interactions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Calendar className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Conversation Tracking</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Clock className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Response Times</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <BarChart className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Usage Statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
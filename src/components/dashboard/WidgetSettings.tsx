import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { WidgetSettings as WidgetSettingsType } from '../../types';
import { Save, RefreshCw } from 'lucide-react';

const WidgetSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WidgetSettingsType>({
    id: '',
    user_id: user?.id || '',
    business_name: '',
    representative_name: '',
    brand_color: '#3B82F6',
    business_description: ''
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('widget_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching widget settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      // Check if settings already exist for this user
      const { data: existingData, error: fetchError } = await supabase
        .from('widget_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let saveError;
      
      if (existingData) {
        // Update existing settings
        const { error } = await supabase
          .from('widget_settings')
          .update({
            business_name: settings.business_name,
            representative_name: settings.representative_name,
            brand_color: settings.brand_color,
            business_description: settings.business_description
          })
          .eq('id', existingData.id);
          
        saveError = error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('widget_settings')
          .insert({
            user_id: user.id,
            business_name: settings.business_name,
            representative_name: settings.representative_name,
            brand_color: settings.brand_color,
            business_description: settings.business_description
          });
          
        saveError = error;
      }

      if (saveError) throw saveError;
      
      // Refresh settings after save
      fetchSettings();
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving widget settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Widget Settings</h2>
        <button
          onClick={fetchSettings}
          className="text-gray-600 hover:text-gray-900 flex items-center"
          title="Refresh settings"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={settings.business_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Business Name"
            />
            <p className="mt-1 text-xs text-gray-500">
              This will appear in the chat widget header.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Representative Name
            </label>
            <input
              type="text"
              name="representative_name"
              value={settings.representative_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Support Agent"
            />
            <p className="mt-1 text-xs text-gray-500">
              The name of the person or team responding to messages.
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              name="brand_color"
              value={settings.brand_color}
              onChange={handleInputChange}
              className="h-10 w-10 border border-gray-300 rounded-md shadow-sm cursor-pointer mr-3"
            />
            <input
              type="text"
              name="brand_color"
              value={settings.brand_color}
              onChange={handleInputChange}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="#3B82F6"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This color will be used for the chat button and header.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Welcome Message
          </label>
          <textarea
            name="business_description"
            value={settings.business_description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="How can we help you today?"
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">
            This message will be shown when a user opens the chat widget.
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Widget Preview</h3>
        
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="max-w-sm mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              {/* Chat Header */}
              <div 
                className="p-4 text-white" 
                style={{ 
                  background: `linear-gradient(135deg, ${settings.brand_color || '#3B82F6'}, ${lightenDarkenColor(settings.brand_color || '#3B82F6', 30)})`,
                  backgroundImage: `
                    radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 20%),
                    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 20%)
                  `
                }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold">{settings.business_name || 'Your Business'}</div>
                    <div className="text-sm opacity-90">Chat with {settings.representative_name || 'Support'}</div>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-4 bg-gray-50 min-h-[100px]">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none inline-block max-w-[80%] mb-2">
                  {settings.business_description || 'How can we help you today?'}
                </div>
                
                <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-none inline-block max-w-[80%] ml-auto">
                  Hello, I have a question!
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none"
                    disabled
                  />
                  <button 
                    className="ml-2 rounded-full w-10 h-10 flex items-center justify-center text-white"
                    style={{ backgroundColor: settings.brand_color || '#3B82F6' }}
                    disabled
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat Button */}
            <div className="mt-4 flex justify-end">
              <div 
                className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: settings.brand_color || '#3B82F6' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to lighten or darken a color
function lightenDarkenColor(col: string, amt: number): string {
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

export default WidgetSettings;
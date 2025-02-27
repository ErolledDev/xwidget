import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { WidgetSettings as WidgetSettingsType } from '../../types';
import { MessageSquare, User, Palette, FileText, Save } from 'lucide-react';

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
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Check if settings already exist
      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('widget_settings')
          .update({
            business_name: settings.business_name,
            representative_name: settings.representative_name,
            brand_color: settings.brand_color,
            business_description: settings.business_description
          })
          .eq('id', settings.id);
          
        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('widget_settings')
          .insert({
            user_id: user?.id,
            business_name: settings.business_name,
            representative_name: settings.representative_name,
            brand_color: settings.brand_color,
            business_description: settings.business_description
          })
          .select();
          
        if (error) throw error;
        if (data && data[0]) {
          setSettings(data[0]);
        }
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-blue-500" />
          Widget Appearance
        </h2>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                value={settings.business_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Your Business Name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                Representative Name
              </label>
              <input
                type="text"
                name="representative_name"
                value={settings.representative_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Support Agent Name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Palette className="h-4 w-4 mr-1 text-gray-500" />
                Brand Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  name="brand_color"
                  value={settings.brand_color}
                  onChange={handleChange}
                  className="h-12 w-12 border border-gray-300 rounded-l-md mr-0 cursor-pointer"
                />
                <input
                  type="text"
                  name="brand_color"
                  value={settings.brand_color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FileText className="h-4 w-4 mr-1 text-gray-500" />
                Welcome Message
              </label>
              <textarea
                name="business_description"
                value={settings.business_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="How can we help you today?"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Widget Preview
        </h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[600px] relative overflow-hidden">
          <div className="absolute bottom-6 right-6">
            {/* Chat Button */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
              style={{ 
                backgroundColor: settings.brand_color || '#3B82F6',
                boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2), 0 0 0 0 ${settings.brand_color}40`
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                1
              </div>
            </div>
          </div>
          
          {/* Chat Window */}
          <div className="absolute bottom-24 right-6 w-80 rounded-xl shadow-2xl overflow-hidden border border-gray-200 bg-white">
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
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-base">{settings.business_name || 'Your Business'}</div>
                    <div className="text-xs opacity-90">Chat with {settings.representative_name || 'Support'}</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-64 p-4 overflow-y-auto bg-gray-50">
              {/* Bot Message */}
              <div className="mb-4 max-w-[85%]">
                <div className="bg-gray-200 p-3 rounded-[18px] rounded-bl-[4px] text-gray-800 text-sm shadow-sm">
                  {settings.business_description || 'How can we help you today?'}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 ml-1">10:30 AM</div>
              </div>
              
              {/* User Message */}
              <div className="mb-4 max-w-[85%] ml-auto">
                <div 
                  className="p-3 rounded-[18px] rounded-br-[4px] text-white text-sm shadow-sm"
                  style={{ backgroundColor: settings.brand_color || '#3B82F6' }}
                >
                  Hello, I have a question about your services.
                </div>
                <div className="text-[10px] text-gray-500 mt-1 mr-1 text-right">10:31 AM</div>
              </div>
              
              {/* Bot Message */}
              <div className="max-w-[85%]">
                <div className="bg-gray-200 p-3 rounded-[18px] rounded-bl-[4px] text-gray-800 text-sm shadow-sm">
                  I'd be happy to help! What would you like to know about our services?
                </div>
                <div className="text-[10px] text-gray-500 mt-1 ml-1">10:32 AM</div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled
                />
                <button 
                  className="text-white p-3 rounded-r-full w-12 flex items-center justify-center"
                  style={{ backgroundColor: settings.brand_color || '#3B82F6' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <div className="text-center text-xs text-gray-400 mt-2">
                Powered by <span style={{ color: settings.brand_color || '#3B82F6' }}>Widget Chat</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-6 left-0 right-0 text-center text-gray-500 text-sm">
            This is how your chat widget will appear on your website
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to lighten/darken color
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
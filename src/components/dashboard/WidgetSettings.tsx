import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { WidgetSettings as WidgetSettingsType } from '../../types';
import { Save, RefreshCw, Settings as SettingsIcon, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const WidgetSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<WidgetSettingsType>({
    id: '',
    user_id: user?.id || '',
    business_name: '',
    representative_name: '',
    brand_color: '#4f46e5',
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
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving widget settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <SettingsIcon className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Widget Settings</h2>
        </div>
        <button
          onClick={fetchSettings}
          className="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          title="Refresh settings"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-700 font-medium">Settings saved successfully!</p>
            <p className="text-xs text-green-600 mt-1">Your widget has been updated with the new settings.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="form-label">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={settings.business_name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Your Business Name"
            />
            <p className="mt-1 text-xs text-gray-500">
              This will appear in the chat widget header.
            </p>
          </div>
          
          <div>
            <label className="form-label">
              Representative Name
            </label>
            <input
              type="text"
              name="representative_name"
              value={settings.representative_name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Support Agent"
            />
            <p className="mt-1 text-xs text-gray-500">
              The name of the person or team responding to messages.
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="form-label">
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
              className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="#4f46e5"
            />
            <div className="ml-4 flex space-x-2">
              {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                <button
                  key={color}
                  onClick={() => setSettings(prev => ({ ...prev, brand_color: color }))}
                  className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  style={{ backgroundColor: color }}
                  title={color}
                ></button>
              ))}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This color will be used for the chat button and header.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="form-label">
            Welcome Message
          </label>
          <textarea
            name="business_description"
            value={settings.business_description}
            onChange={handleInputChange}
            rows={3}
            className="form-input"
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
            className="btn-primary"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Preview section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Widget Preview</h3>
        <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="p-4" style={{ backgroundColor: settings.brand_color || '#4f46e5' }}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-white">{settings.business_name || 'Your Business'}</h3>
                    <p className="text-xs text-white/80">Chat with {settings.representative_name || 'Support'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-3">
                  <p className="text-sm text-gray-800">{settings.business_description || 'How can we help you today?'}</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled
                  />
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full"
                    style={{ backgroundColor: settings.brand_color || '#4f46e5' }}
                    disabled
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <div 
                className="w-12 h-12 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: settings.brand_color || '#4f46e5' }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettings;
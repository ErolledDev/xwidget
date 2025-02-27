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
    </div>
  );
};

export default WidgetSettings;
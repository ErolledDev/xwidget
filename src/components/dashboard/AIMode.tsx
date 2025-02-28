import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Save, Bot, AlertCircle, ToggleLeft, ToggleRight, Key, Info, Sparkles } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const AIMode: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { aiSettings, loading, setAISettings } = useData();
  
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    id: '',
    user_id: user?.id || '',
    enabled: false,
    api_key: '',
    model: 'gpt-3.5-turbo',
    business_context: ''
  });

  // Update local state when aiSettings changes
  useEffect(() => {
    if (aiSettings) {
      setLocalSettings(aiSettings);
    }
  }, [aiSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setLocalSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      // Check if settings already exist for this user
      const { data: existingData, error: fetchError } = await supabase
        .from('ai_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let saveError;
      let savedData;
      
      if (existingData) {
        // Update existing settings
        const { data, error } = await supabase
          .from('ai_settings')
          .update({
            enabled: localSettings.enabled,
            api_key: localSettings.api_key,
            model: localSettings.model,
            business_context: localSettings.business_context
          })
          .eq('id', existingData.id)
          .select();
          
        saveError = error;
        savedData = data;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('ai_settings')
          .insert({
            user_id: user.id,
            enabled: localSettings.enabled,
            api_key: localSettings.api_key,
            model: localSettings.model,
            business_context: localSettings.business_context
          })
          .select();
          
        saveError = error;
        savedData = data;
      }

      if (saveError) throw saveError;
      
      // Update local state directly instead of refreshing
      if (savedData && savedData[0]) {
        setAISettings(savedData[0]);
      }
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'AI Settings Saved',
        message: 'Your AI settings have been updated successfully.'
      });
    } catch (error: any) {
      console.error('Error saving AI settings:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save AI settings. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading.aiSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading AI settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">AI Mode Settings</h2>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">AI-Powered Responses</h3>
          </div>
          <button
            onClick={handleToggleChange}
            className="flex items-center focus:outline-none"
            aria-pressed={localSettings.enabled}
            role="switch"
          >
            <span className="mr-2 text-sm font-medium text-gray-700">
              {localSettings.enabled ? 'Enabled' : 'Disabled'}
            </span>
            {localSettings.enabled ? (
              <ToggleRight className="h-6 w-6 text-indigo-600" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md mb-6">
          <div className="flex">
            <Info className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-700">
                When AI Mode is enabled, the widget will use AI to generate responses for messages that don't match any of your auto-replies.
              </p>
              <p className="text-sm text-indigo-700 mt-1">
                If disabled, the default message "Thank you for your message. We'll get back to you as soon as possible." will be shown instead.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="form-label flex items-center">
            <Key className="h-4 w-4 mr-2 text-gray-500" />
            API Key
          </label>
          <input
            type="password"
            name="api_key"
            value={localSettings.api_key}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your API key"
            disabled={!localSettings.enabled}
          />
          <p className="mt-1 text-xs text-gray-500">
            Your API key is stored securely and never shared with third parties.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="form-label">
            AI Model
          </label>
          <select
            name="model"
            value={localSettings.model}
            onChange={handleInputChange}
            className="form-input"
            disabled={!localSettings.enabled}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="claude-3-haiku">Claude 3 Haiku</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="custom">Custom Model</option>
          </select>
          {localSettings.model === 'custom' && (
            <input
              type="text"
              name="model"
              value={localSettings.model === 'custom' ? '' : localSettings.model}
              onChange={handleInputChange}
              className="form-input mt-2"
              placeholder="Enter custom model name"
              disabled={!localSettings.enabled}
            />
          )}
          <p className="mt-1 text-xs text-gray-500">
            Select the AI model you want to use for generating responses.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="form-label">
            Business Context
          </label>
          <textarea
            name="business_context"
            value={localSettings.business_context}
            onChange={handleInputChange}
            rows={5}
            className="form-input"
            placeholder="Provide information about your business, products, services, and how you want the AI to respond to customers..."
            disabled={!localSettings.enabled}
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">
            This information will be used to help the AI generate more accurate and relevant responses for your customers.
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
                Save AI Settings
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Example AI responses section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 text-gray-900">How AI Mode Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              Without AI Mode
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700">Hi, do you offer international shipping?</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-700">Thank you for your message. We'll get back to you as soon as possible.</p>
              <p className="text-xs text-gray-500 mt-1">Default response when no auto-reply matches</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
              With AI Mode
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700">Hi, do you offer international shipping?</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-sm text-indigo-700">Yes, we do offer international shipping to most countries! Shipping costs vary depending on the destination and order size. You can see the exact shipping cost at checkout. Is there a specific country you're asking about?</p>
              <p className="text-xs text-indigo-500 mt-1">AI-generated response based on your business context</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMode;
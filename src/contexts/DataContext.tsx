import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { WidgetSettings, AutoReply, AdvancedReply, AISettings } from '../types';

interface DataContextType {
  widgetSettings: WidgetSettings | null;
  autoReplies: AutoReply[];
  advancedReplies: AdvancedReply[];
  aiSettings: AISettings | null;
  loading: {
    widgetSettings: boolean;
    autoReplies: boolean;
    advancedReplies: boolean;
    aiSettings: boolean;
  };
  error: {
    widgetSettings: string | null;
    autoReplies: string | null;
    advancedReplies: string | null;
    aiSettings: string | null;
  };
  refreshWidgetSettings: () => Promise<void>;
  refreshAutoReplies: () => Promise<void>;
  refreshAdvancedReplies: () => Promise<void>;
  refreshAISettings: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  widgetSettings: null,
  autoReplies: [],
  advancedReplies: [],
  aiSettings: null,
  loading: {
    widgetSettings: false,
    autoReplies: false,
    advancedReplies: false,
    aiSettings: false,
  },
  error: {
    widgetSettings: null,
    autoReplies: null,
    advancedReplies: null,
    aiSettings: null,
  },
  refreshWidgetSettings: async () => {},
  refreshAutoReplies: async () => {},
  refreshAdvancedReplies: async () => {},
  refreshAISettings: async () => {},
  refreshAllData: async () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // State for data
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings | null>(null);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [advancedReplies, setAdvancedReplies] = useState<AdvancedReply[]>([]);
  const [aiSettings, setAISettings] = useState<AISettings | null>(null);
  
  // State for loading status
  const [loading, setLoading] = useState({
    widgetSettings: false,
    autoReplies: false,
    advancedReplies: false,
    aiSettings: false,
  });
  
  // State for error messages
  const [error, setError] = useState({
    widgetSettings: null as string | null,
    autoReplies: null as string | null,
    advancedReplies: null as string | null,
    aiSettings: null as string | null,
  });

  // Fetch widget settings
  const fetchWidgetSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, widgetSettings: true }));
      setError(prev => ({ ...prev, widgetSettings: null }));
      
      const { data, error: fetchError } = await supabase
        .from('widget_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setWidgetSettings(data);
      } else {
        // Set default values if no data exists
        setWidgetSettings({
          id: '',
          user_id: user.id,
          business_name: '',
          representative_name: '',
          brand_color: '#4f46e5',
          business_description: ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching widget settings:', err);
      setError(prev => ({ ...prev, widgetSettings: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, widgetSettings: false }));
    }
  };

  // Fetch auto replies
  const fetchAutoReplies = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, autoReplies: true }));
      setError(prev => ({ ...prev, autoReplies: null }));
      
      const { data, error: fetchError } = await supabase
        .from('auto_replies')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      
      setAutoReplies(data || []);
    } catch (err: any) {
      console.error('Error fetching auto replies:', err);
      setError(prev => ({ ...prev, autoReplies: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, autoReplies: false }));
    }
  };

  // Fetch advanced replies
  const fetchAdvancedReplies = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, advancedReplies: true }));
      setError(prev => ({ ...prev, advancedReplies: null }));
      
      const { data, error: fetchError } = await supabase
        .from('advanced_replies')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      
      setAdvancedReplies(data || []);
    } catch (err: any) {
      console.error('Error fetching advanced replies:', err);
      setError(prev => ({ ...prev, advancedReplies: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, advancedReplies: false }));
    }
  };

  // Fetch AI settings
  const fetchAISettings = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, aiSettings: true }));
      setError(prev => ({ ...prev, aiSettings: null }));
      
      const { data, error: fetchError } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setAISettings(data);
      } else {
        // Set default values if no data exists
        setAISettings({
          id: '',
          user_id: user.id,
          enabled: false,
          api_key: '',
          model: 'gpt-3.5-turbo',
          business_context: ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching AI settings:', err);
      setError(prev => ({ ...prev, aiSettings: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, aiSettings: false }));
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      fetchWidgetSettings(),
      fetchAutoReplies(),
      fetchAdvancedReplies(),
      fetchAISettings()
    ]);
  };

  // Initial data fetch when user changes
  useEffect(() => {
    if (user) {
      refreshAllData();
    } else {
      // Reset data when user logs out
      setWidgetSettings(null);
      setAutoReplies([]);
      setAdvancedReplies([]);
      setAISettings(null);
    }
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        widgetSettings,
        autoReplies,
        advancedReplies,
        aiSettings,
        loading,
        error,
        refreshWidgetSettings: fetchWidgetSettings,
        refreshAutoReplies: fetchAutoReplies,
        refreshAdvancedReplies: fetchAdvancedReplies,
        refreshAISettings: fetchAISettings,
        refreshAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
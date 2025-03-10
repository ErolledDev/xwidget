import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
  setWidgetSettings: (settings: WidgetSettings) => void;
  setAutoReplies: (replies: AutoReply[]) => void;
  setAdvancedReplies: (replies: AdvancedReply[]) => void;
  setAISettings: (settings: AISettings) => void;
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
  setWidgetSettings: () => {},
  setAutoReplies: () => {},
  setAdvancedReplies: () => {},
  setAISettings: () => {},
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

  // State to track if data has been loaded
  const dataLoaded = useRef({
    widgetSettings: false,
    autoReplies: false,
    advancedReplies: false,
    aiSettings: false,
  });

  // Use refs to prevent unnecessary API calls
  const fetchInProgress = useRef({
    widgetSettings: false,
    autoReplies: false,
    advancedReplies: false,
    aiSettings: false,
  });

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Fetch widget settings
  const fetchWidgetSettings = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.current.widgetSettings && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.widgetSettings) return;
    
    try {
      fetchInProgress.current.widgetSettings = true;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, widgetSettings: true }));
        setError(prev => ({ ...prev, widgetSettings: null }));
      }
      
      const { data, error: fetchError } = await supabase
        .from('widget_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (isMounted.current) {
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
        
        // Mark as loaded
        dataLoaded.current.widgetSettings = true;
      }
    } catch (err: any) {
      console.error('Error fetching widget settings:', err);
      if (isMounted.current) {
        setError(prev => ({ ...prev, widgetSettings: err.message }));
      }
    } finally {
      fetchInProgress.current.widgetSettings = false;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, widgetSettings: false }));
      }
    }
  };

  // Fetch auto replies
  const fetchAutoReplies = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.current.autoReplies && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.autoReplies) return;
    
    try {
      fetchInProgress.current.autoReplies = true;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, autoReplies: true }));
        setError(prev => ({ ...prev, autoReplies: null }));
      }
      
      const { data, error: fetchError } = await supabase
        .from('auto_replies')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      
      if (isMounted.current) {
        setAutoReplies(data || []);
        
        // Mark as loaded
        dataLoaded.current.autoReplies = true;
      }
    } catch (err: any) {
      console.error('Error fetching auto replies:', err);
      if (isMounted.current) {
        setError(prev => ({ ...prev, autoReplies: err.message }));
      }
    } finally {
      fetchInProgress.current.autoReplies = false;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, autoReplies: false }));
      }
    }
  };

  // Fetch advanced replies
  const fetchAdvancedReplies = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.current.advancedReplies && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.advancedReplies) return;
    
    try {
      fetchInProgress.current.advancedReplies = true;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, advancedReplies: true }));
        setError(prev => ({ ...prev, advancedReplies: null }));
      }
      
      const { data, error: fetchError } = await supabase
        .from('advanced_replies')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      
      if (isMounted.current) {
        setAdvancedReplies(data || []);
        
        // Mark as loaded
        dataLoaded.current.advancedReplies = true;
      }
    } catch (err: any) {
      console.error('Error fetching advanced replies:', err);
      if (isMounted.current) {
        setError(prev => ({ ...prev, advancedReplies: err.message }));
      }
    } finally {
      fetchInProgress.current.advancedReplies = false;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, advancedReplies: false }));
      }
    }
  };

  // Fetch AI settings
  const fetchAISettings = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.current.aiSettings && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.aiSettings) return;
    
    try {
      fetchInProgress.current.aiSettings = true;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, aiSettings: true }));
        setError(prev => ({ ...prev, aiSettings: null }));
      }
      
      const { data, error: fetchError } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (isMounted.current) {
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
        
        // Mark as loaded
        dataLoaded.current.aiSettings = true;
      }
    } catch (err: any) {
      console.error('Error fetching AI settings:', err);
      if (isMounted.current) {
        setError(prev => ({ ...prev, aiSettings: err.message }));
      }
    } finally {
      fetchInProgress.current.aiSettings = false;
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, aiSettings: false }));
      }
    }
  };

  // Force refresh widget settings (for when user updates them)
  const refreshWidgetSettings = async () => {
    if (!user) return;
    await fetchWidgetSettings(true);
  };

  // Force refresh auto replies
  const refreshAutoReplies = async () => {
    if (!user) return;
    await fetchAutoReplies(true);
  };

  // Force refresh advanced replies
  const refreshAdvancedReplies = async () => {
    if (!user) return;
    await fetchAdvancedReplies(true);
  };

  // Force refresh AI settings
  const refreshAISettings = async () => {
    if (!user) return;
    await fetchAISettings(true);
  };

  // Refresh all data
  const refreshAllData = async () => {
    if (!user) return;
    
    // Use Promise.all to fetch data in parallel
    await Promise.all([
      fetchWidgetSettings(true),
      fetchAutoReplies(true),
      fetchAdvancedReplies(true),
      fetchAISettings(true)
    ]);
  };

  // Initial data fetch when user changes
  useEffect(() => {
    if (user) {
      // Reset data loaded state when user changes
      dataLoaded.current = {
        widgetSettings: false,
        autoReplies: false,
        advancedReplies: false,
        aiSettings: false,
      };
      
      // Fetch all data
      fetchWidgetSettings();
      fetchAutoReplies();
      fetchAdvancedReplies();
      fetchAISettings();
    } else {
      // Reset data when user logs out
      setWidgetSettings(null);
      setAutoReplies([]);
      setAdvancedReplies([]);
      setAISettings(null);
      
      // Reset data loaded state
      dataLoaded.current = {
        widgetSettings: false,
        autoReplies: false,
        advancedReplies: false,
        aiSettings: false,
      };
    }
  }, [user]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        widgetSettings,
        autoReplies,
        advancedReplies,
        aiSettings,
        loading,
        error,
        setWidgetSettings,
        setAutoReplies,
        setAdvancedReplies,
        setAISettings,
        refreshWidgetSettings,
        refreshAutoReplies,
        refreshAdvancedReplies,
        refreshAISettings,
        refreshAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
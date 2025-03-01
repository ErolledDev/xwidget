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
  const [dataLoaded, setDataLoaded] = useState({
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

  // Cache timeout (in milliseconds) - 5 minutes
  const CACHE_TIMEOUT = 5 * 60 * 1000;
  
  // Last fetch timestamp
  const lastFetchTime = useRef({
    widgetSettings: 0,
    autoReplies: 0,
    advancedReplies: 0,
    aiSettings: 0,
  });

  // Fetch widget settings
  const fetchWidgetSettings = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.widgetSettings && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.widgetSettings) return;
    
    // Check cache timeout
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current.widgetSettings < CACHE_TIMEOUT) return;
    
    try {
      fetchInProgress.current.widgetSettings = true;
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
      
      // Mark as loaded and update timestamp
      setDataLoaded(prev => ({ ...prev, widgetSettings: true }));
      lastFetchTime.current.widgetSettings = now;
    } catch (err: any) {
      console.error('Error fetching widget settings:', err);
      setError(prev => ({ ...prev, widgetSettings: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, widgetSettings: false }));
      fetchInProgress.current.widgetSettings = false;
    }
  };

  // Fetch auto replies
  const fetchAutoReplies = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.autoReplies && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.autoReplies) return;
    
    // Check cache timeout
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current.autoReplies < CACHE_TIMEOUT) return;
    
    try {
      fetchInProgress.current.autoReplies = true;
      setLoading(prev => ({ ...prev, autoReplies: true }));
      setError(prev => ({ ...prev, autoReplies: null }));
      
      const { data, error: fetchError } = await supabase
        .from('auto_replies')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      
      setAutoReplies(data || []);
      
      // Mark as loaded and update timestamp
      setDataLoaded(prev => ({ ...prev, autoReplies: true }));
      lastFetchTime.current.autoReplies = now;
    } catch (err: any) {
      console.error('Error fetching auto replies:', err);
      setError(prev => ({ ...prev, autoReplies: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, autoReplies: false }));
      fetchInProgress.current.autoReplies = false;
    }
  };

  // Fetch advanced replies
  const fetchAdvancedReplies = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.advancedReplies && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.advancedReplies) return;
    
    // Check cache timeout
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current.advancedReplies < CACHE_TIMEOUT) return;
    
    try {
      fetchInProgress.current.advancedReplies = true;
      setLoading(prev => ({ ...prev, advancedReplies: true }));
      setError(prev => ({ ...prev, advancedReplies: null }));
      
      const { data, error: fetchError } = await supabase
        .from('advanced_replies')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      
      setAdvancedReplies(data || []);
      
      // Mark as loaded and update timestamp
      setDataLoaded(prev => ({ ...prev, advancedReplies: true }));
      lastFetchTime.current.advancedReplies = now;
    } catch (err: any) {
      console.error('Error fetching advanced replies:', err);
      setError(prev => ({ ...prev, advancedReplies: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, advancedReplies: false }));
      fetchInProgress.current.advancedReplies = false;
    }
  };

  // Fetch AI settings
  const fetchAISettings = async (forceRefresh = false) => {
    if (!user) return;
    
    // Skip if already loaded and not forcing refresh
    if (dataLoaded.aiSettings && !forceRefresh) return;
    
    // Skip if fetch is already in progress
    if (fetchInProgress.current.aiSettings) return;
    
    // Check cache timeout
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current.aiSettings < CACHE_TIMEOUT) return;
    
    try {
      fetchInProgress.current.aiSettings = true;
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
      
      // Mark as loaded and update timestamp
      setDataLoaded(prev => ({ ...prev, aiSettings: true }));
      lastFetchTime.current.aiSettings = now;
    } catch (err: any) {
      console.error('Error fetching AI settings:', err);
      setError(prev => ({ ...prev, aiSettings: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, aiSettings: false }));
      fetchInProgress.current.aiSettings = false;
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
      setDataLoaded({
        widgetSettings: false,
        autoReplies: false,
        advancedReplies: false,
        aiSettings: false,
      });
      
      // Reset fetch timestamps
      lastFetchTime.current = {
        widgetSettings: 0,
        autoReplies: 0,
        advancedReplies: 0,
        aiSettings: 0,
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
      setDataLoaded({
        widgetSettings: false,
        autoReplies: false,
        advancedReplies: false,
        aiSettings: false,
      });
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
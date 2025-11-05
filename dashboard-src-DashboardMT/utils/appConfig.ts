// Application configuration and settings management

export interface Language {
  code: string;
  name: string;
  enabled: boolean;
}

export interface Location {
  id: string;
  name: string;
  enabled: boolean;
}

export interface APIConfiguration {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  enabled: boolean;
  description: string;
}

export interface CustomEmotion {
  id: string;
  name: string;
  l1Category: 'high_energy_pleasant' | 'high_energy_unpleasant' | 'low_energy_unpleasant' | 'low_energy_pleasant';
  translations: Record<string, string>; // languageCode -> translated name
}

export interface AppConfig {
  languages: Language[];
  locations: Location[];
  apiConfigurations: APIConfiguration[];
  customEmotions: CustomEmotion[];
  defaultLanguage: string;
}

// Default configuration
export const DEFAULT_CONFIG: AppConfig = {
  languages: [
    { code: 'en', name: 'English', enabled: true },
    { code: 'es', name: 'Spanish', enabled: true },
    { code: 'fr', name: 'French', enabled: false },
    { code: 'de', name: 'German', enabled: false },
    { code: 'zh', name: 'Chinese', enabled: false },
    { code: 'ja', name: 'Japanese', enabled: false },
    { code: 'ar', name: 'Arabic', enabled: false },
  ],
  locations: [
    { id: '1', name: 'Main Building - Entrance', enabled: true },
    { id: '2', name: 'Library - 2nd Floor', enabled: true },
    { id: '3', name: 'Cafeteria', enabled: true },
    { id: '4', name: 'Student Center', enabled: false },
    { id: '5', name: 'Gymnasium', enabled: false },
  ],
  apiConfigurations: [
    {
      id: '1',
      name: 'Analytics API',
      endpoint: 'https://api.example.com/analytics',
      apiKey: 'YOUR_API_KEY_HERE',
      enabled: false,
      description: 'External analytics and reporting service'
    },
    {
      id: '2',
      name: 'Data Export API',
      endpoint: 'https://api.example.com/export',
      apiKey: 'YOUR_API_KEY_HERE',
      enabled: false,
      description: 'Automated data export to external systems'
    },
  ],
  customEmotions: [],
  defaultLanguage: 'en'
};

// Local storage key
const CONFIG_KEY = 'moodmeter_app_config';

// Load configuration from localStorage
export function loadConfig(): AppConfig {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return DEFAULT_CONFIG;
}

// Save configuration to localStorage
export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

// Helper functions
export function getEnabledLanguages(config: AppConfig): Language[] {
  return config.languages.filter(lang => lang.enabled);
}

export function getEnabledLocations(config: AppConfig): Location[] {
  return config.locations.filter(loc => loc.enabled);
}

export function getEnabledAPIs(config: AppConfig): APIConfiguration[] {
  return config.apiConfigurations.filter(api => api.enabled);
}

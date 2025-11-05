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
  correlationMetrics: string[];
  dataType: 'weather' | 'air_quality' | 'school_events' | 'academic' | 'social' | 'custom';
}

// Predefined correlation metrics for different data types
export const CORRELATION_METRICS = {
  weather: [
    'Temperature vs Mood Intensity',
    'Humidity vs Energy Levels',
    'Precipitation vs Mood Category',
    'Barometric Pressure vs Response Time',
    'UV Index vs Pleasant/Unpleasant Ratio',
    'Wind Speed vs Emotional Stability'
  ],
  air_quality: [
    'PM2.5 vs Mood Intensity',
    'Air Quality Index vs Mood Category',
    'Ozone Levels vs Energy Levels',
    'PM10 vs Response Time',
    'Air Quality vs Pleasant/Unpleasant Ratio',
    'Pollution vs Emotional Clarity'
  ],
  school_events: [
    'Event Type vs Mood Distribution',
    'Event Timing vs Energy Levels',
    'Event Duration vs Response Time',
    'Event Participation vs Mood Intensity',
    'Special Activities vs Pleasant Emotions',
    'Testing Periods vs Stress Levels'
  ],
  academic: [
    'Grade Performance vs Mood Trends',
    'Assignment Load vs Stress Levels',
    'Test Scores vs Emotional State',
    'Homework Time vs Energy Levels',
    'Academic Achievement vs Confidence',
    'Study Hours vs Mood Stability'
  ],
  social: [
    'Social Events vs Mood Positivity',
    'Peer Interactions vs Energy Levels',
    'Group Activities vs Emotional Expression',
    'Social Media Usage vs Mood Patterns',
    'Friendship Networks vs Emotional Support',
    'Community Engagement vs Well-being'
  ],
  custom: [
    'Custom Metric vs Mood Intensity',
    'Custom Metric vs Energy Levels',
    'Custom Metric vs Mood Category',
    'Custom Metric vs Response Time',
    'Custom Metric vs Pleasant/Unpleasant Ratio',
    'Custom Metric vs Emotional Patterns'
  ]
} as const;

// Predefined API templates for quick setup
export const API_TEMPLATES = {
  purpleair: {
    name: 'PurpleAir Air Quality',
    endpoint: 'https://api.purpleair.com/v1/sensors',
    description: 'Real-time air quality data from PurpleAir sensors. Requires API key from develop.purpleair.com',
    dataType: 'air_quality' as const,
    suggestedMetrics: ['PM2.5 vs Mood Intensity', 'Air Quality Index vs Mood Category', 'Ozone Levels vs Energy Levels']
  },
  openweather: {
    name: 'OpenWeatherMap',
    endpoint: 'https://api.openweathermap.org/data/2.5/weather',
    description: 'Comprehensive weather data including temperature, humidity, and atmospheric pressure',
    dataType: 'weather' as const,
    suggestedMetrics: ['Temperature vs Mood Intensity', 'Humidity vs Energy Levels', 'Barometric Pressure vs Response Time']
  },
  weatherapi: {
    name: 'WeatherAPI.com',
    endpoint: 'https://api.weatherapi.com/v1/current.json',
    description: 'Real-time weather conditions and forecasts',
    dataType: 'weather' as const,
    suggestedMetrics: ['Temperature vs Mood Intensity', 'UV Index vs Pleasant/Unpleasant Ratio', 'Wind Speed vs Emotional Stability']
  },
  google_calendar: {
    name: 'Google Calendar',
    endpoint: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    description: 'School events and calendar data from Google Calendar',
    dataType: 'school_events' as const,
    suggestedMetrics: ['Event Type vs Mood Distribution', 'Event Duration vs Response Time', 'Special Activities vs Pleasant Emotions']
  }
} as const;

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
      name: 'PurpleAir API',
      endpoint: 'https://api.purpleair.com/v1/sensors',
      apiKey: 'YOUR_PURPLEAIR_API_KEY',
      enabled: false,
      description: 'Real-time air quality data from PurpleAir sensors',
      correlationMetrics: ['PM2.5 vs Mood Intensity', 'Air Quality Index vs Mood Category', 'Pollution vs Emotional Clarity'],
      dataType: 'air_quality' as const
    },
    {
      id: '2',
      name: 'OpenWeatherMap API',
      endpoint: 'https://api.openweathermap.org/data/2.5/weather',
      apiKey: 'YOUR_OPENWEATHER_API_KEY',
      enabled: false,
      description: 'Weather data for correlation with mood patterns',
      correlationMetrics: ['Temperature vs Mood Intensity', 'Humidity vs Energy Levels', 'Precipitation vs Mood Category'],
      dataType: 'weather' as const
    },
    {
      id: '3',
      name: 'School Events API',
      endpoint: 'https://school.example.com/api/events',
      apiKey: 'YOUR_SCHOOL_API_KEY',
      enabled: false,
      description: 'School calendar and events data',
      correlationMetrics: ['Event Type vs Mood Distribution', 'Event Timing vs Energy Levels', 'Testing Periods vs Stress Levels'],
      dataType: 'school_events' as const
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

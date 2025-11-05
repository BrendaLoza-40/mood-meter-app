# MoodMeter Admin & Settings Features

## Overview
The MoodMeter dashboard now includes comprehensive admin controls and user settings for managing emotions, languages, locations, and API integrations.

## Admin Settings

Access the Admin Settings panel via the **Admin** button in the top-right corner of the dashboard.

### 1. Custom Emotions Management
- **Add L2 Emotions**: Create new emotions and assign them to any L1 category
- **Remove Emotions**: Delete custom emotions as needed
- **Multi-language Support**: Custom emotions can be translated into multiple languages

### 2. Language Management
- **Add Languages**: Add support for unlimited languages with custom language codes
- **Enable/Disable**: Toggle languages on or off without deleting them
- **Default Language**: Set the default language for the dashboard (protected from deletion)
- **Built-in Languages**: English, Spanish, French, German, Chinese, Japanese, Arabic

### 3. Location Management
- **Add Kiosk Locations**: Create locations for mood meter kiosks throughout your facility
- **Enable/Disable**: Toggle locations without removing them
- **Location Tracking**: All mood entries track which kiosk was used
- **Examples**: Main Building Entrance, Library 2nd Floor, Cafeteria, Student Center, Gymnasium

### 4. API Configuration
- **Add API Integrations**: Configure external APIs for data export and analytics
- **Endpoint Management**: Set API endpoints and authentication keys
- **Enable/Disable**: Activate or deactivate APIs without losing configuration
- **Security**: API keys are stored securely and can be password-masked
- **Description**: Add notes about what each API is used for

### Saving Changes
All admin settings are persisted to browser localStorage. Click **Save All Changes** to commit your modifications.

## Dashboard Settings

Access dashboard preferences via the **Settings** button in the top-right corner.

### User Preferences

1. **Language Selection**
   - Choose your preferred dashboard language
   - Only enabled languages appear in the selection
   - Real-time language switching (framework ready)

2. **Location Filter**
   - Filter mood data by specific kiosk location
   - Select "All Locations" to view aggregate data
   - Location filter applies to all charts and statistics

## New Analytics Features

### Theme Preference Tracking
- **Automatic Tracking**: Every mood entry records whether the student used light or dark theme
- **Visual Analytics**: Pie chart showing theme preference distribution
- **Statistics**: View counts and percentages for each theme choice
- **Insight**: Understand student interface preferences

### Location Analytics
- **Distribution Chart**: Bar chart showing check-ins by location
- **Location Comparison**: See which kiosks are most used
- **Color-coded**: Each location has a unique color for easy identification
- **Detailed Stats**: Click on any location for full metrics

## Data Structure Enhancements

### Enhanced MoodEntry
Each mood entry now includes:
- `themePreference`: 'light' | 'dark' - Theme selected by student
- `locationId`: string - Kiosk location identifier

### Configuration Storage
- **localStorage Key**: `moodmeter_app_config`
- **Automatic Loading**: Configuration loads on app startup
- **Real-time Updates**: Settings refresh every second to catch admin changes
- **Backup Ready**: Export configuration as JSON for backup/transfer

## Multi-Language Framework

### Translation System
- L1 categories have translations in all supported languages
- L2 emotions can be translated (framework in place)
- Custom emotions support translations via `translations` property
- Language utilities in `/utils/emotionTranslations.ts`

### Adding Translations
```typescript
const customEmotion: CustomEmotion = {
  id: '123',
  name: 'Overwhelmed',
  l1Category: 'high_energy_unpleasant',
  translations: {
    es: 'Abrumado',
    fr: 'Débordé',
    de: 'Überfordert'
  }
};
```

## API Integration Examples

### Analytics API
```javascript
// Send mood data to external analytics service
const response = await fetch(apiConfig.endpoint, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiConfig.apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(moodData)
});
```

### Export API
```javascript
// Automated export to student information system
const exportData = {
  date: new Date(),
  aggregatedStats: stats,
  rawData: moodEntries
};
```

## Privacy & Security

### Anonymous by Design
- ❌ No student names
- ❌ No personal identifiers
- ✅ Aggregate emotional data only
- ✅ Timestamps for trend analysis
- ✅ Location-based insights (kiosk, not student)

### Data Storage
- All configuration in browser localStorage
- No server-side data collection in demo
- API configurations support secure external storage
- Theme preferences are anonymous metadata

## Best Practices

### For Administrators
1. **Start with Locations**: Set up kiosk locations before collecting data
2. **Test Languages**: Enable and test each language before making it default
3. **Document APIs**: Use the description field to explain API purposes
4. **Regular Exports**: Export data regularly for backup and analysis
5. **Review Emotions**: Periodically review and update custom emotions

### For Users
1. **Select Location Filter**: Filter by your building/area for relevant insights
2. **Choose Language**: Set your preferred language for better comprehension
3. **Export Data**: Use CSV/PDF export for presentations and reports
4. **Custom Ranges**: Use date search and custom ranges for specific analysis

## Future Enhancements

Possible additions to the admin system:
- Email notifications for concerning mood trends
- Scheduled automatic data exports
- Role-based admin access controls
- Bulk emotion import/export
- Advanced API webhook configurations
- Real-time kiosk status monitoring

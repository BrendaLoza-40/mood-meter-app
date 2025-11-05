# API Correlation Metrics Feature

## Overview
When admins add APIs to the MoodMeter system, they can now select from predefined correlation metrics based on the type of data the API provides. This makes it easier to set up meaningful correlations between external data and mood patterns.

## Key Features

### 1. **Data Type Categories**
- **Weather Data**: Temperature, humidity, precipitation, UV index, etc.
- **Air Quality**: PM2.5, AQI, ozone levels, pollution data
- **School Events**: Calendar events, testing periods, special activities
- **Academic Data**: Grades, assignments, test scores, study hours
- **Social Data**: Peer interactions, social events, community engagement
- **Custom Data**: User-defined metrics for specialized use cases

### 2. **Predefined Correlation Metrics**

#### Weather Metrics:
- Temperature vs Mood Intensity
- Humidity vs Energy Levels
- Precipitation vs Mood Category
- Barometric Pressure vs Response Time
- UV Index vs Pleasant/Unpleasant Ratio
- Wind Speed vs Emotional Stability

#### Air Quality Metrics:
- PM2.5 vs Mood Intensity
- Air Quality Index vs Mood Category
- Ozone Levels vs Energy Levels
- PM10 vs Response Time
- Air Quality vs Pleasant/Unpleasant Ratio
- Pollution vs Emotional Clarity

#### School Events Metrics:
- Event Type vs Mood Distribution
- Event Timing vs Energy Levels
- Event Duration vs Response Time
- Event Participation vs Mood Intensity
- Special Activities vs Pleasant Emotions
- Testing Periods vs Stress Levels

### 3. **Quick Setup Templates**
Pre-configured templates for popular APIs:

#### PurpleAir Air Quality
- **Endpoint**: `https://api.purpleair.com/v1/sensors`
- **Suggested Metrics**: PM2.5 vs Mood, AQI vs Categories, Ozone vs Energy
- **Use Case**: Correlate local air quality with student mood patterns

#### OpenWeatherMap
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Suggested Metrics**: Temperature vs Mood, Humidity vs Energy, Pressure vs Response Time
- **Use Case**: Study weather impact on student emotional states

#### WeatherAPI.com
- **Endpoint**: `https://api.weatherapi.com/v1/current.json`
- **Suggested Metrics**: Temperature vs Mood, UV Index vs Pleasant Ratio, Wind vs Stability
- **Use Case**: Comprehensive weather correlation analysis

#### Google Calendar
- **Endpoint**: `https://www.googleapis.com/calendar/v3/calendars/primary/events`
- **Suggested Metrics**: Event Type vs Mood, Event Duration vs Response Time
- **Use Case**: Correlate school events with mood changes

### 4. **Enhanced Admin Interface**

#### API Configuration Form:
1. **Quick Setup**: One-click templates for popular services
2. **Data Type Selector**: Choose the category of data
3. **Correlation Metrics**: Multi-select checkboxes with suggested metrics
4. **Visual Feedback**: Shows selected metric count and validation

#### API Management:
- **Data Type Badges**: Visual indicators of API category
- **Metric Count**: Shows number of configured correlations
- **Metric Preview**: Displays first 3 metrics with "more" indicator
- **Enhanced Details**: Better organization of API information

### 5. **Smart Defaults**

#### Automatic Suggestions:
- Metrics automatically filtered based on data type
- Default selections for common use cases
- Form validation ensures at least one metric is selected

#### Template Benefits:
- Pre-filled endpoints and descriptions
- Optimal metric selections for each service
- Proper data type categorization

## Usage Workflow

### For Admins:
1. **Choose Template** (optional): Click quick setup button for popular APIs
2. **Select Data Type**: Choose from weather, air quality, school events, etc.
3. **Pick Metrics**: Select relevant correlation metrics from filtered list
4. **Configure Details**: Add API key, endpoint, and description
5. **Enable API**: Toggle on/off in the API management section

### For Dashboard Users:
1. **View Correlations**: See enabled APIs in "Mood vs API Correlation" charts
2. **Analyze Patterns**: Explore relationships between external data and mood
3. **Export Data**: Include correlation data in reports and exports

## Benefits

### For School Administrators:
- **Easy Setup**: Quick templates reduce configuration complexity
- **Meaningful Insights**: Predefined metrics ensure relevant correlations
- **Flexible Configuration**: Custom options for unique data sources

### For Researchers:
- **Data-Driven Analysis**: Multiple correlation types for comprehensive studies
- **External Data Integration**: Combine mood data with environmental factors
- **Standardized Metrics**: Consistent correlation types across installations

### For Students and Staff:
- **Environmental Awareness**: Understand how external factors affect mood
- **Pattern Recognition**: Identify trends and triggers in mood data
- **Actionable Insights**: Use correlation data for well-being improvements

## Technical Implementation

### Data Structure:
```typescript
interface APIConfiguration {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  enabled: boolean;
  description: string;
  correlationMetrics: string[];  // NEW
  dataType: 'weather' | 'air_quality' | 'school_events' | 'academic' | 'social' | 'custom';  // NEW
}
```

### Correlation Engine:
- Automatic data fetching from configured APIs
- Real-time correlation calculations
- Visual representation in dashboard charts
- Export capabilities for further analysis

This feature transforms the MoodMeter from a simple mood tracking tool into a comprehensive environmental and contextual mood analysis platform.
# PurpleAir API Integration Examples

## Getting Your API Key
1. Visit https://develop.purpleair.com/ 
2. Create an account and request API access
3. Get your API key from the developer dashboard

## Common API Endpoints

### 1. Get All Sensors
```
GET https://api.purpleair.com/v1/sensors
Headers: X-API-Key: YOUR_API_KEY
```

### 2. Get Sensors by Location (Bounding Box)
```
GET https://api.purpleair.com/v1/sensors?fields=sensor_index,name,latitude,longitude,pm2.5&nwlat=40.7829&nwlng=-73.9441&selat=40.7489&selng=-73.9441
Headers: X-API-Key: YOUR_API_KEY
```

### 3. Get Specific Sensor Data
```
GET https://api.purpleair.com/v1/sensors/12345?fields=pm2.5,pm2.5_10minute,pm2.5_60minute,humidity,temperature
Headers: X-API-Key: YOUR_API_KEY
```

### 4. Get Historical Data
```
GET https://api.purpleair.com/v1/sensors/12345/history?fields=pm2.5&start_timestamp=1609459200&end_timestamp=1609545600
Headers: X-API-Key: YOUR_API_KEY
```

## Sample Response Structure
```json
{
  "api_version": "V1.2.0-1.1.45",
  "time_stamp": 1762325631,
  "data_time_stamp": 1762325628,
  "sensor": {
    "sensor_index": 12345,
    "name": "School Air Monitor",
    "latitude": 40.7589,
    "longitude": -73.9851,
    "pm2.5": 12.3,
    "pm2.5_10minute": 11.8,
    "pm2.5_60minute": 13.1,
    "humidity": 45,
    "temperature": 72
  }
}
```

## Integration with MoodMeter

### 1. Add through Admin Settings UI
- Go to Admin Settings
- Click "Add API"
- Fill in PurpleAir details
- Enable the API

### 2. Use in Data Correlation
- Select "Mood vs API Correlation" in DataComparison component
- Choose PurpleAir from enabled APIs
- View correlation between air quality and mood patterns

### 3. Suggested Correlation Metrics
- PM2.5 levels vs average mood intensity
- Air quality index vs mood category distribution
- Temperature/humidity vs mood patterns
- Hourly air quality vs mood timing patterns
# API Key Security Configuration Guide

## Development Environment
### Label: `MoodMeter Development - Air Quality`
### Host Restriction: 
- `localhost:3000`
- `127.0.0.1:3000`
- `localhost:4000` (for API server)

### Referer Restriction:
- `http://localhost:3000/*`
- `http://127.0.0.1:3000/*`

## Production Environment
### Label: `MoodMeter Production - Air Quality`
### Host Restriction:
- `your-school-domain.com`
- `dashboard.your-school.edu`

### Referer Restriction:
- `https://your-school-domain.com/*`
- `https://dashboard.your-school.edu/*`

## Security Best Practices

1. **Always use HTTPS in production**
2. **Be specific with restrictions** - don't use wildcards unless necessary
3. **Create separate keys** for development and production
4. **Regular key rotation** - update keys periodically
5. **Monitor usage** - check API usage logs regularly

## Example for Different Services

### Google APIs
- Label: `MoodMeter Weather Data`
- Host: `your-domain.com`
- Referer: `https://your-domain.com/*`

### Weather APIs
- Label: `MoodMeter Weather Correlation`
- Usually no host/referer restrictions needed (server-side)

### PurpleAir
- Label: `MoodMeter Air Quality`
- Host: `your-dashboard-domain.com`
- Referer: `https://your-dashboard-domain.com/*`

## Environment Variables Setup

Add to your .env file:
```bash
# API Keys
PURPLEAIR_API_KEY=your_purpleair_key_here
WEATHER_API_KEY=your_weather_key_here
GOOGLE_API_KEY=your_google_key_here

# Security
API_HOST_RESTRICTION=localhost:3000,your-domain.com
API_REFERER_RESTRICTION=http://localhost:3000/*,https://your-domain.com/*
```
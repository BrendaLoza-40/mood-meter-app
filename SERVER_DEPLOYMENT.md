# Server Deployment Configuration

## Deploy to Railway (Recommended - Free Tier Available)

1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub repository
3. **Deploy**: 
   - Select your repository
   - Choose the `server` folder as the root directory
   - Railway will automatically detect Node.js and deploy

## Deploy to Render (Alternative - Free Tier Available)

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **New Web Service**: Connect your GitHub repository
3. **Configure**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

## Deploy to Heroku (Alternative)

1. **Install Heroku CLI**: Download from [heroku.com](https://heroku.com)
2. **Create App**: `heroku create your-mood-meter-api`
3. **Deploy**: Push your code to Heroku

## Environment Variables Needed

For any platform, set these environment variables:
- `PORT`: Will be set automatically by most platforms
- `NODE_ENV`: Set to `production`

## Important Notes

- Your server creates a SQLite database automatically
- No additional database setup required
- The server will be accessible at your deployment URL (e.g., `https://your-app-name.railway.app`)

## Next Steps

1. Deploy your server to one of the platforms above
2. Copy the deployment URL (e.g., `https://your-app-name.railway.app`)
3. Update your Netlify apps to use this URL instead of `localhost:4000`
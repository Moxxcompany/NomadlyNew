#!/bin/bash

# Deploy from Replit to Railway
echo "🚀 Deploying from Replit to Railway..."

# Check if RAILWAY_TOKEN is set in Replit secrets
if [ -z "$RAILWAY_TOKEN" ]; then
    echo "❌ Please add RAILWAY_TOKEN to your Replit secrets:"
    echo "   1. Go to Replit sidebar → Secrets"
    echo "   2. Add key: RAILWAY_TOKEN"
    echo "   3. Add value: your-railway-project-token"
    echo "   4. Get token from: https://railway.app/dashboard → Your Project → Settings → Tokens"
    exit 1
fi

echo "✅ Railway token found in secrets"

# Deploy using Railway CLI
echo "🚀 Starting deployment..."
railway up --detach

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: https://nomadly1.up.railway.app"
else
    echo "❌ Deployment failed"
    exit 1
fi
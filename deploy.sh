#!/bin/bash

# Railway Deployment Script for Nomadly Bot
# This script deploys the latest code to Railway.com

echo "🚀 Starting Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if RAILWAY_TOKEN is set
if [ -z "$RAILWAY_TOKEN" ]; then
    echo "❌ RAILWAY_TOKEN environment variable is not set!"
    echo "📝 Please set your Railway project token:"
    echo "   export RAILWAY_TOKEN='your-project-token-here'"
    echo ""
    echo "🔗 Get your token from: https://railway.app/dashboard -> Your Project -> Settings -> Tokens"
    exit 1
fi

echo "✅ Railway CLI found"
echo "✅ Railway token configured"

# Link to the existing project using service and environment IDs
echo "🔗 Linking to Railway project..."
railway link 0f4ab810-d9cc-43f7-b087-f1b930aa7543

# Show current project status
echo "📊 Current project status:"
railway status

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up --detach

echo "✅ Deployment initiated!"
echo "🌐 Your app will be available at: https://nomadly1.up.railway.app"
echo "📋 Check deployment status in Railway dashboard"
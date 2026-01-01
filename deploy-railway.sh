#!/bin/bash

# Railway Deployment Script - Based on Official Documentation
# Uses Railway's GraphQL Public API for programmatic deployment

echo "🚀 Railway Programmatic Deployment"
echo "=================================="

# Check if Railway token is available
if [ -z "$RAILWAY_TOKEN" ]; then
    echo "❌ RAILWAY_TOKEN not found!"
    echo ""
    echo "📝 Add your Railway token to Replit secrets:"
    echo "   1. Go to Railway Dashboard → Project → Settings → Tokens"
    echo "   2. Create a 'Project Token'"
    echo "   3. Add it to Replit secrets as RAILWAY_TOKEN"
    echo ""
    echo "🔗 Railway Documentation: https://docs.railway.com/guides/public-api"
    exit 1
fi

echo "✅ Railway token found"
echo ""

# Check for deployment type argument
ACTION=${1:-redeploy}

case $ACTION in
    "restart")
        echo "🔄 Restarting current deployment..."
        node railway-api-deploy.js restart
        ;;
    "redeploy")
        echo "🚀 Triggering new deployment..."
        node railway-api-deploy.js redeploy
        ;;
    "status")
        echo "📊 Checking current deployment status..."
        node railway-api-deploy.js status
        ;;
    *)
        echo "Usage: $0 [redeploy|restart|status]"
        echo ""
        echo "Commands:"
        echo "  redeploy  - Trigger a new deployment (default)"
        echo "  restart   - Restart the current deployment"
        echo "  status    - Check current deployment status"
        exit 1
        ;;
esac
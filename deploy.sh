#!/bin/bash

echo "🚀 Deploying Basalam Image Editor to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Update Basalam OAuth redirect URI to: https://your-url.vercel.app/"
echo "3. Set BASALAM_REDIRECT_URI environment variable in Vercel dashboard"
echo "4. Test the OAuth flow with the live URL"
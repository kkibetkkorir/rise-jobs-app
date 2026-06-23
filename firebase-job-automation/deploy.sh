#!/bin/bash

# Deploy automation system
echo "🚀 Deploying Job Automation System..."

# Install dependencies
echo "📦 Installing dependencies..."
cd functions
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Deploy to Firebase
echo "📤 Deploying to Firebase..."
firebase deploy --only functions

echo "✅ Deployment complete!"

# Show logs
echo "📋 Viewing logs..."
firebase functions:log --limit 10
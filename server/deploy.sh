#!/bin/bash

echo "🚀 Deploying backend to Vercel with Neon database..."

# Make sure you're in the server directory
cd server

echo "📝 Setting up Vercel environment variables..."
echo "Please run these commands in your terminal after getting your Neon connection string:"
echo ""
echo "vercel env add POSTGRES_URL"
echo "vercel env add POSTGRES_PRISMA_URL"
echo "vercel env add POSTGRES_URL_NON_POOLING"
echo "vercel env add JWT_SECRET"
echo "vercel env add ADMIN_EMAIL"
echo "vercel env add ADMIN_PASSWORD"
echo "vercel env add NODE_ENV"
echo ""
echo "Then deploy with:"
echo "vercel --prod"
echo ""
echo "Or use the Vercel dashboard to set environment variables:"
echo "https://vercel.com/dashboard -> Your Project -> Settings -> Environment Variables"

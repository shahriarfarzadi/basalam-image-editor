# Deployment Guide

## Deploy to Vercel

### 1. Prepare for Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### 2. Deploy the Project

```bash
# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: basalam-image-editor
# - Directory: ./
# - Override settings? N
```

### 3. Set Environment Variables

After deployment, set these environment variables in Vercel dashboard:

```
SUPABASE_URL=https://jmmxaichbmlxbypztemy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbXhhaWNoYm1seGJ5cHp0ZW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjE4NzcsImV4cCI6MjA3Nzk5Nzg3N30._byFafQJ80p8Nstke0EXKdLkfrB3qbj4SiqA2kKt4R0
SUPABASE_SERVICE_ROLE_KEY=sbp_fbe7faca17c21e66df1e191f36026ee743ba6fc5
BASALAM_API_BASE=https://openapi.basalam.com
GOOGLE_AI_API_KEY=AIzaSyBbcteBoho49_Bg9uhDOyeeTINwolM082k
BASALAM_CLIENT_ID=1589
BASALAM_CLIENT_SECRET=qrY6DUHogZ5V8SXdWKAcd6X5yWOXNkYKPRD9w5NI
```

### 4. Update Basalam OAuth Configuration

Once deployed, you'll get a Vercel URL like: `https://basalam-image-editor-xxx.vercel.app`

Update the Basalam OAuth redirect URI to:
`https://your-vercel-url.vercel.app/`

### 5. Update Environment Variable

Set the redirect URI in Vercel:
```
BASALAM_REDIRECT_URI=https://your-vercel-url.vercel.app/
```

### 6. Redeploy

```bash
vercel --prod
```

## Quick Deploy Commands

```bash
# One-time setup
vercel login
vercel

# Set environment variables in Vercel dashboard
# Update Basalam redirect URI
# Redeploy
vercel --prod
```
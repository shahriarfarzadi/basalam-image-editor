# 🎨 Basalam Image Editor

AI-powered image editor with mannequin replacement for Basalam e-commerce platform. Clone of `https://editor.darkube.app/` with enhanced features.

## ✨ Features

- 🔐 **Basalam OAuth Authentication** - Secure login with Basalam accounts
- 🤖 **AI Mannequin Replacement** - Replace models with AI-generated mannequins using Google AI Studio
- 📦 **Product Management** - View and manage Basalam product catalog
- 🎯 **Multiple Mannequin Styles** - Professional, Casual, Elegant, Sporty options
- 📱 **Responsive Design** - Clean, modern UI with Tailwind CSS
- ⚡ **Real-time Processing** - Live status updates during image processing

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Google AI Studio (nano banana model)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Basalam OAuth
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Basalam developer account with OAuth app
- Supabase project
- Google AI Studio API key

## 🛠️ Setup

### 1. Clone and Install

```bash
git clone https://github.com/shahriarfarzadi/basalam-image-editor.git
cd basalam-image-editor
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `SUPABASE_URL` & `SUPABASE_ANON_KEY` - From your Supabase project
- `BASALAM_CLIENT_ID` & `BASALAM_CLIENT_SECRET` - From Basalam OAuth app
- `GOOGLE_AI_API_KEY` - From Google AI Studio

### 3. Database Setup

Run the SQL schema in your Supabase project:

```sql
-- Copy contents from supabase.sql
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel

1. **Import from GitHub** in Vercel dashboard
2. **Set Environment Variables** in Vercel project settings
3. **Update Basalam OAuth** redirect URI to your Vercel URL
4. **Deploy**

See `DEPLOYMENT.md` for detailed instructions.

## 📖 Documentation

- [OAuth Setup Guide](BASALAM_OAUTH_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Documentation](docs/spec.md)
- [Basalam Developer Docs](https://developers.basalam.com)

## 🎯 Usage

1. **Login** with your Basalam account
2. **Upload** product images
3. **Select** mannequin style
4. **Process** with AI enhancement
5. **Download** enhanced images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Live Demo](https://basalam-image-editor.vercel.app) (Coming soon)
- [Basalam Platform](https://basalam.com)
- [Original Editor](https://editor.darkube.app)



# Period Calm Website

A modern Next.js website for Period Calm - Natural period pain relief with comprehensive feedback analytics.

## ✨ Features

- **Interactive AI Feedback Forms**: 35-question comprehensive feedback system
- **Real-time Analytics Dashboard**: Password-protected analytics with data visualization
- **Dynamic Homepage**: All sections pull real data from user feedback
- **Mobile Responsive Design**: Optimized for all devices
- **Supabase Backend**: Secure database with Row Level Security (RLS)
- **Modern UI/UX**: Beautiful gradients, animations, and micro-interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Row Level Security
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: React Hooks, Zustand
- **Deployment**: Vercel with custom domain support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd period-calm-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   ```bash
   # Run Supabase migrations
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📊 Analytics Dashboard

Access the analytics dashboard at `/analytics` with password protection:
- User feedback insights
- Real-time metrics
- Data visualization
- Export functionality

## 🗄️ Database Schema

The project uses a comprehensive feedback schema with:
- Personal information
- Product experience data
- Business insights
- Emotional & lifestyle impact
- Additional feedback

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix)
│   └── advanced-cycle-tracker/  # Cycle tracking features
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and stores
├── supabase/             # Database migrations and config
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components
- **HeroSection**: Dynamic homepage with real analytics data
- **AIChatFeedbackForm**: Interactive 35-question feedback system
- **AnalyticsDashboard**: Comprehensive data visualization
- **TestimonialsSection**: Dynamic user testimonials

## 🎯 Production Status

✅ **Production Ready** - All features implemented and tested  
✅ **Database Integration** - Supabase with proper RLS policies  
✅ **Responsive Design** - Mobile-first approach  
✅ **Performance Optimized** - Image optimization and lazy loading  
✅ **Security** - Environment variables and RLS policies  

## 📈 Analytics Features

- Real-time user feedback processing
- Dynamic testimonials from actual user data
- Comprehensive metrics and insights
- Data export functionality
- Geographic and demographic analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Period Calm.

---

**Built with ❤️ for women's health and natural period pain relief** 
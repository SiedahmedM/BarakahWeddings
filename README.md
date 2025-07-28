# Muslim Wedding Hub - Vendor Marketplace MVP

A modern web application connecting Muslim couples with verified halal/Islamic-compliant wedding vendors. Built with Next.js 14, Tailwind CSS, Prisma, and Supabase.

## 🌟 Features

### For Couples
- **Smart Search**: Find vendors by location, category, and Islamic compliance features
- **Islamic Compliance Filters**: 
  - Halal food only
  - Prayer space available
  - Gender-separated services
  - No alcohol venues
  - Female staff available
- **Vendor Profiles**: Detailed profiles with galleries, reviews, and contact information
- **Quote Requests**: Easy quote request system with WhatsApp integration
- **Verified Reviews**: Reviews from verified Muslim weddings

### For Vendors
- **Professional Profiles**: Showcase your business with photos and detailed descriptions
- **Islamic Compliance Badges**: Highlight your Islamic-friendly services
- **Quote Management**: Manage customer inquiries from your dashboard
- **Verification System**: Get verified to build trust with couples

### Design Features
- **Islamic Design Elements**: Geometric patterns and emerald green color scheme
- **Mobile-First**: Fully responsive design optimized for all devices
- **WhatsApp Integration**: Direct contact via WhatsApp for instant communication
- **Premium UI**: Clean, modern interface with excellent user experience

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (frontend) + Supabase (database)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom Islamic-inspired design

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd muslim-wedding-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Database
   DATABASE_URL="your-supabase-database-url"
   DIRECT_URL="your-supabase-direct-url"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Optional: Supabase keys for additional features
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push the schema to your database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   ├── quotes/                 # Quote request API
│   │   └── vendor/                 # Vendor API routes
│   ├── vendor/
│   │   ├── [id]/                   # Vendor profile pages
│   │   ├── dashboard/              # Vendor dashboard
│   │   ├── login/                  # Vendor login
│   │   └── register/               # Vendor registration
│   ├── vendors/                    # Vendor search/listing
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Homepage
│   └── providers.tsx               # Session provider
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   └── prisma.ts                   # Prisma client
└── prisma/
    ├── schema.prisma               # Database schema
    └── seed.ts                     # Sample data
```

## 🎯 Key Pages

- **Homepage** (`/`): Hero section, search bar, featured vendors, categories
- **Vendor Search** (`/vendors`): Advanced filtering with Islamic compliance options
- **Vendor Profile** (`/vendor/[id]`): Detailed vendor information and quote requests
- **Vendor Dashboard** (`/vendor/dashboard`): Vendor management interface
- **Authentication** (`/vendor/login`, `/vendor/register`): Vendor auth system

## 📊 Database Schema

### Core Models
- **User**: User accounts for vendors
- **Vendor**: Business profiles with Islamic compliance options
- **VendorPhoto**: Photo galleries for vendors
- **Review**: Customer reviews with Muslim wedding verification
- **QuoteRequest**: Customer inquiries to vendors

### Islamic Compliance Features
- Halal food certification
- Prayer space availability
- Gender-separated services
- Alcohol-free venues
- Female staff availability

## 🎨 Design System

### Colors
- **Primary**: Emerald Green (#10b981)
- **Secondary**: Gold (#f59e0b)
- **Background**: Clean whites and grays

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible text

### Islamic Design Elements
- Geometric pattern backgrounds
- Cultural iconography
- Respectful imagery choices
- Clean, modern aesthetic

## 🔧 Development Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:migrate   # Run database migrations
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
DATABASE_URL=your-supabase-production-url
DIRECT_URL=your-supabase-direct-url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
```

## 📱 Sample Data

The application includes seed data with:
- **20 sample vendors** across all categories
- **Diverse locations** across the United States
- **Islamic compliance badges** demonstrating the filtering system
- **Sample reviews** from verified Muslim weddings
- **Professional photos** using Unsplash integration

### Vendor Categories
- Wedding Venues
- Halal Caterers  
- Photographers
- Videographers
- Bridal/Modest Fashion
- Nikah Officiants
- Hair & Makeup (Female Staff)
- Jewelry
- Decorations
- Transportation
- Halal Entertainment

## 🔐 Security Features

- NextAuth.js for secure authentication
- Prisma for SQL injection protection
- Environment variable management
- CSRF protection
- Secure session handling

## 🎯 Future Enhancements

- [ ] Real-time messaging between couples and vendors
- [ ] Advanced photo upload with Cloudinary/Uploadthing
- [ ] Email notifications for quote requests
- [ ] Vendor subscription management
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Arabic, Urdu, etc.)
- [ ] Integration with Islamic calendar for event planning
- [ ] Vendor verification process
- [ ] Payment processing for bookings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please contact:
- Email: support@muslimweddinghub.com
- Documentation: See README.md
- Issues: GitHub Issues tab

---

**Built with ❤️ for the Muslim community**

# Cloudzz Links

<div align="center">
  <img src="public/previwe_landing.png" alt="Cloudzz Links Preview" width="800" />
  
  **One Link for Everything You Are.**
  
  A modern, customizable link-in-bio platform for creators who want to stand out.
  
  [Live Demo](https://links.cloudzz.dev) · [Report Bug](https://github.com/Cloudzz-dev/links.cloudzz.dev/issues) · [Request Feature](https://github.com/Cloudzz-dev/links.cloudzz.dev/issues)
</div>

> [!WARNING]
> **Vibe Coded** 
> 
> This project is basically 99% vibe coded — it was made mostly to test out new AI models, but I thought it turned out quite nice so here it is!

---

## ✨ Features

- **🎨 11 Premium Themes** - Choose from Minimal, Dark, Cyberpunk, Apple, Midnight, Sunset, Forest, Ocean, Glitch, Retro, and Monochrome
- **🔗 Social Platform Integration** - Auto-generate URLs for GitHub, Twitter/X, Instagram, LinkedIn, YouTube, Twitch, TikTok, and more
- **🖼️ Custom Avatars & Banners** - Upload your own images with a personal media library
- **📱 Fully Responsive** - Looks great on desktop, tablet, and mobile
- **🔐 Secure Authentication** - Email/password auth with encrypted credentials
- **⚡ Lightning Fast** - Built with Next.js 16 for optimal performance
- **🎯 Drag & Drop Links** - Reorder your links with intuitive drag-and-drop
- **🌐 Custom Usernames** - Get your own `links.cloudzz.dev/username` URL

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **Deployment** | [Vercel](https://vercel.com/) / Self-hosted |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Cloudzz-dev/links.cloudzz.dev.git
   cd links.cloudzz.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/cloudzz_links"
   
   # NextAuth
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
links.cloudzz.dev/
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── uploads/            # User uploaded images
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login & Register pages
│   │   ├── (public)/       # Public profile pages
│   │   ├── api/            # API routes
│   │   └── dashboard/      # Dashboard pages
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   └── lib/
│       ├── auth.ts         # NextAuth configuration
│       ├── prisma.ts       # Prisma client
│       └── utils.ts        # Utility functions
└── ...
```

---

## 🎨 Available Themes

| Theme | Description |
|-------|-------------|
| **Minimal** | Clean white background with subtle styling |
| **Dark** | Hacker-style green-on-black terminal look |
| **Cyberpunk** | Neon cyan with glowing effects |
| **Apple** | Inspired by Apple's clean design language |
| **Midnight** | Deep slate gradient with elegant feel |
| **Sunset** | Warm orange-to-pink gradient |
| **Forest** | Rich emerald tones |
| **Ocean** | Cool cyan depths |
| **Glitch** | High-contrast with hover effects |
| **Retro** | Purple and yellow nostalgic vibes |
| **Monochrome** | Bold black and white |

---

## 🔧 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user` | Get current user profile |
| `PATCH` | `/api/user` | Update user profile |
| `GET` | `/api/links` | Get user's links |
| `POST` | `/api/links` | Create a new link |
| `PATCH` | `/api/links/[id]` | Update a link |
| `DELETE` | `/api/links/[id]` | Delete a link |
| `PATCH` | `/api/links/reorder` | Reorder links |
| `POST` | `/api/upload` | Upload an image |
| `GET` | `/api/uploads` | List user's uploaded images |

---

## 🐳 Docker Deployment

A `docker-compose.yml` is included for easy deployment:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- (Add your app container configuration as needed)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 

**Anyone is free to use, modify, and distribute this code** - feel free to use it for your own projects!

---

## 👤 Author

**Leon Lezaic.**

- GitHub: [@Cloudzz-dev](https://github.com/Cloudzz-dev)
- Website: [cloudzz.dev](https://cloudzz.dev)

---

<div align="center">
  <p>Built with ❤️ by Cloudzz</p>
</div>

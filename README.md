# Cloudzz Links

A clean, minimal, customizable link-in-bio platform — your own self-hosted alternative to LinkTree.  
Users can register, log in, and create a public page at:

https://links.cloudzz.dev/

<username>


Built with **Next.js**, **TailwindCSS**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Features

- 🔐 **User Authentication** (Register, Login, Logout)  
- 👤 **User Profiles** (avatar, bio, username, theme)  
- 🔗 **Link Management** (add, edit, delete, reorder)  
- 🎨 **Themes** (Minimal, Dark/Hacker, Cyberpunk, Apple Clean)  
- 🌐 **Public Profile Pages**  
- 📱 Fully responsive  
- ⚡ Fast and deployment-ready on Vercel  

### Optional / Stretch Features
- 📊 Link click analytics  
- 🧪 Admin panel  
- 🧾 QR code for each profile  

---

## 🧱 Tech Stack

- **Frontend:** Next.js (App Router), TailwindCSS  
- **Backend:** Next.js API Routes  
- **Database:** PostgreSQL (Supabase/Neon)  
- **ORM:** Prisma  
- **Auth:** NextAuth / Auth.js  
- **Components:** Shadcn UI  
- **Icons:** Lucide / FontAwesome  

---

## 📦 Project Structure

/src
/app
/(public)
[username]/page.tsx
/(auth)
login/page.tsx
register/page.tsx
/dashboard
profile/page.tsx
links/page.tsx
/api
/auth/*
/links/*
/components
/ui
LinkCard.tsx
ProfileHeader.tsx
ThemeSwitcher.tsx
/lib
auth.ts
prisma.ts
validators.ts
/styles
globals.css


---

## 🗄️ Database Schema (Prisma)

### **User**
- `id` (string, cuid)  
- `email` (string, unique)  
- `passwordHash` (string)  
- `username` (string, unique)  
- `bio` (string, optional)  
- `avatarUrl` (string, optional)  
- `theme` (string, default: "minimal")  

### **Link**
- `id` (string, cuid)  
- `userId` (relation)  
- `title` (string)  
- `url` (string)  
- `order` (int)  

---

## 🏁 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/cloudzz-links
cd cloudzz-links

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file:

DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

4. Initialize Prisma

npx prisma generate
npx prisma db push

5. Run the dev server

npm run dev

Your app runs at:
http://localhost:3000
📤 Deployment

Deploy easily to Vercel:

    Push repo to GitHub

    Create Vercel project

    Add environment variables

    Connect PostgreSQL

    Deploy

📝 License

MIT — free to use, modify, and self-host.


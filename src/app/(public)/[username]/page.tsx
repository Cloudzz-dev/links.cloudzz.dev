import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Github, Twitter, Instagram, Linkedin, Youtube, Twitch, Globe, Facebook } from "lucide-react"

// Platform icons map
const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    twitch: Twitch,
    facebook: Facebook,
    other: Globe,
}

// Theme styles map - all with grid pattern support
const themes = {
    minimal: "bg-white text-gray-900",
    dark: "bg-black text-green-500 font-mono",
    cyberpunk: "bg-slate-900 text-cyan-400",
    apple: "bg-gray-50 text-gray-900",
    midnight: "bg-gradient-to-b from-slate-900 to-slate-800 text-white",
    sunset: "bg-gradient-to-br from-orange-500 to-pink-500 text-white",
    forest: "bg-emerald-950 text-emerald-100",
    ocean: "bg-cyan-950 text-cyan-100",
    glitch: "bg-black text-white font-mono",
    retro: "bg-purple-900 text-yellow-400 font-serif",
    monochrome: "bg-white text-black",
}

// Grid pattern colors per theme
const gridColors: Record<string, string> = {
    minimal: "rgba(0,0,0,0.05)",
    dark: "rgba(0,255,0,0.1)",
    cyberpunk: "rgba(0,255,255,0.1)",
    apple: "rgba(0,0,0,0.03)",
    midnight: "rgba(255,255,255,0.05)",
    sunset: "rgba(255,255,255,0.1)",
    forest: "rgba(16,185,129,0.1)",
    ocean: "rgba(6,182,212,0.1)",
    glitch: "rgba(255,255,255,0.1)",
    retro: "rgba(250,204,21,0.1)",
    monochrome: "rgba(0,0,0,0.05)",
}

const buttonStyles = {
    minimal: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 rounded-lg",
    dark: "bg-black border border-green-500 hover:bg-green-900/20 text-green-500 rounded-lg",
    cyberpunk: "bg-slate-800 border border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-lg",
    apple: "bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-200 rounded-2xl",
    midnight: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg",
    sunset: "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 rounded-lg",
    forest: "bg-emerald-900/50 hover:bg-emerald-900/70 text-emerald-100 border border-emerald-800 rounded-lg",
    ocean: "bg-cyan-900/50 hover:bg-cyan-900/70 text-cyan-100 border border-cyan-800 rounded-lg",
    glitch: "bg-transparent border-2 border-white hover:bg-white hover:text-black transition-colors rounded-lg",
    retro: "bg-yellow-400 text-purple-900 hover:bg-yellow-300 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 rounded-lg",
    monochrome: "bg-white border-2 border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest rounded-lg",
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            links: {
                orderBy: { order: "asc" }
            }
        }
    })

    if (!user) {
        notFound()
    }

    const theme = (user.theme as keyof typeof themes) || "minimal"
    const themeClass = themes[theme] || themes.minimal
    const btnClass = buttonStyles[theme] || buttonStyles.minimal
    const gridColor = gridColors[theme] || gridColors.minimal

    return (
        <div
            className={cn("min-h-screen flex flex-col items-center transition-colors duration-300 relative", themeClass)}
            style={{
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
            }}
        >
            {/* Banner */}
            {user.bannerUrl ? (
                <div className="w-full h-48 md:h-64 relative">
                    <img
                        src={user.bannerUrl}
                        alt="Profile Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                </div>
            ) : (
                <div className="w-full h-32 bg-gradient-to-r from-gray-800 to-gray-900" />
            )}

            <div className="w-full max-w-md space-y-8 text-center px-4 -mt-12 relative z-10">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                        <AvatarImage src={user.avatarUrl || ""} alt={user.username} className="object-cover" />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold drop-shadow-sm">@{user.username}</h1>
                        {user.bio && <p className="text-sm opacity-90 whitespace-pre-wrap max-w-sm mx-auto">{user.bio}</p>}
                    </div>
                </div>

                <div className="space-y-4 w-full">
                    {user.links.map((link: any) => {
                        const IconComponent = platformIcons[link.platform || "other"] || Globe
                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center justify-center gap-3 w-full py-4 px-6 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                                    btnClass
                                )}
                            >
                                <IconComponent className="h-5 w-5 flex-shrink-0" />
                                <span>{link.title}</span>
                            </a>
                        )
                    })}
                    {user.links.length === 0 && (
                        <p className="text-sm opacity-50">No links yet.</p>
                    )}
                </div>
            </div>

            <div className="mt-16 pb-8">
                <Link href="/" className="text-xs opacity-50 hover:opacity-100 transition-opacity">
                    Powered by Cloudzz Links
                </Link>
            </div>
        </div>
    )
}

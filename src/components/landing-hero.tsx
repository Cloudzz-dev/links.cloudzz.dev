"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield, Palette } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LandingHero() {
    const [username, setUsername] = useState("")
    const router = useRouter()

    const handleClaim = (e: React.FormEvent) => {
        e.preventDefault()
        if (username) {
            router.push(`/register?username=${username}`)
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/30 blur-[150px] rounded-full opacity-40 z-0" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full opacity-30 z-0" />

            {/* Navbar */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-white shadow-lg glow-sm">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="gradient-text">Cloudzz Links</span>
                </div>
                <div className="flex gap-3">
                    <Link href="/login">
                        <Button variant="ghost" className="glass-button text-white hover:text-white">
                            Login
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-white text-black hover:bg-gray-100 font-semibold shadow-lg">
                            Sign Up Free
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 text-center max-w-4xl px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-gray-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium">v2.0 is now live</span>
                    <span className="text-primary font-semibold">— New themes & features!</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
                    <span className="gradient-text">One Link for</span>
                    <br />
                    <span className="text-white">Everything You Are.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Share your socials, music, videos, and more with a single bio link.
                    <span className="text-white font-medium"> Designed for creators who want to stand out.</span>
                </p>

                {/* Claim Form */}
                <form onSubmit={handleClaim} className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <div className="relative flex-1 glass-card rounded-xl overflow-hidden">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">
                                links.cloudzz.dev/
                            </span>
                            <input
                                type="text"
                                className="w-full h-14 pl-[145px] pr-4 bg-transparent text-white text-lg font-medium placeholder:text-gray-600 focus:outline-none"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 text-lg font-semibold shadow-lg glow-sm transition-all duration-300 hover:glow-md"
                        >
                            Claim my Link
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-gray-500 text-sm mt-4">
                        Free forever. No credit card required.
                    </p>
                </form>

                {/* App Preview */}
                <div className="mt-16 relative w-full max-w-4xl mx-auto">
                    <div className="glass-card rounded-2xl p-2 shadow-2xl animate-float">
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src="/preview.png"
                                alt="Cloudzz Links Preview"
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                    {/* Decorative glow behind the preview */}
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10 opacity-50" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-16 max-w-3xl mx-auto">
                    <div className="premium-card p-6 text-left">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
                        <p className="text-gray-400 text-sm">
                            Set up your link page in under 60 seconds. No design skills needed.
                        </p>
                    </div>
                    <div className="premium-card p-6 text-left">
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                            <Palette className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">11 Premium Themes</h3>
                        <p className="text-gray-400 text-sm">
                            Choose from beautiful themes designed to make you stand out.
                        </p>
                    </div>
                    <div className="premium-card p-6 text-left">
                        <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Your Data, Your Control</h3>
                        <p className="text-gray-400 text-sm">
                            No ads, no tracking. We respect your privacy.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-gray-600 text-sm">
                © 2024 Cloudzz Links. Built with ❤️
            </div>
        </div>
    )
}

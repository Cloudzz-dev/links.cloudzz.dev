import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/30 blur-[150px] rounded-full opacity-40 z-0" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full opacity-30 z-0" />

            {/* Logo */}
            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition-opacity z-20">
                <div className="h-9 w-9 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5" />
                </div>
                <span className="gradient-text">Cloudzz Links</span>
            </Link>

            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User } from "lucide-react"

const items = [
    {
        title: "Links",
        href: "/dashboard/links",
        icon: LayoutDashboard,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
]

export function DashboardNav({ vertical = false }: { vertical?: boolean }) {
    const pathname = usePathname()

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", vertical && "flex-col items-start space-x-0 space-y-1")}>
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href
                            ? "text-foreground"
                            : "text-muted-foreground",
                        vertical && "w-full justify-start px-2 py-1.5 hover:bg-accent hover:text-accent-foreground rounded-md flex items-center gap-2"
                    )}
                >
                    {vertical && <item.icon className="h-4 w-4" />}
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}

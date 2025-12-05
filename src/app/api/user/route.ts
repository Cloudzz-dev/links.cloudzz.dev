import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const profileSchema = z.object({
    username: z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/).optional(),
    bio: z.string().optional(),
    theme: z.enum(["minimal", "dark", "cyberpunk", "apple", "midnight", "sunset", "forest", "ocean", "glitch", "retro", "monochrome"]).optional(),
    avatarUrl: z.string().optional().or(z.literal("")),
    bannerUrl: z.string().optional().or(z.literal("")),
})

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true, bio: true, theme: true, avatarUrl: true, bannerUrl: true, email: true }
    })

    return NextResponse.json(user)
}

export async function PATCH(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const data = profileSchema.parse(body)

        // Check username uniqueness if changing
        if (data.username) {
            const existing = await prisma.user.findUnique({
                where: { username: data.username },
            })
            if (existing && existing.id !== session.user.id) {
                return NextResponse.json({ error: "Username taken" }, { status: 400 })
            }
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data,
        })

        return NextResponse.json(user)
    } catch (error) {
        return new NextResponse("Invalid request", { status: 400 })
    }
}

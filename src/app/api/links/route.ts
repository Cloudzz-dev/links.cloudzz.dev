import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const linkSchema = z.object({
    title: z.string().min(1),
    url: z.string().url(),
})

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const links = await prisma.link.findMany({
        where: { userId: session.user.id },
        orderBy: { order: "asc" },
    })

    return NextResponse.json(links)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { title, url } = linkSchema.parse(body)

        const count = await prisma.link.count({ where: { userId: session.user.id } })

        const link = await prisma.link.create({
            data: {
                title,
                url,
                userId: session.user.id,
                order: count,
            },
        })

        return NextResponse.json(link)
    } catch (error) {
        return new NextResponse("Invalid request", { status: 400 })
    }
}

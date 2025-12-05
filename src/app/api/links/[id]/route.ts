import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
    title: z.string().min(1).optional(),
    url: z.string().url().optional(),
    order: z.number().int().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        const body = await req.json()
        const { title, url, order } = patchSchema.parse(body)

        // Verify ownership
        const existingLink = await prisma.link.findUnique({
            where: { id },
        })

        if (!existingLink || existingLink.userId !== session.user.id) {
            return new NextResponse("Not Found", { status: 404 })
        }

        const link = await prisma.link.update({
            where: { id },
            data: { title, url, order },
        })

        return NextResponse.json(link)
    } catch (error) {
        return new NextResponse("Invalid request", { status: 400 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        const existingLink = await prisma.link.findUnique({
            where: { id },
        })

        if (!existingLink || existingLink.userId !== session.user.id) {
            return new NextResponse("Not Found", { status: 404 })
        }

        await prisma.link.delete({
            where: { id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return new NextResponse("Error", { status: 500 })
    }
}

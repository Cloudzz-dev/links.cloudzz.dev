import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reorderSchema = z.array(
    z.object({
        id: z.string(),
        order: z.number(),
    })
)

export async function PATCH(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await req.json()
        const body = reorderSchema.parse(json)

        // Verify ownership of all links
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { links: true },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const userLinkIds = new Set(user.links.map((l: { id: string }) => l.id))
        const allOwned = body.every((item) => userLinkIds.has(item.id))

        if (!allOwned) {
            return new NextResponse("Unauthorized access to some links", { status: 403 })
        }

        // Update order in transaction
        await prisma.$transaction(
            body.map((item) =>
                prisma.link.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        return new NextResponse("Internal Error", { status: 500 })
    }
}

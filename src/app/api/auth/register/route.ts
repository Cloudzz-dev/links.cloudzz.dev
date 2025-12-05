import { NextResponse } from "next/server"
import { z, ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const registerSchema = z.object({
    username: z.string().min(3).regex(/^[a-zA-Z0-9_-]+$/),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("[Register] Received body:", JSON.stringify(body))

        const { username, email, password } = registerSchema.parse(body)
        console.log("[Register] Validated:", { username, email })

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            console.log("[Register] User already exists:", existingUser.email, existingUser.username)
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            }
        })

        console.log("[Register] Created user:", user.id)
        return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        console.error("[Register] Error:", error)
        if (error instanceof ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 })
        }
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
}

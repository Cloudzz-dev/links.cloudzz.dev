import { NextResponse } from "next/server"
import { readdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const uploadDir = path.join(process.cwd(), "public/uploads", session.user.id)

        try {
            const files = await readdir(uploadDir)
            // Filter for image files and map to public URLs
            const images = files
                .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
                .map(file => `/uploads/${session.user?.id}/${file}`)
                // Sort by timestamp (assuming filename starts with timestamp)
                .sort((a, b) => {
                    const timeA = parseInt(a.split('/').pop()?.split('_')[0] || "0")
                    const timeB = parseInt(b.split('/').pop()?.split('_')[0] || "0")
                    return timeB - timeA // Newest first
                })

            return NextResponse.json({ images })
        } catch (error) {
            // Directory might not exist yet
            return NextResponse.json({ images: [] })
        }
    } catch (error) {
        console.error("Error listing uploads:", error)
        return NextResponse.json({ error: "Failed to list uploads" }, { status: 500 })
    }
}

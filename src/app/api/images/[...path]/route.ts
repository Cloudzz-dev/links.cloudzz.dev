import { NextRequest, NextResponse } from "next/server"
import { readFile, access } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// MIME types for supported images
const MIME_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const pathSegments = (await params).path

    if (!pathSegments || pathSegments.length < 2) {
        return new NextResponse("Invalid path", { status: 400 })
    }

    const [userId, ...filenameParts] = pathSegments
    const filename = filenameParts.join("/")

    // Validate filename to prevent path traversal attacks
    if (filename.includes("..") || filename.startsWith("/")) {
        return new NextResponse("Invalid path", { status: 400 })
    }

    // Build the file path (private uploads directory, outside public/)
    const filePath = path.join(process.cwd(), "uploads", userId, filename)
    const ext = path.extname(filename).toLowerCase()

    // Check if file type is allowed
    if (!MIME_TYPES[ext]) {
        return new NextResponse("Invalid file type", { status: 400 })
    }

    // Check if file exists
    try {
        await access(filePath)
    } catch {
        return new NextResponse("Not found", { status: 404 })
    }

    // Get the session to check authentication
    const session = await auth()
    const requestUrl = `/api/images/${userId}/${filename}`

    // Determine access level:
    // 1. Owner always has access to their own images
    // 2. Public profile images (avatar/banner stored in DB) are publicly accessible
    // 3. Other users' library images require authentication as the owner

    const isOwner = session?.user?.id === userId

    if (!isOwner) {
        // Check if this image is being used as a public profile image
        const userWithImage = await prisma.user.findFirst({
            where: {
                id: userId,
                OR: [
                    { avatarUrl: requestUrl },
                    { bannerUrl: requestUrl },
                ]
            }
        })

        if (!userWithImage) {
            // Not a public profile image - check if viewer is logged in as owner
            if (!session?.user?.id) {
                return new NextResponse("Unauthorized", { status: 401 })
            }
            // Logged in but not the owner
            return new NextResponse("Forbidden", { status: 403 })
        }
        // It's a public profile image, allow access
    }

    // Read and serve the file
    try {
        const fileBuffer = await readFile(filePath)

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": MIME_TYPES[ext],
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        })
    } catch (error) {
        console.error("Error serving image:", error)
        return new NextResponse("Error reading file", { status: 500 })
    }
}

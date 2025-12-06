import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 })
        }

        console.log("Processing upload:", file.name, file.size, file.type)

        const buffer = Buffer.from(await file.arrayBuffer())
        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filename = Date.now() + "_" + safeName

        // Save to PRIVATE uploads directory (outside public/)
        const uploadDir = path.join(process.cwd(), "uploads", session.user.id)
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (e) {
            // Ignore if exists
        }

        await writeFile(path.join(uploadDir, filename), buffer)
        console.log("File saved to:", path.join(uploadDir, filename))

        // Return URL pointing to the secure image API route
        return NextResponse.json({ url: `/api/images/${session.user.id}/${filename}` })
    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Error uploading file: " + (error as Error).message }, { status: 500 })
    }
}


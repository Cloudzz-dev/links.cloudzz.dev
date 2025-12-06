import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Starting image URL migration...")

    // Find all users with avatarUrl or bannerUrl starting with /uploads/
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { avatarUrl: { startsWith: "/uploads/" } },
                { bannerUrl: { startsWith: "/uploads/" } },
            ]
        }
    })

    console.log(`Found ${users.length} users to update`)

    for (const user of users) {
        const updates: any = {}

        if (user.avatarUrl && user.avatarUrl.startsWith("/uploads/")) {
            updates.avatarUrl = user.avatarUrl.replace("/uploads/", "/api/images/")
        }

        if (user.bannerUrl && user.bannerUrl.startsWith("/uploads/")) {
            updates.bannerUrl = user.bannerUrl.replace("/uploads/", "/api/images/")
        }

        if (Object.keys(updates).length > 0) {
            await prisma.user.update({
                where: { id: user.id },
                data: updates
            })
            console.log(`Updated user ${user.username}`)
        }
    }

    console.log("Migration complete")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

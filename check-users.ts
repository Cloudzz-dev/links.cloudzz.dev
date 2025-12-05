import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const users = await prisma.user.findMany({
        include: { links: true }
    })
    console.log("Users found:", users.length)
    users.forEach((u: { id: string; username: string; email: string; links: { title: string; url: string }[] }) => {
        console.log(`- ID: ${u.id}, Username: '${u.username}', Email: '${u.email}'`)
        console.log(`  Links: ${u.links.length}`)
        u.links.forEach((l: { title: string; url: string }) => console.log(`    - ${l.title} (${l.url})`))
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

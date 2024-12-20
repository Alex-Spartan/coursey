const { PrismaClient } = require('@prisma/client')

const { config } = require('dotenv');
config({ path: '.env.local' });


const db = new PrismaClient();
async function main() {
  // ... you will write your Prisma Client queries here
  const course = await db.user.create({
    data: {
      id: "1",
      email: "hrushikesh"
    }
  })
  console.log(course)
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
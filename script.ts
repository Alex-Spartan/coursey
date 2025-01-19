const { PrismaClient } = require('@prisma/client')

const { config } = require('dotenv');
config({ path: '.env.local' });


const db = new PrismaClient();
console.log(process.env.DATABASE_URL);

async function main() {
  // ... you will write your Prisma Client queries here
  const category = await db.category.createMany({
    data: [
    { name: "Music" }, 
    { name: "Photography" },
    { name: "Fitness" },
    { name: "Engineering" },
    { name: "Filming" },
    { name: "Accounting" },
    { name: "Computer Science" },
  ]})
  console.log(category);
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
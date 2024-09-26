import { v4 as uuid } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  const id = uuid();
  await prisma.user.create({
    data: {
      id: id,
      name: process.env.USERNAME,
      password: process.env.USERPASS,
    },
  });
  console.log('User created with id ' + id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
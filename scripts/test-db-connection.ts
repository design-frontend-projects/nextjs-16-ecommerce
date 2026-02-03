import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    console.log('Testing Prisma connection with parallelism...');
    const where = { is_active: true };
    const [count, categories, products] = await Promise.all([
      prisma.products.count({ where }),
      prisma.categories.findMany({ take: 5 }),
      prisma.products.findMany({ take: 5, where }),
    ]);
    console.log(
      `Success! Count: ${count}, Cats: ${categories.length}, Prods: ${products.length}`
    );
  } catch (e) {
    console.error('Connection failed with concurrent queries:', e);
  }
}

main();

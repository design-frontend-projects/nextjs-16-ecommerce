import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 1. Create the Pool and Adapter for Prisma 7
const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Explicitly set SSL to ensure connection to Supabase works
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

// 2. Singleton Function
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

// 3. Global Object Handling (prevents hot-reload crashes in development)
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const globalForPrisma = global as typeof global & {
  prisma: undefined | ReturnType<typeof prismaClientSingleton>;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

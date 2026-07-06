# Prisma 7 Configuration Guide

Complete setup and usage guide for Prisma 7 with PostgreSQL adapter in Next.js 16.

## Overview

This project uses:
- **Prisma 7** - Latest ORM
- **PostgreSQL Adapter** - For connection pooling with Prisma
- **PgBouncer/Pool** - Connection management
- **Next.js 16** - Full-stack framework

## Installation

### 1. Install Dependencies

```bash
npm install @prisma/client @prisma/adapter-pg pg dotenv
# or
pnpm add @prisma/client @prisma/adapter-pg pg dotenv
```

### 2. Install Dev Dependencies

```bash
npm install -D prisma
# or
pnpm add -D prisma
```

## Configuration Files

### prisma.config.ts

Defines Prisma configuration:

```typescript
import 'dotenv/config';
import { defineConfig } from '@prisma/internals';

export default defineConfig({
  schema: './prisma/schema.prisma',
  seed: './prisma/seed.ts',
  migrations: {
    path: './prisma/migrations',
  },
});
```

### src/lib/prisma.ts

Singleton pattern for Prisma client with connection pooling:

```typescript
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Create Pool and Adapter for Prisma 7
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Singleton function
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Global handling for development hot-reloads
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
```

## Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"

# Optional: Direct database URL (for migrations)
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"

# Node environment
NODE_ENV=development
```

## Prisma Schema

### Basic Structure

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  password      String?
  isAdmin       Boolean   @default(false)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}
```

## Usage

### Import and Use

```typescript
// In Server Components or API Routes
import { prisma } from '@/lib/prisma';

// Query
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Create
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    name: 'John Doe',
  }
});

// Update
const updated = await prisma.user.update({
  where: { id: 'user-id' },
  data: { name: 'Jane Doe' }
});

// Delete
await prisma.user.delete({
  where: { id: 'user-id' }
});
```

### In Client Components

DO NOT use Prisma directly in client components. Instead, create API routes:

```typescript
// src/app/api/users/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
```

## Prisma Commands

### Database Migration

Create a migration after schema changes:

```bash
pnpx prisma migrate dev --name add_user_model
```

### Generate Prisma Client

Generate the Prisma client after schema changes:

```bash
pnpx prisma generate
```

### Prisma Studio

View and edit data in a UI:

```bash
pnpx prisma studio
```

### Format Schema

Format the Prisma schema file:

```bash
npx prisma format
```

### Database Push (Development)

Push schema to database without creating migrations:

```bash
npx prisma db push
```

### Database Reset

Reset database to initial state:

```bash
npx prisma migrate reset
```

## Seeding Database

### Create Seed File

Create `prisma/seed.ts`:

```typescript
import { prisma } from '@/lib/prisma';

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      isAdmin: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      isAdmin: false,
    },
  });

  console.log('Database seeded successfully:', { user1, user2 });
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
```

### Update package.json

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts"
  }
}
```

### Run Seed

```bash
pnpx prisma db seed
```

## Common Issues & Fixes

### Issue: "Cannot find module '@/generated/prisma/client'"

**Solution:**
```bash
pnpx prisma generate
```

### Issue: "Connection timeout"

**Solution:** Update `DATABASE_URL` and ensure PostgreSQL is running

### Issue: "Prisma schema not found"

**Solution:** Ensure `prisma/schema.prisma` exists and path is correct in `prisma.config.ts`

### Issue: "Adapter not compatible with this version"

**Solution:** Update Prisma packages:
```bash
npm install @prisma/client@latest @prisma/adapter-pg@latest prisma@latest
```

### Issue: "Too many connections"

**Solution:** Update Pool configuration in `src/lib/prisma.ts`:

```typescript
const pool = new Pool({
  connectionString,
  max: 5, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Development Workflow

### 1. Update Schema

Edit `prisma/schema.prisma`

### 2. Create Migration

```bash
pnpx prisma migrate dev --name describe_changes
```

### 3. Generate Client

```bash
pnpx prisma generate
```

### 4. Test

Use Prisma Studio or API routes to verify

### 5. Commit

Commit both schema and migration files

## Production Deployment

### Before Deploying

1. Set `DATABASE_URL` environment variable
2. Run migrations:

```bash
npx prisma migrate deploy
```

3. Set `NODE_ENV=production`
4. Verify connection pooling settings

### Connection Pool for Production

```typescript
const pool = new Pool({
  connectionString,
  max: 20, // Increase for production
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
```

## Type Generation

Prisma automatically generates types. Access them:

```typescript
import type { User, Product } from '@/generated/prisma/client';

const user: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John',
  image: null,
  password: null,
  isAdmin: false,
  emailVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Advanced: Custom Queries

### Raw SQL

```typescript
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE isAdmin = true
`;
```

### Transactions

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'user@example.com' } }),
  prisma.post.create({ 
    data: { title: 'Hello', content: 'World' }
  }),
]);
```

## Best Practices

1. **Always use the singleton** - Import from `@/lib/prisma`
2. **Never use Prisma in client components** - Create API routes instead
3. **Handle errors gracefully** - Try-catch in all queries
4. **Disconnect in cleanup** - Use `prisma.$disconnect()` when needed
5. **Use transactions for related updates** - Ensures data consistency
6. **Index frequently queried fields** - For performance
7. **Avoid N+1 queries** - Use `include` or `select` for relations

## Troubleshooting

### Check Prisma Status

```bash
npx prisma info
```

### Validate Schema

```bash
npx prisma validate
```

### View Database Connection

```bash
npx prisma db execute --stdin < query.sql
```

### Debug Logging

Set debug logs in `src/lib/prisma.ts`:

```typescript
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });
};
```

## References

- [Prisma 7 Docs](https://www.prisma.io/docs)
- [Prisma PostgreSQL Adapter](https://www.prisma.io/docs/orm/overview/databases/postgresql#prisma-adapter)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

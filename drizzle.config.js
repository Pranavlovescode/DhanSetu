import { defineConfig } from "drizzle-kit";
import 'dotenv/config';
export default defineConfig({
  out:'./drizzle',
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema.js',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
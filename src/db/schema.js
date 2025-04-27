// import { integer, text, uuid } from "drizzle-orm/gel-core";
import { pgSchema, pgTable, varchar ,uuid,text,integer,references, timestamp} from "drizzle-orm/pg-core";

export const userSchema = pgSchema('userSchema')

export const genders = userSchema.enum('gender',['male','female','others'])
export const roles = userSchema.enum('role',['user','employee','admin'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  full_name: varchar('full_name',{length:500}).notNull(),
  phone: integer('phone_number').notNull(),
  age:integer('age').notNull(),
  email:text('email').unique(),
  role:roles('role').default('user').notNull(),
  gender:genders('gender').default('others').notNull()
})

export const userBankAccounts = pgTable('user_bank_accounts',{
  id: uuid('id').defaultRandom().primaryKey(),
  pan_number:text('pan_number'),
  balance:integer('balance').default(0),
  account_holder:uuid().references(()=>users.id)
})


export const userTransactions = pgTable('user_transactions',{
  transaction_id: uuid('transaction_id').defaultRandom().primaryKey(),
  sender:uuid().references(()=>users.id),
  receiver:uuid().references(()=>users.id),
  timestamp:timestamp().defaultNow(),
  amount:integer('amount').notNull().default(0)
})
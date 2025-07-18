// import { integer, text, uuid } from "drizzle-orm/gel-core";
import { pgSchema, pgTable, varchar ,uuid,text,integer,references, timestamp} from "drizzle-orm/pg-core";

export const userSchema = pgSchema('userEnums')

export const genders = userSchema.enum('gender',['male','female','others'])
export const roles = userSchema.enum('role',['user','employee','admin'])

export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  full_name: varchar('full_name',{length:500}).notNull(),
  phone: integer('phone_number'),
  age:integer('age'),
  email:text('email').unique(),
  role:roles('role').default('user'),
  gender:genders('gender').default('others')
})

export const userBankAccounts = pgTable('user_bank_accounts',{
  account_id: uuid('account_id').defaultRandom().primaryKey(),
  pan_number:text('pan_number'),
  balance:integer('balance').default(0),
  account_holder:text().references(()=>users.id)
})


export const userTransactions = pgTable('user_transactions',{
  transaction_id: uuid('transaction_id').defaultRandom().primaryKey(),
  description:text('description').default(''),
  sender:text().references(()=>users.id),
  receiver:text().references(()=>users.id),
  timestamp:timestamp().defaultNow(),
  amount:integer('amount').notNull().default(0)
})

export const investmentProfile = pgTable('user_investment_profile', {
  profile_id: uuid('profile_id').defaultRandom().primaryKey(),
  tolerance_level: text('tolerance_level').default(''),
  experience: text('experience').default(''),
  goal: text('goal').default(''),
  timeHorizon: text('time_horizon').default(''),
  monthlyInvestmentAmount: integer('monthly_investment_amount'),
  sector: text('sector').array(),
  user_id: text('user_id').references(() => users.id)
});
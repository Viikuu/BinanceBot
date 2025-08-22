import z from "zod"

const envSchema = z.object({
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
})

export const env = envSchema.parse(process.env);
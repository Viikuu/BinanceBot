import z from "zod"

const envSchema = z.object({
  PORT: z.string().default('3000'),
  BINANCE_API_URL: z.string().default('https://api.binance.com'),
})

export const env = envSchema.parse(process.env);
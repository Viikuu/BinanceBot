import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config';
import { error } from 'console';

async function main() {
  const app = express();

  app.use(express.json());
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(env.PORT, () => {
    console.log('Server is running on http://localhost:3000');
  })
}

main().catch(err => {
  console.error('Error starting the application', err);
  process.exit(1);
});
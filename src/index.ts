import 'dotenv/config';
import express from 'express';
import { env } from './config';
import TradesRouter from './routes/trades';

async function main() {
  const app = express();

  app.use(express.json());

  app.use('/trades', TradesRouter);

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
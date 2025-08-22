
## Start instructions

1. Copy '.env-example' into '.env'
2. Install dependencies using 'npm install'
3. Start app using 'npm run dev'
  
## Testing instructions

1. Setup environment using start instructions
2. Run tests using 'npm test'

Available analyzis endpoint which fetches data for period for given period of time as iso dates passed throught query params with cryptocurrency symbol:

```
GET http://localhost:3000/trades/fetch-trades?symbol=BTCUSDT&startTime=2025-08-21T10:37:39Z&endTime=2025-08-22T10:20:00Z
```

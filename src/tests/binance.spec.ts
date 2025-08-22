const getMock = jest.fn();

jest.mock('axios', () => {
  return {
    create: () => ({
      get: getMock,
    }),
  };
});

describe('trades module', () => {
  test('dummy test', () => {
    expect(true).toBe(true);
  });

  const loadModule = async () => {
    return await import('../binance');
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTrades function', () => {
    test('should fetch trades for a valid symbol and date range', async () => {
      const fetched = [{
        a: 1,
        p: '10000',
        q: '0.00066000',
        f: 5175993641,
        l: 5175993641,
        T: 1755772687719,
        m: false,
        M: true
      },
      {
        a: 1,
        p: '10001',
        q: '0.08196000',
        f: 5175993642,
        l: 5175993642,
        T: 1755772687754,
        m: true,
        M: true
      }];
      getMock.mockResolvedValue({ data: fetched });

      const { fetchTrades } = await loadModule();

      const res = await fetchTrades('BTCUSDT', 1755772687000, 1755772688000);

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith('/api/v3/aggTrades', {
        params: {
          symbol: 'BTCUSDT',
          startTime: 1755772687000,
          endTime: 1755772688000,
          limit: 1000,
        },
      });

      expect(res).toEqual([
        {
          id: 1,
          price: 10000,
          quantity: 0.00066,
          firstTradeId: 5175993641,
          lastTradeId: 5175993641,
          timestamp: 1755772687719,
          isBuyerMaker: false,
          isBestMatch: true
        },
        {
          id: 1,
          price: 10001,
          quantity: 0.08196,
          firstTradeId: 5175993642,
          lastTradeId: 5175993642,
          timestamp: 1755772687754,
          isBuyerMaker: true,
          isBestMatch: true
        }
      ]);
    });

    test('should throw an error for an invalid symbol', async () => {
      const error = `Error fetching trades from Binance`;
      getMock.mockRejectedValue(new Error(error));

      const { fetchTrades } = await loadModule();

      await expect(fetchTrades('INVALID', 1755772687000, 1755772688000)).rejects.toThrow(error);

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith('/api/v3/aggTrades', {
        params: {
          symbol: 'INVALID',
          startTime: 1755772687000,
          endTime: 1755772688000,
          limit: 1000,
        },
      });


    });
  });

  describe('analizeTrades function', () => {
    test('should analyze trades correctly', async () => {
      const { analizeTrades } = await loadModule();

      const trades = [{
        "id": 1,
        "price": 10,
        "quantity": 1,
        "firstTradeId": 1,
        "lastTradeId": 1,
        "timestamp": 1755772660000,
        "isBuyerMaker": false,
        "isBestMatch": true
      },
      {
        "id": 2,
        "price": 9,
        "quantity": 1,
        "firstTradeId": 5175993286,
        "lastTradeId": 5175993286,
        "timestamp": 1755772660200,
        "isBuyerMaker": false,
        "isBestMatch": true
      },
      {
        "id": 3,
        "price": 11,
        "quantity": 1,
        "firstTradeId": 5175993287,
        "lastTradeId": 5175993287,
        "timestamp": 1755772660263,
        "isBuyerMaker": true,
        "isBestMatch": true
      }
      ];

      const out = analizeTrades(trades);

      expect(out).toEqual({
        startTimeStamp: 1755772660000,
        endTimeTimestamp: 1755772660263,
        totalTrades: 3,
        minValueTrade: {
          id: 2,
          price: 9,
          quantity: 1,
          firstTradeId: 5175993286,
          lastTradeId: 5175993286,
          timestamp: 1755772660200,
          isBuyerMaker: false,
          isBestMatch: true
        },
        maxValueTrade: {
          id: 3,
          price: 11,
          quantity: 1,
          firstTradeId: 5175993287,
          lastTradeId: 5175993287,
          timestamp: 1755772660263,
          isBuyerMaker: true,
          isBestMatch: true
        },
        changes: [{
          startIndex: 1,
          endIndex: 2,
          direction: "decreasing",
          length: 2,
          startPrice: 10,
          endPrice: 9,
          priceChange: "-1",
          priceChangePercent: `${-1 / 10 * 100}`,
          trades: [
            {
              "id": 1,
              "price": 10,
              "quantity": 1,
              "firstTradeId": 1,
              "lastTradeId": 1,
              "timestamp": 1755772660000,
              "isBuyerMaker": false,
              "isBestMatch": true
            },
            {
              "id": 2,
              "price": 9,
              "quantity": 1,
              "firstTradeId": 5175993286,
              "lastTradeId": 5175993286,
              "timestamp": 1755772660200,
              "isBuyerMaker": false,
              "isBestMatch": true
            },
          ]
        },
        {
          startIndex: 2,
          endIndex: 3,
          direction: "increasing",
          length: 2,
          startPrice: 9,
          endPrice: 11,
          priceChange: "2",
          priceChangePercent: "22.222222222222222222",
          trades: [
            {
              "id": 2,
              "price": 9,
              "quantity": 1,
              "firstTradeId": 5175993286,
              "lastTradeId": 5175993286,
              "timestamp": 1755772660200,
              "isBuyerMaker": false,
              "isBestMatch": true
            },
            {
              "id": 3,
              "price": 11,
              "quantity": 1,
              "firstTradeId": 5175993287,
              "lastTradeId": 5175993287,
              "timestamp": 1755772660263,
              "isBuyerMaker": true,
              "isBestMatch": true
            }
          ]
        },
        ]

      });
    });
  });
})
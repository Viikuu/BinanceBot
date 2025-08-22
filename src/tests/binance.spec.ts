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
    test('should analyze trades correctly', () => {
      // This is a placeholder for an actual test.
      // You would typically provide sample trade data and check the analysis result.
      expect(true).toBe(true);
    });
  });
})
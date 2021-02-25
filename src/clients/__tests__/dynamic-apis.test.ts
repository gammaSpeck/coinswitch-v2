import { CoinSwitchDynamic } from '../CoinSwitchDynamic'
import { SANDBOX_ORDER_IDS } from '../../utils'

/**
 * With Sandbox mode API KEY, we return static mocked responses so that you can test
 * Order creation and Order status handling without creating a real order
 * and without sending any crypto.
 */
const SANDBOX_API_KEY = 't41E6v16mG6xqOUK74E2F7Py6UVng4K6n1pO3Jig'

beforeAll(() => {
  jest.setTimeout(10000)
})

const cs = new CoinSwitchDynamic({
  apiKey: SANDBOX_API_KEY,
  userIP: '1.1.1.1'
})

describe('Misc', () => {
  test('Coinswitch is an instantiable Class', () => {
    expect(cs instanceof CoinSwitchDynamic).toBe(true)
  })

  test('Coinswitch can be instantiated even without passing userIP', () => {
    const client = new CoinSwitchDynamic({
      apiKey: SANDBOX_API_KEY
    })
    expect(client instanceof CoinSwitchDynamic).toBe(true)
  })
})

describe('.getCoins() use cases', () => {
  test('Returns supported coins list on success', async () => {
    const [c1, c2] = await cs.getCoins()
    const expectedProps = ['symbol', 'name', 'isActive']

    expectedProps.forEach((p) => {
      expect(c1).toHaveProperty(p)
      expect(c2).toHaveProperty(p)
    })
  })
})

describe('.getExchangePairs() use cases', () => {
  test('Throws error when an invalid symbol is passed in either as depositCoin or destinationCoin. Eg: "lol"', async () => {
    expect(cs.getExchangePairs({ destinationCoin: 'lol' })).rejects.toThrowError(
      'Invalid symbol for destinationCoin'
    )

    expect(cs.getExchangePairs({ depositCoin: 'lol' })).rejects.toThrowError(
      'Invalid symbol for depositCoin'
    )
  })

  test('Throws error when neither depositCoin nor destinationCoin is passed', async () => {
    expect(cs.getExchangePairs({})).rejects.toThrowError(
      'At least depositCoin or destinationCoin is needed'
    )
  })

  test('Returns exchange pairs for a chosen depositCoin: btc', async () => {
    const [p1, p2] = await cs.getExchangePairs({ depositCoin: 'btc' })

    expect(p1.depositCoin).toBe('btc') // As that was sent into the input
    const expectedProps = ['depositCoin', 'destinationCoin', 'isActive']
    expectedProps.forEach((p) => {
      expect(p1).toHaveProperty(p)
      expect(p2).toHaveProperty(p)
    })
  })

  test('Returns exchange pairs for a chosen destinationCoin: btc', async () => {
    const [p1, p2] = await cs.getExchangePairs({ destinationCoin: 'btc' })

    expect(p1.destinationCoin).toBe('btc') // As that was sent into the input
    const expectedProps = ['depositCoin', 'destinationCoin', 'isActive']
    expectedProps.forEach((p) => {
      expect(p1).toHaveProperty(p)
      expect(p2).toHaveProperty(p)
    })
  })
})

describe('.getExchangeRate() use cases', () => {
  test('Throws error when an invalid symbol is passed in either as depositCoin or destinationCoin. Eg: "lol" and "btc"', async () => {
    expect(cs.getExchangeRate({ depositCoin: 'btc', destinationCoin: 'lol' })).rejects.toThrowError(
      'Invalid trade pair btc-lol'
    )

    expect(cs.getExchangeRate({ depositCoin: 'lol', destinationCoin: 'btc' })).rejects.toThrowError(
      'Invalid trade pair lol-btc'
    )
  })

  test('Throws error when you try to call it with same depositCoin and destinationCoin symbol', async () => {
    expect(cs.getExchangeRate({ depositCoin: 'btc', destinationCoin: 'btc' })).rejects.toThrowError(
      'depositCoin and destinationCoin cannot be the same'
    )
  })

  test('Throws error for custom depositCoinAmount not within range', async () => {
    expect(
      cs.getExchangeRate({
        depositCoin: 'btc',
        destinationCoin: 'eth',
        depositCoinAmount: 100000000000
      })
    ).rejects.toThrow()
  })

  test('Returns the correct exchange rate object for depositCoin: btc & destination: eth', async () => {
    const exchangeRate = (await cs.getExchangeRate({
      depositCoin: 'btc',
      destinationCoin: 'eth'
    })) as any

    const expectedProps = {
      rate: 'number',
      minerFee: 'number',
      limitMinDepositCoin: 'number',
      limitMaxDepositCoin: 'number',
      limitMinDestinationCoin: 'number',
      limitMaxDestinationCoin: 'number'
    }

    Object.entries(expectedProps).forEach(([k, v]) => {
      expect(exchangeRate).toHaveProperty(k)
      expect(typeof exchangeRate[k]).toBe(v)
    })
  })
})

describe('.createOrder() use cases', () => {
  test('Throws error when both depositCoinAmount & destinationCoinAmount is sent as inputs', async () => {
    expect(
      cs.createOrder({
        depositCoin: 'btc',
        destinationCoin: 'eth',
        depositCoinAmount: 1.1,
        destinationCoinAmount: 5,
        destinationAddress: {
          address: '0xcc1bf6b0625bc23895a47f4991fdb7862e34a563'
        }
      })
    ).rejects.toThrow('You can specify EITHER depositCoinAmount OR destinationCoinAmount')
  })

  test('Returns order object on successful creation of order', async () => {
    const order = await cs.createOrder({
      depositCoin: 'btc',
      destinationCoin: 'eth',
      depositCoinAmount: 1.1,
      destinationAddress: {
        address: '0xcc1bf6b0625bc23895a47f4991fdb7862e34a563'
      }
    })

    const expectedProps = [
      'orderId',
      'exchangeAddress',
      'expectedDepositCoinAmount',
      'expectedDestinationCoinAmount'
    ]

    expectedProps.forEach((p) => {
      expect(order).toHaveProperty(p)
    })
  })
})

describe('.getOrder() use cases', () => {
  test('Throws error when called with wrong orderId', () => {
    expect(cs.getOrderStatus('WRONG_ID')).rejects.toThrow('Invalid order id')
  })

  test('Returns successful response for multiple order statuses', async () => {
    const statuses = []
    const apiCalls = []

    for (let [k, v] of Object.entries(SANDBOX_ORDER_IDS)) {
      apiCalls.push(cs.getOrderStatus(v))
      statuses.push(k)
    }

    const responses = await Promise.all(apiCalls)
    for (let i = 0; i < responses.length; i++) expect(responses[i].status).toBe(statuses[i])
  })
})

describe('.getAllOrders() use cases', () => {
  test('Returns successful response', async () => {
    const orders = await cs.getAllOrders()
    expect(typeof orders.count).toBe('number')
    expect(typeof orders.totalCount).toBe('number')
    expect(typeof orders.isPrev).toBe('boolean')
    expect(typeof orders.isNext).toBe('boolean')
  })
})

describe('.getBulkRates() use cases', () => {
  test('Throws error when neither depositCoin nor destinationCoin is passed', async () => {
    expect(cs.getBulkRates({})).rejects.toThrowError(
      'At least depositCoin or destinationCoin is needed'
    )
  })

  test('Throws an Error when you pass an invalid symbol as depositCoin or destinationCoin', async () => {
    expect(cs.getBulkRates({ depositCoin: 'xxx' })).rejects.toThrow(
      'Invalid symbol for depositCoin'
    )

    expect(cs.getBulkRates({ destinationCoin: 'xxx' })).rejects.toThrow(
      'Invalid symbol for destinationCoin'
    )
  })

  test('Returns successful response for correct parameters', async () => {
    const apiCalls = [
      cs.getBulkRates({ depositCoin: 'btc' }),
      cs.getBulkRates({ destinationCoin: 'eth' }),
      cs.getBulkRates({ depositCoin: 'btc', destinationCoin: 'eth' })
    ]

    const responses = await Promise.all(apiCalls)

    responses.forEach((res) => {
      expect(Array.isArray(res)).toBe(true)
    })

    // If both dep and des specified, array will have only one rate
    expect(responses[2].length).toBe(1)
  })
})

describe('.getBulkRatesForMultiPairs() use cases', () => {
  test('Returns empty array for invalid keys', async () => {
    const bulkRates = await cs.getBulkRatesForMultiPairs([
      { depositCoin: 'xxx', destinationCoin: 'yyy' }
    ])

    expect(bulkRates.length).toBe(0)
  })

  test('Returns successful response for correct parameters', async () => {
    const inputMultiPairs = [
      { depositCoin: 'btc', destinationCoin: 'eth' },
      { depositCoin: 'eth', destinationCoin: 'xrp' }
    ]
    const bulkRates = await cs.getBulkRatesForMultiPairs(inputMultiPairs)

    expect(bulkRates.length).toBe(inputMultiPairs.length)
  })
})

import axios, { AxiosInstance } from 'axios'

import assert from 'assert'

import {
  CoinSwitchApiRes,
  CoinSwitchClient,
  Coin,
  CoinPair,
  ExchangeRate,
  CoinSwitchError,
  FPCheckPairs,
  FPGenerateOffer,
  FPCreateOrder,
  Order,
  OrderStatus,
  AllOrders,
  BulkRatePair,
  DepositAndDestCoin
} from '../interfaces'

/** Used to throw error when CoinSwitchApiRes returns an error response */
const formatResponse = (response: string) => {
  const res = JSON.parse(response) as CoinSwitchApiRes
  if (!res.success) {
    const e = new Error(res.error || res.msg) as CoinSwitchError
    e.code = res.code
    throw e
  }
  return res
}

const urls = {
  getCoins: '/coins',
  getExchangePairs: '/pairs',
  getExchangeRate: '/rate',
  createOrder: '/order',
  getOrderById: '/order',
  getAllOrders: '/orders',
  getBulkRates: '/bulk-rate'
}

export class CoinSwitchDynamic {
  host = 'https://api.coinswitch.co'
  version = 'v2'

  axios: AxiosInstance

  /** Private API Key and currentUserIP (Default 1.1.1.1)*/
  constructor({ apiKey, userIP = '1.1.1.1' }: CoinSwitchClient) {
    assert(apiKey, 'apiKey is required.')

    this.axios = axios.create({
      baseURL: `${this.host}/${this.version}`,
      headers: {
        'x-api-key': apiKey,
        'x-user-ip': userIP,
        'Content-Type': 'application/json'
      },
      transformResponse: formatResponse
    })
  }

  private async get(endpoint: string) {
    const res = (await this.axios.get(endpoint)).data as CoinSwitchApiRes
    return res.data // This Data is from the actual CoinSwitchApiRes
  }

  private async post(endpoint: string, body: object) {
    const res = (await this.axios.post(endpoint, body)).data as CoinSwitchApiRes
    return res.data // This Data is from the actual CoinSwitchApiRes
  }

  /**  Get all coins */
  async getCoins() {
    return (await this.get(urls.getCoins)) as Coin[]
  }

  /** Get exchange pairs for a chosen depositCoin or destinationCoin */
  async getExchangePairs({ depositCoin, destinationCoin }: FPCheckPairs) {
    if (!depositCoin && !destinationCoin)
      throw new Error('At least depositCoin or destinationCoin is needed')

    return (await this.post(urls.getExchangePairs, {
      depositCoin,
      destinationCoin
    })) as CoinPair[]
  }

  /** Generate an exchange offer for a coin pair */
  async getExchangeRate({ depositCoin, destinationCoin, depositCoinAmount }: FPGenerateOffer) {
    if (depositCoin === destinationCoin)
      throw new Error('depositCoin and destinationCoin cannot be the same')

    return (await this.post(urls.getExchangeRate, {
      depositCoin,
      destinationCoin,
      depositCoinAmount
    })) as ExchangeRate
  }

  /** Create an Order by spending one type of coin to purchase other type of coin*/
  async createOrder(data: FPCreateOrder) {
    if (data.depositCoinAmount && data.destinationCoinAmount)
      throw new Error('You can specify EITHER depositCoinAmount OR destinationCoinAmount')
    return (await this.post(urls.createOrder, data)) as Order
  }

  /** Get status for an Order ID */
  async getOrderStatus(orderId: string) {
    return (await this.get(`${urls.getOrderById}/${orderId}`)) as OrderStatus
  }

  /** Get all orders created with your API Key */
  async getAllOrders() {
    return (await this.get(urls.getAllOrders)) as AllOrders
  }

  /** Generate Bulk exchange offers for a coin or a pair of coins. */
  async getBulkRates({ depositCoin, destinationCoin }: FPCheckPairs) {
    if (!depositCoin && !destinationCoin)
      throw new Error('At least depositCoin or destinationCoin is needed')

    return (await this.post(urls.getBulkRates, {
      depositCoin,
      destinationCoin
    })) as BulkRatePair[]
  }

  /** Generate Bulk exchange offers for several pairs at once.
   * The thing to note is that the API does not inform about invalid pairs or if CoinSwitch
   * cannot provide you with an offer for a particular coin pair currently.
   * If incorrect pairs are sent, an empty array shall be returned.
   */
  async getBulkRatesForMultiPairs(data: DepositAndDestCoin[]) {
    return (await this.post(urls.getBulkRates, data)) as BulkRatePair[]
  }
}

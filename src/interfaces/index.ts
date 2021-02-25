import { SANDBOX_ORDER_IDS } from '../utils'

export interface CoinSwitchClient {
  apiKey: string
  userIP?: string
}

export interface Coin {
  name: string
  symbol: string
  isActive: boolean
  isFiat: false
  logoUrl: string
  parentCode: string | null
  addressAdditionalData: string | null
}

export interface CoinSwitchApiRes {
  success: boolean
  code: string
  data: any | null
  error: string
  msg?: string
}

export interface CoinPair {
  depositCoin: string
  destinationCoin: string
  isActive: boolean
}

export interface ExchangeRate {
  rate: number
  minerFee: number
  limitMinDepositCoin: number
  limitMaxDepositCoin: number
  limitMinDestinationCoin: number
  limitMaxDestinationCoin: number
  depositCoinAmount?: number
}

export interface CoinSwitchError extends Error {
  code: string
}

export interface FPCheckPairs {
  depositCoin?: string
  destinationCoin?: string
}

export interface DepositAndDestCoin {
  depositCoin: string
  destinationCoin: string
}

export interface FPGenerateOffer extends DepositAndDestCoin {
  depositCoinAmount?: number
}

interface WalletAddress {
  address: string
  tag?: string | null
}

export interface FPCreateOrder extends FPGenerateOffer {
  /** Amount of depositCoin that will be sent to CoinSwitch */
  destinationCoinAmount?: number
  /** JSON FIELD - Address to which destinationCoin will be sent */
  destinationAddress: WalletAddress
  /** JSON FIELD - Address to which depositCoin will be refunded in case of unforeseen errors */
  refundAddress?: WalletAddress
  /**
   * Endpoint where CoinSwitch will be notifying you about the order status changes whenever your order goes through a new stage. CoinSwitch will be notifying you via a post call on this url with complete order details.
   */
  callbackUrl?: string
}

export interface Order {
  orderId: string
  exchangeAddress: WalletAddress
  expectedDepositCoinAmount: number
  expectedDestinationCoinAmount: number
}

type StatusTypes = keyof typeof SANDBOX_ORDER_IDS

export interface OrderStatus {
  orderId: string
  exchangeAddress: WalletAddress
  destinationAddress: WalletAddress
  createdAt: number // Date number
  status: StatusTypes
  inputTransactionHash: null | string
  outputTransactionHash: null | string
  depositCoin: string
  destinationCoin: string
  depositCoinAmount: null | number
  destinationCoinAmount: null | number
  validTill: string // Date string
  userReferenceId: string
  expectedDestinationCoinAmount: number
  expectedDepositCoinAmount: number
}

interface AllOrdersItem extends OrderStatus {
  clientFee: number
  callbackUrl: string
}

export interface AllOrders {
  count: number
  items: AllOrdersItem[]
  totalCount: number
  isPrev: boolean
  isNext: boolean
}

export interface BulkRatePair {
  depositCoin: string
  destinationCoin: string
  rate: number
  minerFee: number
  limitMinDepositCoin: number
  limitMaxDepositCoin: number
  limitMinDestinationCoin: number
  limitMaxDestinationCoin: number
}

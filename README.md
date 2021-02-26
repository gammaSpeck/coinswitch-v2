# coinswitch-v2 [![GitHub license](https://img.shields.io/github/license/gammaSpeck/coinswitch-v2)](https://github.com/gammaSpeck/coinswitch-v2/blob/master/LICENSE) ![GitHub top language](https://img.shields.io/github/languages/top/gammaSpeck/coinswitch-v2) ![David](https://img.shields.io/david/gammaSpeck/coinswitch-v2)

> Browser and Node.js [Coinswitch.co](https://developer.coinswitch.co/reference) API v2 client

Easily exchange crypto coins with few lines of code.

<br>

## Install

    npm install --save coinswitch-v2

<br>

## Usage

```javascript
/** import { CoinSwitchDynamic } from 'coinswitch-v2' */ // Typescript import
const { CoinSwitchDynamic } = require('coinswitch-v2')

;(async () => {
  const cs = new CoinSwitchDynamic({
    apiKey: '<YOUR API KEY>',
    userIP: '<YOUR IP>' // Default is 1.1.1.1
  })

  // Get all coins you can trade
  const coins = await cs.getCoins()
  console.log(coins)

  // Generate an exchange offer for for a coin pair
  const rate = await cs.getExchangeRate({
    depositCoin: 'btc',
    destinationCoin: 'eth',
    depositCoinAmount: 0.03
  })
  console.log(rate)

  // Make a trade order
  const order = await cs.createOrder({
    depositCoin: 'btc',
    destinationCoin: 'eth',
    depositCoinAmount: 0.03,
    destinationAddress: {
      address: '0xcc1bf6b0625bc23895a47f4991fdb7862e34a563'
    },
    refundAddress: {
      address: '0xcc1bf6b0625bc23895a47f4991fdb7862e34a563'
    }
  })

  console.log(order)
})()
```

**NB**: Addresses must be specified as a JS Object like `{address: "...", tag: "..."}`

<br>

### API KEY

**Get your _api-key_ from the [coinswitch API page](https://developer.coinswitch.co/reference#api-keys-1)**.

<br>

## Example

For more examples look into the `__tests__` folder on GitHub.

## Test

    npm test

# License

MIT

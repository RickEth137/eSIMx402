import { wrap } from "@faremeter/fetch"
import { createPaymentHandler } from "@faremeter/payment-solana/exact"
import { Connection, PublicKey } from "@solana/web3.js"
import { WalletAdapter } from "@solana/wallet-adapter-base"

// USDC Mint address on devnet
const USDC_MINT_DEVNET = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")

// USDC Mint address on mainnet-beta
const USDC_MINT_MAINNET = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

class X402PaymentService {
  private connection: Connection
  private usdcMint: PublicKey
  private fetchWithPayer?: typeof fetch

  constructor(connection: Connection, network: 'devnet' | 'mainnet-beta' = 'devnet') {
    this.connection = connection
    this.usdcMint = network === 'mainnet-beta' ? USDC_MINT_MAINNET : USDC_MINT_DEVNET
  }

  initializePaymentHandler(walletAdapter: WalletAdapter) {
    if (!walletAdapter || !walletAdapter.connected) {
      throw new Error('Wallet not connected')
    }

    // Create the payment handler
    const paymentHandler = createPaymentHandler(
      walletAdapter as any, // Type assertion for compatibility
      this.usdcMint, 
      this.connection
    )

    // Wrap fetch with payment capability
    this.fetchWithPayer = wrap(fetch, {
      handlers: [paymentHandler]
    })

    return this.fetchWithPayer
  }

  // Make a paid API call to our backend
  async purchaseDataPlan(bundleName: string, quantity: number = 1) {
    if (!this.fetchWithPayer) {
      throw new Error('Payment handler not initialized. Connect wallet first.')
    }

    try {
      // This will trigger x402 payment flow if required
      const response = await this.fetchWithPayer('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundleName,
          quantity
        })
      })

      if (!response.ok) {
        throw new Error(`Purchase failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('x402 payment error:', error)
      throw error
    }
  }

  // Helper method to check if payment handler is ready
  isReady(): boolean {
    return !!this.fetchWithPayer
  }

  // Calculate USD price for Solana payment
  static convertUSDToSOL(usdPrice: number, solPrice: number): number {
    return usdPrice / solPrice
  }

  // Convert USD cents to USDC (6 decimals)
  static convertCentsToUSDC(cents: number): number {
    return (cents / 100) * Math.pow(10, 6) // Convert to USDC micro-units
  }
}

export { X402PaymentService }
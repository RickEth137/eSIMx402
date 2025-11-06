'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { X402PaymentService } from '@/lib/x402-payment'
import { DataBundle } from '@/types'

interface PurchaseState {
  loading: boolean
  error: string | null
  success: boolean
  orderReference?: string
  qrCodeUrl?: string
}

export function useX402Payment() {
  const { wallet, connected, publicKey } = useWallet()
  const { connection } = useConnection()
  const [paymentService, setPaymentService] = useState<X402PaymentService | null>(null)
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    loading: false,
    error: null,
    success: false
  })

  // Initialize payment service when wallet connects
  useEffect(() => {
    if (connected && wallet?.adapter && connection) {
      try {
        const service = new X402PaymentService(
          connection,
          process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet-beta'
        )
        service.initializePaymentHandler(wallet.adapter)
        setPaymentService(service)
      } catch (error) {
        console.error('Failed to initialize payment service:', error)
        setPurchaseState(prev => ({
          ...prev,
          error: 'Failed to initialize payment system'
        }))
      }
    } else {
      setPaymentService(null)
    }
  }, [connected, wallet, connection])

  const purchaseDataPlan = useCallback(async (bundle: DataBundle, quantity: number = 1) => {
    if (!paymentService || !connected) {
      setPurchaseState({
        loading: false,
        error: 'Wallet not connected or payment service not ready',
        success: false
      })
      return
    }

    setPurchaseState({
      loading: true,
      error: null,
      success: false
    })

    try {
      // Make the x402 payment and purchase
      const result = await paymentService.purchaseDataPlan(bundle.name, quantity)
      
      setPurchaseState({
        loading: false,
        error: null,
        success: true,
        orderReference: result.order?.orderReference,
        qrCodeUrl: result.qrCodeUrl
      })

      return result
    } catch (error) {
      console.error('Purchase failed:', error)
      setPurchaseState({
        loading: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
        success: false
      })
      throw error
    }
  }, [paymentService, connected])

  const calculatePaymentAmount = useCallback((bundle: DataBundle, quantity: number = 1) => {
    // Bundle price is already in USD, convert to cents and apply x402 markup (20%)
    const basePrice = bundle.price * quantity * 100 // Convert to cents
    return Math.round(basePrice * 1.2) // Apply 20% markup
  }, [])

  const resetPurchaseState = useCallback(() => {
    setPurchaseState({
      loading: false,
      error: null,
      success: false
    })
  }, [])

  return {
    // State
    connected,
    publicKey,
    isReady: !!paymentService && connected,
    purchaseState,
    
    // Actions
    purchaseDataPlan,
    calculatePaymentAmount,
    resetPurchaseState,
    
    // Utils
    service: paymentService
  }
}
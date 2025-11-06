'use client'

import { DataBundle } from '@/types'
import { formatBytes, formatPrice, formatDuration, getCountryFlag } from '@/lib/utils'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useX402Payment } from '@/hooks/useX402Payment'
import { Wifi, Clock, MapPin, Zap, ShoppingCart, Check, AlertCircle } from 'lucide-react'

interface DataPlanCardProps {
  bundle: DataBundle
}

export function DataPlanCard({ bundle }: DataPlanCardProps) {
  const { connected } = useWallet()
  const { 
    isReady, 
    purchaseState, 
    purchaseDataPlan, 
    calculatePaymentAmount,
    resetPurchaseState 
  } = useX402Payment()

  const handlePurchase = async () => {
    if (!connected || !isReady) return
    
    try {
      resetPurchaseState()
      const result = await purchaseDataPlan(bundle, 1)
      
      if (result?.success) {
        // Show success state - could trigger a modal or notification
        console.log('Purchase successful:', result)
      }
    } catch (error) {
      console.error('Purchase failed:', error)
    }
  }

  const primaryCountry = bundle.countries[0]
  const additionalCountries = bundle.countries.length - 1
  const paymentAmount = calculatePaymentAmount(bundle, 1)

  // Enhanced flag display for multiple countries
  const flagsToShow = bundle.countries.slice(0, 3)
  const remainingCountries = bundle.countries.length - flagsToShow.length

  const getCountryFlagSafe = (iso: string): string => {
    if (!iso || iso.length !== 2) return '🌍'
    try {
      return getCountryFlag(iso)
    } catch (error) {
      return '🌍'
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300 group h-full flex flex-col">
      {/* Header with Multiple Flags */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Country Flags Row */}
          <div className="flex items-center space-x-2 mb-2">
            {flagsToShow.map((country, index) => (
              <div key={country.iso} className="relative group/flag">
                <span 
                  className="text-xl cursor-help transition-transform hover:scale-110"
                  title={country.name}
                >
                  {getCountryFlagSafe(country.iso)}
                </span>
                {/* Mini tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover/flag:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  {country.name}
                </div>
              </div>
            ))}
            {remainingCountries > 0 && (
              <span className="text-xs bg-white/20 rounded-full px-2 py-1 text-white/70">
                +{remainingCountries}
              </span>
            )}
          </div>
          
          {/* Country Name and Details */}
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:gradient-text transition-all">
              {primaryCountry.name}
              {bundle.countries.length > 1 && (
                <span className="text-sm text-green-300 ml-2">
                  & {additionalCountries} more
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">${(paymentAmount / 100).toFixed(2)}</div>
          <div className="text-xs text-white/60">
            USD (via x402)
          </div>
          <div className="text-xs text-white/40 mt-1">
            Base: ${bundle.price.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Flexible content area */}
      <div className="flex-1 flex flex-col">
        {/* Data Amount */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-white/60" />
              <span className="text-white/80">Data</span>
            </div>
            <span className="text-xl font-bold text-white">
              {bundle.unlimited ? 'Unlimited' : formatBytes(bundle.dataAmount)}
            </span>
          </div>
        </div>

        {/* Duration */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-white/80">Duration</span>
            </div>
            <span className="text-xl font-bold text-white">
              {formatDuration(bundle.duration)}
            </span>
          </div>
        </div>

        {/* Speed */}
        {bundle.speed && bundle.speed.length > 0 && (
          <div className="glass-card rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-white/60" />
                <span className="text-white/80">Speed</span>
              </div>
              <span className="text-sm font-medium text-white">
                {bundle.speed[0]}
              </span>
            </div>
          </div>
        )}

        {/* Roaming Info */}
        {bundle.roamingEnabled.length > 0 && (
          <div className="glass-card rounded-xl p-3 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/80">Roaming Available</span>
            </div>
            <div className="text-xs text-white/60">
              {bundle.roamingEnabled.length} additional {bundle.roamingEnabled.length === 1 ? 'location' : 'locations'}
            </div>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>
      </div>

      {/* Purchase Button - Always at bottom */}
      <div className="pt-4">
        {connected && isReady ? (
          <button
            onClick={handlePurchase}
            disabled={purchaseState.loading}
            className="w-full glass-button rounded-xl py-3 px-4 font-medium text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purchaseState.loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </>
            ) : purchaseState.success ? (
              <>
                <Check className="w-5 h-5 text-green-400" />
                <span>Purchase Complete!</span>
              </>
            ) : purchaseState.error ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>Try Again</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Pay with x402</span>
              </>
            )}
          </button>
        ) : connected ? (
          <div className="w-full glass-button rounded-xl py-3 px-4 font-medium text-white/60 flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Initializing Payment...</span>
          </div>
        ) : (
          <WalletMultiButton className="!w-full !bg-white/10 !border-white/20 hover:!bg-white/20 !backdrop-blur-xl !text-white !rounded-xl !font-medium !transition-all !duration-300 !py-3" />
        )}
        
        {/* Error Display */}
        {purchaseState.error && (
          <div className="mt-2 text-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300 border border-red-500/30">
              {purchaseState.error}
            </span>
          </div>
        )}
        
        {/* Success Display with QR Code Link */}
        {purchaseState.success && purchaseState.qrCodeUrl && (
          <div className="mt-3 text-center">
            <a
              href={purchaseState.qrCodeUrl}
              download
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-colors"
            >
              📱 Download QR Code
            </a>
          </div>
        )}
      </div>

      {/* Auto-start indicator */}
      {bundle.autostart && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
            Auto-start enabled
          </span>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'
import { DataBundle } from '@/types'
import { ChevronLeft, ChevronRight, Search, ShoppingCart, AlertCircle, Check } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useX402Payment } from '@/hooks/useX402Payment'

interface DataPlansCarouselProps {
  bundles: DataBundle[]
}

export function DataPlansCarousel({ bundles }: DataPlansCarouselProps) {
  const { connected } = useWallet()
  const { 
    isReady, 
    purchaseState, 
    purchaseDataPlan, 
    calculatePaymentAmount,
    resetPurchaseState 
  } = useX402Payment()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [filteredBundles, setFilteredBundles] = useState<DataBundle[]>(bundles)
  const [activePurchase, setActivePurchase] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }

  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop)

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(itemsPerView.mobile)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerView.tablet)
      } else {
        setItemsToShow(itemsPerView.desktop)
      }
    }

    updateItemsToShow()
    window.addEventListener('resize', updateItemsToShow)
    return () => window.removeEventListener('resize', updateItemsToShow)
  }, [])

  useEffect(() => {
    setFilteredBundles(bundles)
    setCurrentIndex(0)
    setLocalSearchQuery('')
  }, [bundles])

  useEffect(() => {
    // Filter bundles based on local search
    if (!localSearchQuery.trim()) {
      setFilteredBundles(bundles)
    } else {
      const query = localSearchQuery.toLowerCase()
      const filtered = bundles.filter(bundle =>
        bundle.countries.some(country =>
          country.name.toLowerCase().includes(query) ||
          country.iso.toLowerCase().includes(query)
        ) ||
        bundle.description.toLowerCase().includes(query)
      )
      setFilteredBundles(filtered)
    }
    setCurrentIndex(0) // Reset to first item when search changes
  }, [bundles, localSearchQuery])

  const maxIndex = Math.max(0, filteredBundles.length - itemsToShow)

  useEffect(() => {
    if (!isAutoPlaying || localSearchQuery.trim()) return // Don't auto-play when searching

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [maxIndex, isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAutoPlaying(false)
  }

  const clearLocalSearch = () => {
    setLocalSearchQuery('')
    setIsAutoPlaying(true)
  }

  const handlePurchase = async (bundle: DataBundle) => {
    if (!connected || !isReady) return
    
    try {
      setActivePurchase(bundle.name)
      resetPurchaseState()
      const result = await purchaseDataPlan(bundle, 1)
      
      if (result?.success) {
        console.log('Purchase successful:', result)
        // Could show success notification here
      }
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setActivePurchase(null)
    }
  }

  if (bundles.length === 0) {
    return (
      <section className="mb-20">
        <h2 className="text-3xl font-light text-white mb-12 text-center">Available Data Plans</h2>
        <div className="text-center py-24">
          <div className="text-8xl mb-6 opacity-20 select-none">◯</div>
          <h3 className="text-2xl font-light text-white mb-4">No plans found</h3>
          <p className="text-white/60">
            Try adjusting your search criteria or check your internet connection.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-light text-white mb-2">Available Data Plans</h2>
          <p className="text-white/60 text-sm">
            {filteredBundles.length} plan{filteredBundles.length !== 1 ? 's' : ''} available
            {localSearchQuery && ` for "${localSearchQuery}"`}
          </p>
        </div>
        
        {/* Local Search Bar */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleLocalSearch} className="relative">
            <div className="flex items-center w-64">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search plans in country..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-white placeholder-white/50 text-sm focus:outline-none"
                />
                {localSearchQuery && (
                  <button
                    type="button"
                    onClick={clearLocalSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </form>
          
          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="glass-button p-2 rounded-full hover:bg-white/20 transition-all duration-300"
              disabled={filteredBundles.length <= itemsToShow}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            <div className="text-white/60 text-xs px-2">
              {currentIndex + 1}-{Math.min(currentIndex + itemsToShow, filteredBundles.length)} of {filteredBundles.length}
            </div>
            
            <button
              onClick={goToNext}
              className="glass-button p-2 rounded-full hover:bg-white/20 transition-all duration-300"
              disabled={filteredBundles.length <= itemsToShow}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {filteredBundles.map((bundle) => {
            // Get up to 3 country flags to display
            const flagsToShow = bundle.countries.slice(0, 3)
            const remainingCountries = bundle.countries.length - flagsToShow.length
            
            const getCountryFlag = (iso: string): string => {
              if (!iso || iso.length !== 2) return '🌍'
              try {
                const codePoints = iso
                  .toUpperCase()
                  .split('')
                  .map(char => 127397 + char.charCodeAt(0))
                return String.fromCodePoint(...codePoints)
              } catch (error) {
                return '🌍'
              }
            }
            
            return (
              <div
                key={bundle.name}
                className="flex-none px-3"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <div className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300 h-full flex flex-col">
                  {/* Country Flags Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {flagsToShow.map((country, index) => (
                        <div key={country.iso} className="relative group">
                          <span 
                            className="text-2xl cursor-help transition-transform hover:scale-110"
                            title={country.name}
                          >
                            {getCountryFlag(country.iso)}
                          </span>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {country.name}
                          </div>
                        </div>
                      ))}
                      {remainingCountries > 0 && (
                        <div className="relative group">
                          <span 
                            className="text-sm bg-white/20 rounded-full px-2 py-1 text-white/80 cursor-help"
                            title={`+${remainingCountries} more countries`}
                          >
                            +{remainingCountries}
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            +{remainingCountries} more countries
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">${bundle.price.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  {/* Primary Country Name */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {bundle.countries[0]?.name || 'Global Plan'}
                    </h3>
                    <p className="text-sm text-white/60">
                      {bundle.duration} days • {(bundle.dataAmount / (1024 * 1024 * 1024)).toFixed(1)}GB
                      {bundle.countries.length > 1 && (
                        <span className="ml-2 text-green-300">
                          • {bundle.countries.length} countries
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Flexible content area */}
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs text-white/60 mb-4 line-clamp-2 flex-1">
                      {bundle.description}
                    </div>
                    
                    {/* Speed indicator */}
                    {bundle.speed && bundle.speed.length > 0 && (
                      <div className="mb-3">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {bundle.speed[0]} Network
                        </span>
                      </div>
                    )}
                    
                    {/* Countries Coverage Details */}
                    {bundle.countries.length > 3 && (
                      <div className="mb-4">
                        <div className="text-xs text-white/60 mb-1">Coverage includes:</div>
                        <div className="text-xs text-white/80">
                          {bundle.countries.slice(0, 3).map(c => c.name).join(', ')}
                          {bundle.countries.length > 3 && ` and ${bundle.countries.length - 3} more`}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Purchase Button */}
                  <div className="mt-auto">
                    {connected && isReady ? (
                      <button 
                        onClick={() => handlePurchase(bundle)}
                        disabled={activePurchase === bundle.name}
                        className="w-full glass-button rounded-xl py-3 px-4 font-medium text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {activePurchase === bundle.name ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : purchaseState.success && activePurchase === null ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Purchase Complete!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Buy ${calculatePaymentAmount(bundle, 1) / 100}</span>
                          </>
                        )}
                      </button>
                    ) : connected ? (
                      <button 
                        disabled
                        className="w-full glass-button rounded-xl py-3 px-4 font-medium text-white/60 flex items-center justify-center space-x-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Initializing Payment...</span>
                      </button>
                    ) : (
                      <WalletMultiButton className="!w-full !bg-white/10 !border-white/20 hover:!bg-white/20 !backdrop-blur-xl !text-white !rounded-xl !font-medium !transition-all !duration-300 !py-3" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* eSIM Usage Disclaimer */}
      <div className="mt-8 glass-card rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="text-yellow-300 font-medium mb-1">Important: eSIM Usage Requirements</div>
            <div className="text-white/70 space-y-1">
              <p>• eSIM data plans are region/country-specific and must be activated while in the designated coverage area</p>
              <p>• Plans cannot be used outside their intended geographic regions</p>
              <p>• Ensure your device supports eSIM technology before purchasing</p>
              <p>• Data plans have expiration dates - unused data cannot be refunded after activation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      {filteredBundles.length > itemsToShow && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-white scale-110'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs text-white/50 hover:text-white/70 transition-colors"
          disabled={!!localSearchQuery.trim()}
        >
          {localSearchQuery.trim() ? 'Search active' : isAutoPlaying ? 'Auto-playing' : 'Paused'} 
          {!localSearchQuery.trim() && ` • Click to ${isAutoPlaying ? 'pause' : 'resume'}`}
        </button>
      </div>
    </section>
  )
}
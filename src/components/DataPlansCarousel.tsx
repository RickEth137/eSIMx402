'use client'

import { useState, useRef, useEffect } from 'react'
import { DataBundle } from '@/types'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

interface DataPlansCarouselProps {
  bundles: DataBundle[]
}

export function DataPlansCarousel({ bundles }: DataPlansCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [filteredBundles, setFilteredBundles] = useState<DataBundle[]>(bundles)
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
            const countryFlag = bundle.countries[0]?.iso ? 
              String.fromCodePoint(
                127397 + bundle.countries[0].iso.charCodeAt(0), 
                127397 + bundle.countries[0].iso.charCodeAt(1)
              ) : '◯'
            
            return (
              <div
                key={bundle.name}
                className="flex-none px-3"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <div className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300 h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">{countryFlag}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {bundle.countries[0]?.name || 'Global'}
                      </h3>
                      <p className="text-sm text-white/60">
                        {bundle.duration} days • {(bundle.dataAmount / (1024 * 1024 * 1024)).toFixed(1)}GB
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">${bundle.price.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60 mb-4 line-clamp-2">
                    {bundle.description}
                  </div>
                  
                  {/* Speed indicator */}
                  {bundle.speed && bundle.speed.length > 0 && (
                    <div className="mb-4">
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {bundle.speed[0]} Network
                      </span>
                    </div>
                  )}
                  
                  {/* Additional countries indicator */}
                  {bundle.countries.length > 1 && (
                    <div className="mb-4">
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                        +{bundle.countries.length - 1} more countries
                      </span>
                    </div>
                  )}
                  
                  <button className="w-full glass-button rounded-xl py-3 px-4 font-medium text-white hover:bg-white/20 transition-all duration-300">
                    Connect Wallet to Buy
                  </button>
                </div>
              </div>
            )
          })}
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
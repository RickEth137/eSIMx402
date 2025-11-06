'use client'

import { useState, useEffect } from 'react'
import { DataBundle } from '@/types'
import { Header } from '@/components/Header'
import { DataPlansCarousel } from '@/components/DataPlansCarousel'
import { AlertCircle } from 'lucide-react'

export default function Home() {
  const [bundles, setBundles] = useState<DataBundle[]>([])
  const [filteredBundles, setFilteredBundles] = useState<DataBundle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // derive counts from fetched bundles
  const uniqueCountryCount = new Set(bundles.flatMap(b => b.countries.map(c => c.iso))).size

  useEffect(() => {
    fetchBundles()
  }, [])

  useEffect(() => {
    // Listen for search events from header
    const handleSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query)
    }

    window.addEventListener('countrySearch', handleSearch as EventListener)
    return () => window.removeEventListener('countrySearch', handleSearch as EventListener)
  }, [])

  useEffect(() => {
    // Filter bundles based on search query
    if (!searchQuery.trim()) {
      setFilteredBundles(bundles)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = bundles.filter(bundle =>
        bundle.countries.some(country =>
          country.name.toLowerCase().includes(query) ||
          country.iso.toLowerCase().includes(query)
        ) ||
        bundle.description.toLowerCase().includes(query)
      )
      setFilteredBundles(filtered)
    }
  }, [bundles, searchQuery])

  const fetchBundles = async () => {
    try {
      setLoading(true)
      console.log('Fetching bundles...')
      
      const response = await fetch('/api/bundles')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Received data:', data.length, 'bundles')
      
      setBundles(data)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data plans')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Loading XDATA...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={fetchBundles}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-16 bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-white mb-6 tracking-tight">
            XDATA
            <span className="block font-bold text-white/80 mt-2">
              Global Mobile Data
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            The first decentralized mobile data marketplace. Purchase eSIM data plans 
            worldwide using Solana with instant delivery and transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/services" 
              className="glass-button rounded-xl py-3 px-8 font-medium text-white hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </a>
            <button className="glass-button rounded-xl py-3 px-8 font-medium text-white hover:bg-white/20 transition-all duration-300 border border-white/20">
              Connect Wallet
            </button>
          </div>
        </div>

        {/* Important Disclaimer Section */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-6 border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-orange-300 mb-3">Before You Purchase - Important Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
                  <div>
                    <h4 className="font-medium text-white mb-2">✈️ Geographic Requirements</h4>
                    <p className="mb-3">eSIM data plans are region-specific and must be activated while physically present in the coverage area. Plans purchased for a specific country/region cannot be used elsewhere.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">📱 Device Compatibility</h4>
                    <p className="mb-3">Ensure your device supports eSIM technology. Most modern smartphones (iPhone XS+, Google Pixel 3+, Samsung Galaxy S20+) are compatible.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">⏰ Activation & Expiry</h4>
                    <p>Data plans have specific validity periods and cannot be refunded after activation. Unused data expires after the plan duration.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">💰 Crypto Payments</h4>
                    <p>All purchases use Solana/USDC via x402 protocol. Ensure you have sufficient funds and understand crypto transaction fees.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Plans Carousel Section */}
        <div className="mb-20">
          {searchQuery && (
            <div className="text-center mb-6">
              <p className="text-white/70">
                Showing {filteredBundles.length} result{filteredBundles.length !== 1 ? 's' : ''} for 
                <span className="text-white font-medium"> "{searchQuery}"</span>
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
          
          <DataPlansCarousel bundles={filteredBundles} />
        </div>

        {/* How It Works Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">How XDATA Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Connect Wallet</h4>
              <p className="text-white/70 text-sm">
                Connect your Solana wallet using Phantom, Solflare, or other supported wallets.
              </p>
            </div>
            
            <div className="text-center">
              <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Choose Plan</h4>
              <p className="text-white/70 text-sm">
                Browse data plans for {uniqueCountryCount || 'several'} countries with transparent crypto pricing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Pay with SOL</h4>
              <p className="text-white/70 text-sm">
                Complete payment using x402 protocol for instant, decentralized transactions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="glass-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Get QR Code</h4>
              <p className="text-white/70 text-sm">
                Receive instant QR code for eSIM installation on your device.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose XDATA Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">Why Choose XDATA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Crypto-Native</h3>
              <p className="text-white/70 text-sm">
                Direct SOL/USDC payments using x402 protocol. No banks, no boundaries.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Instant Settlement</h3>
              <p className="text-white/70 text-sm">
                Solana-speed transactions with sub-second confirmation times.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">Global Access</h3>
                <p className="text-white/70 text-sm">
                {uniqueCountryCount || 'Several'} countries with no banking restrictions or geographic limitations.
                </p>
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-8 max-w-md mx-auto text-center">
            <div className="text-4xl font-bold text-white mb-3">{bundles.length}</div>
            <div className="text-white/60 font-light">Data Plans Available</div>
          </div>
        </section>
      </div>
    </main>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'

export default function ServicesPage() {
  const [plansCount, setPlansCount] = useState<number | null>(null)
  const [countriesCount, setCountriesCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/bundles')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        setPlansCount(Array.isArray(data) ? data.length : 0)
        const uniqueCountries = new Set(data.flatMap((b: any) => b.countries.map((c: any) => c.iso)))
        setCountriesCount(uniqueCountries.size)
      } catch (e) {
        // ignore - keep nulls
      }
    })()

    return () => { mounted = false }
  }, [])

  return (
    <main className="min-h-screen pt-16 bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-light text-white mb-6 tracking-tight">
            Global Mobile Data
            <span className="block font-bold text-white mt-2">
              Powered by Solana
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
            The first decentralized mobile data marketplace. Purchase eSIM data plans 
            worldwide using Solana, with instant delivery and transparent pricing.
          </p>
        </div>

        {/* Core Services */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">Core Services</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Global Data Plans</h3>
              <div className="space-y-4 text-white/70">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Coverage</span>
                  <span className="text-white font-medium">{countriesCount ?? '—'} Countries</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Data Packages</span>
                  <span className="text-white font-medium">1GB to 20GB+</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Duration Options</span>
                  <span className="text-white font-medium">7-90 Days</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Network Speed</span>
                  <span className="text-white font-medium">2G/3G/4G/5G</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Multi-Country</span>
                  <span className="text-white font-medium">Regional Bundles</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Instant Digital Delivery</h3>
              <div className="space-y-4 text-white/70">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Delivery Method</span>
                  <span className="text-white font-medium">QR Code Generation</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Physical Shipping</span>
                  <span className="text-white font-medium">100% Digital</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Activation Time</span>
                  <span className="text-white font-medium">Real-time</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span>Device Support</span>
                  <span className="text-white font-medium">All eSIM Devices</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Compatibility</span>
                  <span className="text-white font-medium">iPhone, Android, Tablets</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solana x402 Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">Solana x402 Integration</h2>
          
          <div className="glass-card rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">Payment Flow Comparison</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-white/90 mb-4">Traditional Flow</h4>
                <div className="space-y-3 text-white/70">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Credit Card Required</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Banking Intermediaries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Geographic Restrictions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Processing Delays</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Higher Fees</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-white/90 mb-4">XDATA Flow</h4>
                <div className="space-y-3 text-white/70">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>SOL/USDC Direct Payment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>x402 Protocol Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Global Accessibility</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Instant Settlement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Lower Transaction Costs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-xl font-semibold text-white mb-4">Crypto-Native Payments</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Direct SOL and USDC payments without traditional banking infrastructure. 
                True decentralized commerce.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-xl font-semibold text-white mb-4">Global Accessibility</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                No banking restrictions, works anywhere with crypto access. 
                Privacy-focused pseudonymous purchases.
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-xl font-semibold text-white mb-4">Developer-Friendly</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                RESTful API endpoints, real-time webhooks, and transparent 
                pricing in cryptocurrency.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">Technical Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Current Implementation</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>eSIM-Go API Integration</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Solana Wallet Connection</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>x402 Payment Protocol</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>QR Code Delivery System</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Usage Monitoring Webhooks</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Glassmorphism UI Design</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">What Makes Us Unique</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>First crypto-native eSIM marketplace</span>
                </div>
                <div className="flex items-start space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Solana-speed transactions with sub-second confirmations</span>
                </div>
                <div className="flex items-start space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>No traditional payment gatekeepers</span>
                </div>
                <div className="flex items-start space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Global reach without banking infrastructure</span>
                </div>
                <div className="flex items-start space-x-3 text-white/70">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <span>Truly permissionless global data marketplace</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Target Markets */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">Target Markets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-3">Crypto Natives</h4>
              <p className="text-white/70 text-sm">
                Users who prefer SOL payments and live primarily on-chain
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-3">Privacy-Conscious Travelers</h4>
              <p className="text-white/70 text-sm">
                Those seeking pseudonymous connectivity without KYC requirements
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-3">Unbanked Populations</h4>
              <p className="text-white/70 text-sm">
                Users with crypto access but limited traditional banking options
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-3">Digital Nomads</h4>
              <p className="text-white/70 text-sm">
                Remote workers needing reliable global connectivity solutions
              </p>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="mb-20">
          <h2 className="text-3xl font-light text-white mb-12 text-center">Business Model</h2>
          
          <div className="glass-card rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Revenue Streams</h4>
                <div className="space-y-3 text-white/70 text-sm">
                  <div>Markup on data plans (wholesale to retail)</div>
                  <div>x402 transaction fees (small percentage)</div>
                  <div>Premium features (analytics, bulk purchases)</div>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Pricing Model</h4>
                <div className="space-y-3 text-white/70 text-sm">
                  <div>Transparent crypto pricing</div>
                  <div>Real-time rate conversion</div>
                  <div>No hidden fees or markups</div>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Value Proposition</h4>
                <div className="space-y-3 text-white/70 text-sm">
                  <div>Instant global connectivity</div>
                  <div>Decentralized payment infrastructure</div>
                  <div>Privacy-preserving transactions</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { Menu, X, Smartphone, Search } from 'lucide-react'

export function Header() {
  const { connected } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Emit search event or navigate to search results
      window.dispatchEvent(new CustomEvent('countrySearch', { detail: { query: searchQuery.trim() } }))
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 glass-card rounded-lg flex items-center justify-center glow-effect">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">XDATA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white/80 hover:text-white transition-colors">
              Home
            </a>
            <a href="/services" className="text-white/80 hover:text-white transition-colors">
              Services
            </a>
            <a href="#plans" className="text-white/80 hover:text-white transition-colors">
              Data Plans
            </a>
            <a href="#coverage" className="text-white/80 hover:text-white transition-colors">
              Coverage
            </a>
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`flex items-center transition-all duration-300 ${
                isSearchFocused ? 'w-64' : 'w-48'
              }`}>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search plans by country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-white placeholder-white/50 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </form>
          </nav>

          {/* Wallet Connect & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="wallet-adapter-button-trigger">
              <WalletMultiButton className="!bg-white/10 !border-white/20 hover:!bg-white/20 !backdrop-blur-xl !text-white !rounded-xl !font-medium !transition-all !duration-300 hover:!shadow-lg hover:!shadow-white/10" />
            </div>
            
            <button
              className="md:hidden glass-button p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-3">
              <a 
                href="/" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/services" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#plans" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Data Plans
              </a>
              <a 
                href="#coverage" 
                className="text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Coverage
              </a>
              
              {/* Mobile Search */}
              <div className="pt-4 border-t border-white/10">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search plans by country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-white placeholder-white/50 text-sm focus:outline-none"
                    />
                  </div>
                </form>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Connection Status Indicator */}
      {connected && (
        <div className="absolute top-full left-4 mt-2">
          <div className="glass-card px-3 py-1 rounded-full flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white/80">Wallet Connected</span>
          </div>
        </div>
      )}
    </header>
  )
}
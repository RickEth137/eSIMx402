'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { useState } from 'react'
import { DataBundle } from '@/types'

interface CountrySelectorProps {
  value: string
  onChange: (value: string) => void
  bundles: DataBundle[]
}

export function CountrySelector({ value, onChange, bundles }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get unique countries from bundles
  const countries = Array.from(
    new Set(
      bundles.flatMap(bundle => 
        bundle.countries.map(country => ({
          iso: country.iso,
          name: country.name,
          flag: getCountryFlag(country.iso)
        }))
      )
    )
  ).sort((a, b) => a.name.localeCompare(b.name))

  const selectedCountry = countries.find(c => c.iso.toLowerCase() === value.toLowerCase())

  function getCountryFlag(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-input w-full px-4 py-3 rounded-xl text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <div className="flex items-center space-x-3">
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            <>
              <Globe className="w-5 h-5 text-white/40" />
              <span className="text-white/60">All Countries</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl border border-white/10 max-h-64 overflow-y-auto z-20">
            <button
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3 border-b border-white/5"
            >
              <Globe className="w-5 h-5 text-white/40" />
              <span className="text-white/80">All Countries</span>
            </button>
            
            {countries.map((country) => (
              <button
                key={country.iso}
                onClick={() => {
                  onChange(country.iso)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3"
              >
                <span className="text-lg">{country.flag}</span>
                <span className="text-white">{country.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
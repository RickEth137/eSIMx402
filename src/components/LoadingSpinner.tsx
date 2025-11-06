export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-white border-r-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-white/80 text-lg font-medium">Loading XDATA...</div>
      <div className="text-white/40 text-sm">Connecting to global network</div>
    </div>
  )
}
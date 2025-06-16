import * as React from "react"

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">US</span>
      </div>
      <span className="font-bold text-xl">UI Surgeon</span>
    </div>
  )
}
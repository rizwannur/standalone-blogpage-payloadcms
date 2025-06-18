import * as React from "react"

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-600 to-blue-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">R</span>
      </div>
      <span className="font-bold text-xl">Rafey's Blog</span>
    </div>
  )
}
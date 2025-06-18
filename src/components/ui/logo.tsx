import * as React from "react"

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">YN</span>
      </div>
      <span className="font-bold text-xl">Your Name</span>
    </div>
  )
}
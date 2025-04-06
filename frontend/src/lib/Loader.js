"use client"

import { useEffect, useState } from "react"

export default function Loader() {
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 3 ? prev + 1 : 1))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Animated Outer Circle */}
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
          <ChatIcon />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Starting  Lets_Meet</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">Connecting{".".repeat(dots)}</p>
      </div>

      {/* Bouncing Dots Animation */}
      <BouncingDots />
    </div>
  )
}

const ChatIcon = () => (
  <svg
    className="w-12 h-12 text-primary animate-pulse"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
)

const BouncingDots = () => (
  <div className="absolute bottom-16 flex space-x-2 opacity-50">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="w-3 h-3 rounded-full bg-primary"
        style={{
          animation: `bounce 1.4s infinite ease-in-out both`,
          animationDelay: `${i * 0.16}s`,
        }}
      />
    ))}
  </div>
)

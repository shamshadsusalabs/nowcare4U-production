"use client"

import { useEffect, useState } from "react"

export default function ColorfulCursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <>
      {/* Main Cursor Follower */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Center dot with rainbow gradient */}
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse" />

          {/* First ring - Rainbow gradient */}
          <div
            className="absolute inset-0 w-8 h-8 -translate-x-2.5 -translate-y-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 opacity-60 animate-spin"
            style={{ animationDuration: "3s" }}
          />

          {/* Second ring - Larger with different colors */}
          <div className="absolute inset-0 w-12 h-12 -translate-x-6 -translate-y-6 rounded-full bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 opacity-40 animate-ping" />

          {/* Third ring - Even larger */}
          <div
            className="absolute inset-0 w-16 h-16 -translate-x-8 -translate-y-8 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 opacity-30 animate-pulse"
            style={{ animationDuration: "2s" }}
          />

          {/* Outer glow */}
          <div className="absolute inset-0 w-24 h-24 -translate-x-12 -translate-y-12 rounded-full bg-gradient-radial from-pink-300/20 via-purple-300/10 to-transparent blur-xl" />
        </div>
      </div>

      {/* Background gradient that follows cursor */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-500 ease-out z-[9998]"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(236, 72, 153, 0.03) 0%, 
            rgba(147, 51, 234, 0.02) 25%, 
            rgba(59, 130, 246, 0.02) 50%, 
            rgba(34, 197, 94, 0.01) 75%, 
            transparent 100%)`,
        }}
      />

      {/* Additional floating particles */}
      <div
        className={`fixed pointer-events-none z-[9997] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
        }}
      >
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-bounce"
            style={{
              left: Math.sin((i * 60 * Math.PI) / 180) * 40 + 100,
              top: Math.cos((i * 60 * Math.PI) / 180) * 40 + 100,
              backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"][i],
              animationDelay: `${i * 0.1}s`,
              animationDuration: "1.5s",
            }}
          />
        ))}
      </div>
    </>
  )
}

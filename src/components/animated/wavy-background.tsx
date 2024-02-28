"use client"

import { cn } from "@/lib/utils"
import "context-filter-polyfill"
import React, { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number

  [key: string]: any
}) => {
  const noise = createNoise3D()
  let w: number
  let h: number
  let nt: number

  let ctx: any

  let canvas: any
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001
      case "fast":
        return 0.002
      default:
        return 0.001
    }
  }

  const init = () => {
    canvas = canvasRef.current
    ctx = canvas.getContext("2d")
    w = ctx.canvas.width = window.innerWidth
    h = ctx.canvas.height =
      containerRef?.current?.clientHeight ?? window.innerHeight
    ctx.filter = `blur(${blur}px)`
    nt = 0
    window.onresize = () => {
      w = ctx.canvas.width = window.innerWidth
      h = ctx.canvas.height =
        containerRef?.current?.clientHeight ?? window.innerHeight
      ctx.filter = `blur(${blur}px)`
    }
    render()
  }

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ]
  const drawWave = (n: number) => {
    nt += getSpeed()
    for (let i = 0; i < n; i++) {
      ctx.beginPath()
      ctx.lineWidth = waveWidth || 50
      ctx.strokeStyle = waveColors[i % waveColors.length]
      for (let x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100
        ctx.lineTo(x, y + h * 0.5) // adjust for height, currently at 50% of the container
      }
      ctx.stroke()
      ctx.closePath()
    }
  }

  let animationId: number
  const render = () => {
    ctx.fillStyle = backgroundFill || "rgb(9 9 9)"
    ctx.globalAlpha = waveOpacity || 0.5
    ctx.fillRect(0, 0, w, h)
    drawWave(5)
    animationId = requestAnimationFrame(render)
  }

  useEffect(() => {
    init()
    return () => {
      cancelAnimationFrame(animationId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={cn(
        "h-full flex w-screen flex-col items-center justify-center relative",
        containerClassName
      )}
      ref={containerRef}
    >
      <canvas className="absolute z-0" ref={canvasRef} id="canvas" />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  )
}

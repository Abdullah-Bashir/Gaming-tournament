"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function ParticleBackground() {
    const canvasRef = useRef(null)
    const { theme } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId
        let particles = []

        const isDark = theme === "dark"

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", resizeCanvas)
        resizeCanvas()

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 3 + 0.5
                this.speedX = Math.random() * 0.5 - 0.25
                this.speedY = Math.random() * 0.5 - 0.25
                this.color = isDark
                    ? `hsl(${Math.random() * 60 + 240}, 100%, 70%)` // Blue to purple in dark mode
                    : `hsl(${Math.random() * 60 + 0}, 100%, 70%)` // Red to yellow in light mode
                this.alpha = Math.random() * 0.5 + 0.1
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX
                }

                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY = -this.speedY
                }
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.globalAlpha = this.alpha
                ctx.fill()
            }
        }

        const init = () => {
            particles = []
            const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100)

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw connections
            ctx.lineWidth = 0.3
            ctx.globalAlpha = 0.2
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.strokeStyle = isDark ? "#8b5cf6" : "#f59e0b"
                        ctx.globalAlpha = 0.1 * (1 - distance / 100)
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }

            // Update and draw particles
            for (const particle of particles) {
                particle.update()
                particle.draw()
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        init()
        animate()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [theme])

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

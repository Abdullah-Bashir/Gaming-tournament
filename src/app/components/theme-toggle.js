"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative overflow-hidden border-primary/20 bg-background/50 backdrop-blur-sm"
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === "light" ? 0 : 180 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </motion.div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

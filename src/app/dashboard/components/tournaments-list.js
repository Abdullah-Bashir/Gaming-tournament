"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export function TournamentList({ tournaments, isLoading }) {
    const [showAll, setShowAll] = useState(false)

    // Sort tournaments by date (closest first)
    const sortedTournaments = [...tournaments].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )

    // Split tournaments
    const firstThree = sortedTournaments.slice(0, 3)
    const remaining = sortedTournaments.slice(3)

    const toggleShowAll = () => setShowAll(!showAll)

    if (isLoading) {
        return (
            <section className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold mb-4">Upcoming Tournaments</h3>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </section>
        )
    }

    // Helper to render tournament card
    const renderTournament = (tournament, index) => (
        <motion.div
            key={tournament.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
        >
            <div>
                <Link href={`/tournaments/${tournament.id}`}>
                    <h4 className="font-bold hover:text-primary cursor-pointer">
                        {tournament.gameTitle}
                    </h4>
                </Link>
                <p className="text-sm text-muted-foreground">
                    {new Date(tournament.date).toLocaleDateString()} • Prize Pool: {tournament.prizePool}
                </p>
                <p className="text-xs mt-1">
                    {tournament.usedSpots || 0}/{tournament.spots} spots filled
                </p>
            </div>
            <Link href={`/tournaments/${tournament.id}`}>
                <Button size="sm" variant="outline">
                    View Details
                </Button>
            </Link>
        </motion.div>
    )

    return (
        <section className="bg-card/30 border border-border/50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold mb-4">Upcoming Tournaments</h3>

            {/* Show first 3 tournaments */}
            <div className="space-y-4">
                {firstThree.map((tournament, index) => renderTournament(tournament, index))}
            </div>

            {/* Show remaining tournaments only if showAll === true */}
            {showAll && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 mt-4"
                >
                    {remaining.map((tournament, index) => renderTournament(tournament, index))}
                </motion.div>
            )}

            {/* Toggle Button */}
            {remaining.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={toggleShowAll}
                        aria-label={showAll ? "Show Less" : "Show More"}
                        className="flex items-center gap-2 text-primary font-semibold hover:underline"
                    >
                        {showAll ? (
                            <>
                                Show Less Tournaments <ChevronUp className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                Show More Tournaments <ChevronDown className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </section>
    )
}

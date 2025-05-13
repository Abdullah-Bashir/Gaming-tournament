"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TournamentList({ tournaments, isLoading }) {
    return (
        <section className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-bold mb-4">Upcoming Tournaments</h3>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {tournaments.slice(0, 3).map((tournament, index) => (
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
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/tournaments">
                            <Button variant="ghost">View All Tournaments</Button>
                        </Link>
                    </div>
                </>
            )}
        </section>
    )
}
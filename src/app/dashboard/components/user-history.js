"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function UserHistory({ userHistory, toggleHistory }) {
    return (
        <section className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Your Tournament History</h3>
                <Button variant="outline" onClick={toggleHistory}>
                    Back to Dashboard
                </Button>
            </div>

            {userHistory.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">You haven&apos;t registered for any tournaments yet.</p>
                    <Button className="mt-4" onClick={toggleHistory}>
                        Browse Tournaments
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {userHistory.map((tournament, index) => (
                        <motion.div
                            key={`${tournament.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h4 className="font-bold">{tournament.gameTitle}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(tournament.date).toLocaleDateString()} • Prize Pool: {tournament.prizePool}
                                </p>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                                        Created: {new Date(tournament.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                                        {tournament.location}
                                    </span>
                                </div>
                            </div>
                            <Link href={`/tournaments/${tournament.id}`}>
                                <Button size="sm" variant="outline">
                                    View Details
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}
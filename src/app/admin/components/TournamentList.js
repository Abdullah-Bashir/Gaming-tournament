"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Edit, Search, Calendar, MapPin, Users, ChevronDown } from "lucide-react"

const TournamentList = ({ tournaments, onDelete, onEdit, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedId, setExpandedId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const filteredTournaments = tournaments.filter(
        (tournament) =>
            tournament.gameTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const handleDelete = async (id) => {
        setDeletingId(id)
        const confirmDelete = window.confirm("Are you sure you want to delete this tournament? This action cannot be undone.")

        if (confirmDelete) {
            try {
                await onDelete(id)
            } catch (error) {
                console.error("Error deleting tournament:", error)
            }
        }
        setDeletingId(null)
    }

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
            },
        }),
    }

    const expandVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            },
        },
    }

    return (
        <div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    All Tournaments
                </h3>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tournaments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 p-2 pl-10 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filteredTournaments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center"
                >
                    <p className="mb-2 text-lg font-medium text-muted-foreground">No tournaments found</p>
                    <p className="text-sm text-muted-foreground">
                        {searchTerm ? "Try a different search term" : "Add your first tournament to get started"}
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {filteredTournaments.map((tournament, index) => (
                        <motion.div
                            key={tournament.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={tableRowVariants}
                            className="bg-background/50 border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div
                                className="p-4 cursor-pointer hover:bg-background/80 transition-colors"
                                onClick={() => toggleExpand(tournament.id)}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div className="flex items-center">
                                        <motion.span
                                            animate={{ rotate: expandedId === tournament.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mr-2"
                                        >
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        </motion.span>
                                        <div>
                                            <h4 className="font-bold">{tournament.gameTitle}</h4>
                                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {formatDate(tournament.date)}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {tournament.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {tournament.spots} spots
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-2 sm:mt-0">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onEdit(tournament)
                                            }}
                                            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(tournament.id)
                                            }}
                                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                            title="Delete"
                                            disabled={deletingId === tournament.id}
                                        >
                                            {deletingId === tournament.id ? (
                                                <svg
                                                    className="animate-spin h-4 w-4 text-red-600 dark:text-red-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === tournament.id && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={expandVariants}
                                        className="border-t border-border bg-background/30"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                                            <div className="bg-background/50 p-4 rounded-lg border border-border">
                                                <h5 className="font-medium mb-2">Tournament Details</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {tournament.gameTitle} will be held at {tournament.location} on {formatDate(tournament.date)}.
                                                </p>
                                            </div>

                                            <div className="bg-background/50 p-4 rounded-lg border border-border">
                                                <h5 className="font-medium mb-2">Registration</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {tournament.spots} total spots, {tournament.spots - tournament.usedSpots} spots available for registration.
                                                </p>
                                            </div>


                                            <div className="bg-background/50 p-4 rounded-lg border border-border">
                                                <h5 className="font-medium mb-2">Management</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onEdit(tournament)
                                                        }}
                                                        className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                    >
                                                        Edit Details
                                                    </motion.button>

                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TournamentList
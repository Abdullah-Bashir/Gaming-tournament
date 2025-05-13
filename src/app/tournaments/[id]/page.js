"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/app/components/particle-background"
import { Trophy, Users, Calendar, LogOut, MapPin, DollarSign, Clock, ArrowLeft, CheckCircle } from "lucide-react"
import { auth, db } from "@/app/firebase"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function TournamentDetails() {
    const [tournament, setTournament] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [isRegistering, setIsRegistering] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const router = useRouter()
    const params = useParams()
    const tournamentId = params.id

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                fetchTournamentDetails(currentUser.uid)
            } else {
                router.push("/login")
            }
        })

        return () => unsubscribe()
    }, [router, tournamentId])

    const fetchTournamentDetails = async (userId) => {
        try {
            setIsLoading(true)
            const tournamentRef = doc(db, "tournaments", tournamentId)
            const tournamentSnap = await getDoc(tournamentRef)

            if (tournamentSnap.exists()) {
                const tournamentData = {
                    ...tournamentSnap.data(),
                    id: tournamentSnap.id,
                }
                setTournament(tournamentData)

                // Check if user is already registered
                const participants = tournamentData.participants || []
                if (participants.includes(userId)) {
                    setIsRegistered(true)
                }
            } else {
                toast.error("The tournament you're looking for doesn't exist.")
                router.push("/tournaments")
            }
        } catch (error) {
            console.error("Error fetching tournament details:", error)
            toast.error("Failed to load tournament details. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegistration = async () => {
        if (isRegistered) return

        try {
            setIsRegistering(true)
            const tournamentRef = doc(db, "tournaments", tournamentId)

            // Get current tournament data to check available spots
            const currentData = await getDoc(tournamentRef)
            const currentTournament = currentData.data()

            if (currentTournament.usedSpots >= currentTournament.spots) {
                toast.error("This tournament is already full.")
                return
            }

            // Update the tournament document
            await updateDoc(tournamentRef, {
                usedSpots: (currentTournament.usedSpots || 0) + 1,
                participants: arrayUnion(user.uid),
            })

            // Update local state
            setTournament({
                ...tournament,
                usedSpots: (tournament.usedSpots || 0) + 1,
            })
            setIsRegistered(true)

            toast.success("You've successfully registered for this tournament!")
        } catch (error) {
            console.error("Registration failed:", error)
            toast.error("There was an error during registration. Please try again.")
        } finally {
            setIsRegistering(false)
        }
    }

    const handleLogout = async () => {
        try {
            await auth.signOut()
            router.push("/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/90">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading tournament details...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-background to-background/90 overflow-hidden">
            <ParticleBackground particleColor="#ffffff" density={30} speed={0.8} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <header className="w-full p-4 flex items-center justify-between z-10 border-b border-border/50 backdrop-blur-sm bg-background/30">
                <div className="flex items-center">
                    <Trophy className="h-6 w-6 text-primary mr-2" />
                    <h1 className="text-xl font-bold">ChampionsArena</h1>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="mb-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Dashboard</span>
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden"
                    >
                        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Trophy className="h-24 w-24 text-white/80" />
                            </motion.div>
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-4 left-6 text-white">
                                <h1 className="text-3xl font-bold">{tournament?.gameTitle}</h1>
                                <div className="flex items-center mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{formatDate(tournament?.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="bg-background/50 p-4 rounded-lg border border-border/50"
                                >
                                    <div className="flex items-center mb-2">
                                        <MapPin className="h-5 w-5 text-red-500 mr-2" />
                                        <h3 className="font-medium">Location</h3>
                                    </div>
                                    <p className="text-muted-foreground">{tournament?.location}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="bg-background/50 p-4 rounded-lg border border-border/50"
                                >
                                    <div className="flex items-center mb-2">
                                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                                        <h3 className="font-medium">Prize Pool</h3>
                                    </div>
                                    <p className="text-muted-foreground">{tournament?.prizePool}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="bg-background/50 p-4 rounded-lg border border-border/50"
                                >
                                    <div className="flex items-center mb-2">
                                        <Users className="h-5 w-5 text-blue-500 mr-2" />
                                        <h3 className="font-medium">Participants</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {tournament?.usedSpots || 0}/{tournament?.spots} spots filled
                                    </p>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="mb-8"
                            >
                                <h3 className="text-xl font-bold mb-3">Tournament Details</h3>
                                <div className="bg-background/50 p-4 rounded-lg border border-border/50">
                                    <p className="text-muted-foreground whitespace-pre-line">{tournament?.details}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="flex justify-center"
                            >
                                {isRegistered ? (
                                    <div className="bg-green-500/10 text-green-500 p-4 rounded-lg border border-green-500/30 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        <span>You are registered for this tournament</span>
                                    </div>
                                ) : (
                                    <Button
                                        size="lg"
                                        onClick={handleRegistration}
                                        disabled={isRegistering || tournament?.usedSpots >= tournament?.spots}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        {isRegistering ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : tournament?.usedSpots >= tournament?.spots ? (
                                            "Tournament Full"
                                        ) : (
                                            "Register Now"
                                        )}
                                    </Button>
                                )}
                            </motion.div>

                            {tournament?.createdAt && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="mt-8 text-xs text-muted-foreground text-center"
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>Tournament created on {new Date(tournament.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    )
}

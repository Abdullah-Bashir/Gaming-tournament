"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/app/components/particle-background"
import { Trophy, Users, Calendar, LogOut, Gamepad2, History, ChevronDown, UserCog } from "lucide-react"
import { auth, db } from "@/app/firebase"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"

import { UserHistory } from "./components/user-history"
import { TournamentList } from "./components/tournaments-list"

export default function Dashboard() {
    const [username, setUsername] = useState("Champion")
    const [user, setUser] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [tournaments, setTournaments] = useState([])
    const [userHistory, setUserHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showHistory, setShowHistory] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                setUsername(currentUser.displayName || "Champion")

                // Fetch user role from Firestore
                const userDoc = await getDoc(doc(db, "users", currentUser.uid))
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role)
                }

                fetchAllData(currentUser.uid)
            } else {
                router.push("/login")
            }
        })

        return () => unsubscribe()
    }, [router])

    const fetchAllData = async (userId) => {
        try {
            // Fetch all tournaments
            const tournamentsQuery = await getDocs(collection(db, "tournaments"))
            const tournamentData = tournamentsQuery.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setTournaments(tournamentData)

            // Filter tournaments where user is a participant
            const userTournaments = tournamentData.filter(tournament =>
                tournament.participants && tournament.participants.includes(userId)
            );
            setUserHistory(userTournaments)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setIsLoading(false)
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

    const toggleHistory = () => {
        setShowHistory(!showHistory)
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const features = [
        {
            icon: <Trophy className="h-8 w-8 text-amber-500" />,
            title: "Tournaments",
            description: "Join competitive gaming tournaments with players worldwide",
            color: "from-amber-500 to-red-600",
        },
        {
            icon: <Users className="h-8 w-8 text-blue-500" />,
            title: "Teams",
            description: "Create or join teams to compete in group tournaments",
            color: "from-blue-500 to-indigo-600",
        },
        {
            icon: <Calendar className="h-8 w-8 text-green-500" />,
            title: "Events",
            description: "Stay updated with upcoming gaming events and competitions",
            color: "from-green-500 to-emerald-600",
        },
        {
            icon: <Gamepad2 className="h-8 w-8 text-purple-500" />,
            title: "Games",
            description: "Browse our catalog of supported competitive games",
            color: "from-purple-500 to-pink-600",
        },
    ]

    return (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-background to-background/90 overflow-hidden">
            <ParticleBackground particleColor="#ffffff" density={30} speed={0.8} />

            <header className="w-full p-4 flex items-center justify-between z-10 border-b border-border/50 backdrop-blur-sm bg-background/30">
                <div className="flex items-center">
                    <Trophy className="h-6 w-6 text-primary mr-2" />
                    <h1 className="text-xl font-bold">ChampionsArena</h1>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {/* Dropdown Menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleDropdown}
                            className="gap-2 cursor-pointer flex items-center"
                        >
                            <span>{username}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>

                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border/50 backdrop-blur-sm z-20"
                            >
                                <div className="py-1">
                                    {userRole === "admin" && (
                                        <button
                                            onClick={() => router.push("/admin")}
                                            className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-accent"
                                        >
                                            <UserCog className="h-4 w-4 mr-2" />
                                            Admin Panel
                                        </button>
                                    )}
                                    <button
                                        onClick={toggleHistory}
                                        className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-accent"
                                    >
                                        <History className="h-4 w-4 mr-2" />
                                        History
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center px-4 py-2 text-sm w-full text-left hover:bg-accent"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    {showHistory ? (
                        <UserHistory userHistory={userHistory} toggleHistory={toggleHistory} />
                    ) : (
                        <>
                            <section className="mb-8 text-center">
                                <motion.h2
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
                                >
                                    Welcome back,{" "}
                                    <span className="text-black dark:text-white text-shadow-lg">{username}</span>
                                </motion.h2>
                                <p className="text-muted-foreground text-sm sm:text-base">
                                    Your gaming journey awaits. Explore tournaments, connect with players, and rise to the top.
                                </p>
                            </section>

                            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                                    >
                                        <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg inline-block mb-4`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </section>

                            <TournamentList tournaments={tournaments} isLoading={isLoading} />
                        </>
                    )}
                </motion.div>
            </main>
        </div>
    )
}
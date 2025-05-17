"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ParticleBackground } from "@/app/components/particle-background"
import { Trophy, Users, Calendar, LogOut, Gamepad2, History, ChevronDown, UserCog } from "lucide-react"
import { auth, db } from "@/app/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

import { UserHistory } from "./components/user-history"
import { TournamentList } from "./components/tournaments-list"
import dynamic from "next/dynamic";

// load TournamentMap only on the client, skip SSR
const TournamentMap = dynamic(
  () => import("./components/tournamentMap").then((mod) => mod.TournamentMap),
  { ssr: false }
);
export default function Dashboard() {
    const [username, setUsername] = useState("Champion")
    const [user, setUser] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [tournaments, setTournaments] = useState([])
    const [userHistory, setUserHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [showHistory, setShowHistory] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                setUsername(currentUser.displayName || "Champion")

                const userDoc = await getDoc(doc(db, "users", currentUser.uid))
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role)
                }

                fetchAllData(currentUser.uid)
            } else {
                router.push("/login")
            }
            setIsCheckingAuth(false)
        })

        return () => unsubscribe()
    }, [router])

    const fetchAllData = async (userId) => {
        try {
            const tournamentsQuery = await getDocs(collection(db, "tournaments"))
            const tournamentData = tournamentsQuery.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setTournaments(tournamentData)

            const userTournaments = tournamentData.filter(
                (tournament) =>
                    tournament.participants && tournament.participants.includes(userId)
            )
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

    // Filter tournaments based on search query (case-insensitive match on gameTitle or title)
    const filteredTournaments = tournaments.filter((tournament) =>
        tournament.gameTitle
            ? tournament.gameTitle.toLowerCase().includes(searchQuery.toLowerCase())
            : tournament.title
                ? tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
                : false
    )

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <span>{username}</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            {userRole === "admin" && (
                                <DropdownMenuItem onClick={() => router.push("/admin")}>
                                    <UserCog className="mr-2 h-4 w-4" />
                                    <span>Admin Panel</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={toggleHistory}>
                                <History className="mr-2 h-4 w-4" />
                                <span>History</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 z-10 max-w-6xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
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

                            {/* SEARCH BAR */}
                            <div className="mb-6 flex justify-center">
                                <input
                                    type="text"
                                    placeholder="Search tournaments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full max-w-md rounded-md border border-border/70 bg-background px-4 py-2 text-base text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>



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

                            <TournamentMap
                                tournaments={filteredTournaments}
                                center={[0, 0]}
                                zoom={2}
                            />

                            {/* TOURNAMENT LIST */}
                            <TournamentList tournaments={filteredTournaments} isLoading={isLoading} />
                        </>
                    )}
                </motion.div>
            </main>
        </div>
    )
}

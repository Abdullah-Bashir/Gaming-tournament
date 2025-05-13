"use client"

import { useState, useEffect } from "react"
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from "../firebase"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Users, Plus, LogOut } from "lucide-react"
import { ThemeToggle } from "../components/theme-toggle"
import { ParticleBackground } from "../components/particle-background"
import TournamentList from "./components/TournamentList"
import AddTournamentForm from "./components/AddTournamentPopup"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminPage() {
    const [tournaments, setTournaments] = useState([])
    const [adminName, setAdminName] = useState("Admin")
    const [showAddForm, setShowAddForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [tournamentToEdit, setTournamentToEdit] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const router = useRouter()

    const auth = getAuth()

    const fetchTournaments = async () => {
        setIsLoading(true)
        try {
            const querySnapshot = await getDocs(collection(db, "tournaments"))
            const tournamentData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setTournaments(tournamentData)
        } catch (error) {
            console.error("Error fetching tournaments:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const checkAdminStatus = async (userId) => {
        try {
            const userDocRef = doc(db, "users", userId)
            const userDocSnap = await getDoc(userDocRef)

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data()
                return userData.role === "admin"
            }
            return false
        } catch (error) {
            console.error("Error checking admin status:", error)
            return false
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const isUserAdmin = await checkAdminStatus(user.uid)
                setIsAdmin(isUserAdmin)

                if (isUserAdmin) {
                    setAdminName(user.displayName || "Admin")
                    fetchTournaments()
                } else {
                    router.push("/dashboard")
                }
            } else {
                router.push("/login")
            }
            setIsCheckingAuth(false)
        })

        return () => unsubscribe()
    }, [auth, router])

    // ... rest of your component code remains the same ...

    const handleAddTournament = async (newTournament) => {
        try {
            await addDoc(collection(db, "tournaments"), {
                ...newTournament,
                usedSpots: 0,
                createdAt: new Date().toISOString(),
            })
            fetchTournaments()
            setShowAddForm(false)
        } catch (error) {
            console.error("Error adding tournament:", error)
        }
    }

    const handleDeleteTournament = async (id) => {
        try {
            await deleteDoc(doc(db, "tournaments", id))
            fetchTournaments()
        } catch (error) {
            console.error("Error deleting tournament:", error)
        }
    }

    const handleEditTournament = async (updatedTournament) => {
        try {
            const tournamentRef = doc(db, "tournaments", updatedTournament.id)
            const { id, createdAt, usedSpots, ...updateData } = updatedTournament

            await updateDoc(tournamentRef, updateData)
            fetchTournaments()
            setTournamentToEdit(null)
        } catch (error) {
            console.error("Error updating tournament:", error)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push("/login")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const stats = [
        {
            icon: <Trophy className="h-6 w-6 text-amber-500" />,
            title: "Total Tournaments",
            value: tournaments.length,
            color: "from-amber-500 to-red-600",
        },
        {
            icon: <Users className="h-6 w-6 text-blue-500" />,
            title: "Total Spots",
            value: tournaments.reduce((total, t) => total + (t.spots || 0), 0),
            color: "from-blue-500 to-indigo-600",
        },
        {
            icon: <Users className="h-6 w-6 text-purple-500" />,
            title: "Used Spots",
            value: tournaments.reduce((total, t) => total + (t.usedSpots || 0), 0),
            color: "from-purple-500 to-pink-600",
        },
        {
            icon: <Users className="h-6 w-6 text-green-500" />,
            title: "Total Prize Pool ($)",
            value: tournaments.reduce((total, t) => {
                const prize = t.prizePool ? Number.parseFloat(t.prizePool.replace(/[^\d.-]/g, "")) : 0
                return total + prize
            }, 0),
            color: "from-green-500 to-emerald-600",
        },
        {
            icon: <Users className="h-6 w-6 text-yellow-500" />,
            title: "Available Spots for Registration",
            value: tournaments.reduce((total, t) => total + ((t.spots || 0) - (t.usedSpots || 0)), 0),
            color: "from-yellow-500 to-orange-600",
        },
    ]

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-background to-background/90 overflow-hidden">
            <ParticleBackground particleColor="var(--foreground)" density={30} speed={0.8} />

            <header className="w-full p-4 flex items-center justify-between z-10 border-b border-border/50 backdrop-blur-sm bg-background/30">
                <div className="flex items-center">
                    <Trophy className="h-6 w-6 text-primary mr-2" />
                    <h1 className="text-xl font-bold">Tournament Admin</h1>
                </div>
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center mr-4"
                    >
                        <div className="text-right mr-2">
                            <p className="text-sm text-muted-foreground">Welcome,</p>
                            <p className="font-medium">{adminName}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white flex items-center justify-center font-bold cursor-pointer"
                                >
                                    {adminName
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")}
                                </motion.div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mr-4">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ThemeToggle />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                    <LogOut className="ml-auto h-4 w-4" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
                    {/* <div className="flex gap-2">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </motion.button>
                    </div> */}
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    <section className="mb-8 text-center">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
                        >
                            Tournament Management Dashboard
                        </motion.h2>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Manage all your gaming tournaments in one place
                        </p>
                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg inline-block mb-4`}>{stat.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{stat.title}</h3>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </motion.div>
                        ))}
                    </section>

                    <section className="mb-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="w-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center justify-center hover:shadow-lg transition-all"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            {showAddForm ? "Hide Form" : "Add New Tournament"}
                        </motion.button>
                    </section>

                    <AnimatePresence>
                        {showAddForm && (
                            <motion.section
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 overflow-hidden"
                            >
                                <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                                    <AddTournamentForm onSubmit={handleAddTournament} />
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6"
                    >
                        <TournamentList
                            tournaments={tournaments}
                            onDelete={handleDeleteTournament}
                            onEdit={setTournamentToEdit}
                            isLoading={isLoading}
                        />
                    </motion.section>
                </motion.div>
            </main>

            <AnimatePresence>
                {tournamentToEdit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] "
                        >
                            <AddTournamentForm
                                tournamentToEdit={tournamentToEdit}
                                onSubmit={handleEditTournament}
                                onCancel={() => setTournamentToEdit(null)}
                                isEdit={true}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

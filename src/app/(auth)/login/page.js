"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase"; // ✅ Firestore instead of rtdb
import { doc, getDoc } from "firebase/firestore"; // ✅ Firestore

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Gamepad2, ArrowLeft, Loader2 } from "lucide-react";
import { ParticleBackground } from "@/app/components/particle-background";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // ✅ Fetch user from Firestore
            const userDocRef = doc(db, "users", uid);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                throw new Error("User record not found in Firestore.");
            }

            const userData = userSnapshot.data();
            const { role } = userData;

            if (!role) throw new Error("User role is missing in user data.");

            toast.success("Login successful!");
            router.push(role === "admin" ? "/admin" : "/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            if (error.code === "auth/user-not-found") {
                toast.error("No user found with this email");
            } else if (error.code === "auth/wrong-password") {
                toast.error("Incorrect password");
            } else {
                toast.error(error.message || "Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90 relative overflow-hidden">
            <ParticleBackground />

            <div className="w-full flex items-center justify-between px-4 py-3 z-10">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="group">
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </Link>
                <ThemeToggle />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <div className="bg-card/30 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 sm:p-6">

                            <div className="flex items-center justify-center mb-4">
                                <motion.div
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl"
                                >
                                    <Gamepad2 className="h-6 w-6 text-white" />
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-xl font-bold ml-3 text-foreground"
                                >
                                    Login to ChampionsArena
                                </motion.h1>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                    <Label htmlFor="email" className="text-foreground/80 text-sm">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="mt-1 bg-background/50 text-sm"
                                    />
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <Label htmlFor="password" className="text-foreground/80 text-sm">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="mt-1 bg-background/50 text-sm"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-2"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <span className="relative z-10 text-sm">Login</span>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 text-center text-xs"
                            >
                                <p className="text-muted-foreground">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                        Sign up
                                    </Link>
                                </p>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

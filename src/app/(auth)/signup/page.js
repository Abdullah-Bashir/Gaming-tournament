"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, setDoc, getDoc, serverTimestamp, } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { Trophy, ArrowLeft, Loader2 } from "lucide-react";
import { ParticleBackground } from "@/app/components/particle-background";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: username });

            await setDoc(doc(db, "users", cred.user.uid), {
                uid: cred.user.uid,
                email,
                displayName: username,
                role: "user",
                tournaments: [],              // empty refs array
                createdAt: serverTimestamp(),
                authProvider: "password",
            });

            toast.success("Signup successful! Please log in.");
            router.push("/login");
        } catch (err) {
            toast.error(err.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };


    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                // create only if new
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: "user",
                    tournaments: [],
                    createdAt: serverTimestamp(),
                    authProvider: "google",
                });
            }

            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err) {
            if (err.code !== "auth/popup-closed-by-user" &&
                err.code !== "auth/cancelled-popup-request") {
                toast.error(err.message || "Google sign-in failed");
            }
        } finally {
            setIsGoogleLoading(false);
        }

    };


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90 relative overflow-hidden mt-3">
            <ParticleBackground />

            <div className="w-full flex items-center justify-between px-4 z-10">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="group">
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </Link>
                <ThemeToggle />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <div className="bg-card/30 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 sm:p-6">
                            {/* header */}
                            <div className="flex items-center justify-center mb-4">
                                <motion.div
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="bg-gradient-to-br from-amber-500 to-red-600 p-2 rounded-xl"
                                >
                                    <Trophy className="h-6 w-6 text-white" />
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-xl font-bold ml-3 text-foreground"
                                >
                                    Join ChampionsArena
                                </motion.h1>
                            </div>

                            {/* Google button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                                className="w-full mb-4 flex items-center justify-center gap-2 bg-background/50 hover:bg-background/80"
                            >
                                {isGoogleLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="text-sm">Continue with Google</span>
                                    </>
                                )}
                            </Button>

                            {/* divider */}
                            <div className="relative my-4 text-xs flex items-center">
                                <div className="flex-grow border-t border-border/50" />
                                <span className="px-2 bg-card/30 text-muted-foreground">or</span>
                                <div className="flex-grow border-t border-border/50" />
                            </div>

                            {/* email/password form */}
                            <form onSubmit={handleSignup} className="space-y-3">
                                <div>
                                    <Label htmlFor="username" className="text-foreground/80 text-sm">Username</Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a username"
                                        required
                                        className="mt-1 bg-background/50 text-sm"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-foreground/80 text-sm">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="mt-1 bg-background/50 text-sm"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-foreground/80 text-sm">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                        className="mt-1 bg-background/50 text-sm"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>

                            {/* footer */}
                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                                    Login
                                </Link>
                            </p>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

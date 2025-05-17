"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            // Optional: fetch your user doc
            const userRef = doc(db, "users", userCredential.user.uid);
            await getDoc(userRef);

            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (error) {
            const code = error.code;
            if (code === "auth/user-not-found") {
                toast.error("No user found with this email");
            } else if (code === "auth/wrong-password") {
                toast.error("Incorrect password");
            } else {
                toast.error(error.message || "Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            // Create Firestore doc if new
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    authProvider: "google",
                    createdAt: serverTimestamp(),
                });
            }

            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err) {
            if (
                err.code !== "auth/popup-closed-by-user" &&
                err.code !== "auth/cancelled-popup-request"
            ) {
                toast.error(err.message || "Google sign-in failed");
            }
        } finally {
            setIsGoogleLoading(false);
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

            <div className="flex flex-1 items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 sm:p-8">
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
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold ml-2"
                                >
                                    Welcome Back
                                </motion.h1>
                            </div>

                            {/* Google sign-in button */}
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
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.15c-.26
                        1.37-1.04 2.53-2.22 3.31v2.77h3.57c2.08-1.92 
                        3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 
                        5.46-1 7.28-2.72l-3.57-2.77c-.98.66-2.23 
                        1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                        20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 1.5l2.85 
                        2.22c1.05-1.01 2.43-1.62 4.07-1.62 1.38 
                        0 2.63.45 3.62 1.22l2.84-2.84C17.46.46 14.97 
                        0 12 0 7.7 0 3.99 2.47 2.18 6.08l3.66 
                        2.22z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M23.64 4.5l-2.84 
                        2.84c.15.42.23.87.23 1.34 0 .47-.08.92-.23 
                        1.34l2.84 2.84C23.95 12.87 24 12 
                        24 12s-.05-.87-.36-1.5z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        <span className="text-sm">Sign in with Google</span>
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
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="text-foreground/80 text-sm"
                                    >
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
                                </div>
                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="text-foreground/80 text-sm"
                                    >
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
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>

                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

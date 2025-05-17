"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/app/components/particle-background";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/app/components/theme-toggle";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // renamed to your variable name

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80 overflow-hidden">
    

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 text-center space-y-6 max-w-3xl w-full">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 animate-text">
          ChampionsArena
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto mb-6">
          Join the ultimate gaming tournament platform and become a legend
        </p>

        {user && (
          <div className="mt-6 text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
            >
              Welcome back,{" "}
              <span className="text-white ">{user.displayName || user.email}</span>!
            </motion.h2>
            <p className="text-lg sm:text-xl text-muted-foreground mt-2">
              We&apos;re glad to have you here again
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto relative overflow-hidden group border-purple-500 hover:border-purple-700 transition-all duration-300"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto relative overflow-hidden group bg-gradient-to-r from-green-600 to-blue-600 hover:bg-gradient-to-r hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={handleLogout}
                className="w-full sm:w-auto relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                <span className="relative z-10 text-white">Logout</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

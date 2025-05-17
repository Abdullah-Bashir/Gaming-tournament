"use client";

import { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

export default function AnimatedBackground() {
  const divRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current && divRef.current) {
      vantaEffect.current = NET({
        el: divRef.current,
        THREE,
        mouseControls: true,   // follows your cursor
        touchControls: true,   // mobile touch interactions
        gyroControls: true,    // tilt on supported devices
        minHeight: 500.0,
        minWidth: 500.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x0d0f12, // darker charcoal
        color: 0x1e90ff,           // neon blue primary
        color2: 0x551a8b,          // secondary purple accent
        maxDistance: 40.0,         // how far lines stretch
        spacing: 18.0,             // distance between net nodes
        showDots: true,            // enable glowing nodes
        points: 12.0,              // density of nodes
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -2,       // behind everything, even neon gradient (-1)
        pointerEvents: "none",
      }}
    />
  );
}

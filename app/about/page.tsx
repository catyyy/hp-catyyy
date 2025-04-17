"use client";

import Navbar from "@/components/Navbar";
import AboutNetworkGraphComponent from "@/components/AboutNetworkGraph";
import FloatingCards from "@/components/FloatingCards";
import { useState } from "react";

export default function About() {
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  return (
    <main className="relative min-h-screen bg-black">
      <AboutNetworkGraphComponent setPoints={setPoints} />
      <FloatingCards points={points} />
      <Navbar />
    </main>
  );
}
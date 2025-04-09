"use client";

import Navbar from "@/components/Navbar";
import AboutNetworkGraphComponent from "@/components/AboutNetworkGraph";
import FloatingCards from "@/components/FloatingCards";

export default function About() {
  return (
    <main className="relative min-h-screen bg-black">
      <AboutNetworkGraphComponent />
      <FloatingCards />
      <Navbar />
    </main>
  );
}
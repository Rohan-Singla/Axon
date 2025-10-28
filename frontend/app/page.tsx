"use client"
import Header from "@/components/layout/header"
import Hero from "@/components/hero"
import Problem from "@/components/problem"
import Solution from "@/components/solution"
import HowItWorks from "@/components/how-it-works"
import Features from "@/components/features"
import Team from "@/components/team"
import FuturePlans from "@/components/future-plans"
import DemoVideo from "@/components/demo-video"
import Footer from "@/components/layout/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <DemoVideo />
      <Team />
      <FuturePlans />
      <Footer />
    </main>
  )
}

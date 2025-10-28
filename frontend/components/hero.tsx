"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center z-10"
      >
        <motion.div className="mb-6">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary font-medium">
            🚀 Built for Cypherpunk Hackathon on Solana
          </span>
        </motion.div>

        <motion.h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Stack Sats with{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Any Hashrate
          </span>
        </motion.h1>

        <motion.p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Bitcoin micropayments powered by Solana. Revolutionizing mining pools for small miners with instant, low-cost
          payouts.
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-3 cursor-pointer bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 group">
            View Demo Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </motion.div>

        <motion.div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-accent">0.00001</div>
            <div className="text-sm text-muted-foreground">Min Contribtion Required (BTC)</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">Instant</div>
            <div className="text-sm text-muted-foreground">Settlement</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">∞</div>
            <div className="text-sm text-muted-foreground">Scalability</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

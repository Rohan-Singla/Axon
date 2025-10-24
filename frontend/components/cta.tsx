"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-12 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>

        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to Stack Sats?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the revolution. Start mining with Project Axon today and earn Bitcoin rewards with any hashrate.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 group">
            Launch Mining Pool
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button className="px-8 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition">
            Join Community
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-accent">Hackathon</div>
            <div className="text-xs text-muted-foreground">Cypherpunk 2024</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">Solana</div>
            <div className="text-xs text-muted-foreground">Powered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">Open Source</div>
            <div className="text-xs text-muted-foreground">Coming Soon</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-card border-t border-border py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">AXON</span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="https://x.com/AxonForMiners" className="hover:text-primary transition font-bold">
              X
            </a>
            <a href="https://github.com/Rohan-Singla/axon/" className="hover:text-primary transition">
              GitHub
            </a>
          </div>

          <p className="text-sm text-muted-foreground text-center sm:text-right">
            &copy; 2025 Project Axon • Built for Cypherpunk Hackathon
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

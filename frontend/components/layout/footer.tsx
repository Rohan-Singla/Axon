"use client"

import { motion } from "framer-motion"
import { Github, Zap } from "lucide-react"

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
            <a href="https://x.com/AxonForMiners" className="flex items-center justify-center hover:text-primary transition font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                  </svg>
            </a>
            <a href="https://github.com/Rohan-Singla/axon/" className="flex hover:text-primary transition">
              <Github />
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

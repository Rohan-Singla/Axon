"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-default">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AXON
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#problem" className="text-sm hover:text-primary transition">
            Problem
          </Link>
          <Link href="/#solution" className="text-sm hover:text-primary transition">
            Solution
          </Link>
          <Link href="/#how-it-works" className="text-sm hover:text-primary transition">
            How It Works
          </Link>
          <Link href="/#features" className="text-sm hover:text-primary transition">
            Features
          </Link>
        </nav>
        <Link href="/miner" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
          Claim Payout
        </Link>
      </div>
    </motion.header>
  )
}

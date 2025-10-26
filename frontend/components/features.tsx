"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Users, TrendingUp, Lock, Cpu } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Trustless",
      description: "Our secure backend ensures fair distribution based on share contribution.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant settlements powered by Solana's high-speed blockchain.",
    },
    {
      icon: Users,
      title: "Open Source",
      description: "Axon is fully open source and available on Github.",
    },
    {
      icon: TrendingUp,
      title: "No Minimum Threshold",
      description: "Stack sats no matter how small your hashrate contribution.",
    },
    {
      icon: Lock,
      title: "Non-Custodial",
      description: "You control your private keys and funds at all times.",
    },
    {
      icon: Cpu,
      title: "Optimized for Small Miners",
      description: "Designed specifically for Bitaxe and similar home mining devices but anyone can join the pool.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to mine Bitcoin profitably, no matter your hashrate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-6 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-card/50 transition group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

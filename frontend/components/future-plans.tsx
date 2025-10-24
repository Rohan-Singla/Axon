"use client"

import { motion } from "framer-motion"
import { Zap, TrendingUp, Shield, Globe } from "lucide-react"

const plans = [
  {
    icon: Zap,
    title: "Layer 2 Integration",
    description: "Expand to Solana's Layer 2 solutions for even faster, cheaper transactions",
    timeline: "Q2 2025",
  },
  {
    icon: TrendingUp,
    title: "Multi-Chain Support",
    description: "Bring Project Axon to Ethereum, Polygon, and other major blockchains",
    timeline: "Q3 2025",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Implement multi-sig wallets and enhanced security protocols for large pools",
    timeline: "Q2 2025",
  },
  {
    icon: Globe,
    title: "Global Expansion",
    description: "Launch regional mining pools optimized for different geographic locations",
    timeline: "Q4 2025",
  },
]

export default function FuturePlans() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Future Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our roadmap for scaling Bitcoin micropayments across the Web3 ecosystem
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-card to-background border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-accent/30 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{plan.title}</h3>
                      <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {plan.timeline}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

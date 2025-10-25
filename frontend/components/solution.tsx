"use client"

import { motion } from "framer-motion"
import { Zap, Coins, Layers } from "lucide-react"

export default function Solution() {
  const solutions = [
    {
      icon: Zap,
      title: "Solana Micropayments",
      description: "Leverage Solana's speed and low fees to enable instant micropayments to miners.",
      color: "from-primary to-primary/50",
    },
    {
      icon: Coins,
      title: "zBTC Bridge",
      description: "Use Apollo Portal to bridge BTC to zBTC, creating a Bitcoin-equivalent on Solana.",
      color: "from-accent to-accent/50",
    },
    {
      icon: Layers,
      title: "Stratum Protocol",
      description: "Custom Stratum implementation allowing miners to submit shares and receive proportional rewards.",
      color: "from-primary to-accent",
    },
  ]

  return (
    <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Solution</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A revolutionary approach combining Solana's speed, Bitcoin's security, and community-driven mining.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 bg-gradient-to-br ${solution.color} rounded-xl border border-primary/20 hover:border-primary/50 transition group cursor-pointer`}
            >
              <div className="bg-background/80 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-background transition">
                <solution.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">{solution.title}</h3>
              <p className="text-foreground/80">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

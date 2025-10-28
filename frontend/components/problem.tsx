"use client"

import { motion } from "framer-motion"
import { AlertCircle, TrendingDown } from "lucide-react"

export default function Problem() {
  const problems = [
    {
      icon: AlertCircle,
      title: "High Minimum Payouts",
      description: "Bitcoin pools require 0.001 BTC minimum due to gas fees and Lightning Network limitations.",
    },
    {
      icon: TrendingDown,
      title: "Impossible for Small Miners",
      description: "Small Devices like Bitaxe (1-8 TH/s) can't reach minimum thresholds, making pool mining impractical.",
    },
    {
      icon: AlertCircle,
      title: "Centralization Risk",
      description: "Only major mining players can operate pools, leading to network centralization.",
    },
  ]

  return (
    <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Problem</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bitcoin mining is broken for small miners. High barriers to entry and impossible minimum payouts exclude the
            community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-background border border-border rounded-xl hover:border-primary/50 transition"
            >
              <problem.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

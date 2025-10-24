"use client"

import { motion } from "framer-motion"

export default function Architecture() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Technical Architecture</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built on proven technologies for reliability and scalability.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-background border border-border rounded-xl p-8 overflow-x-auto"
        >
          <div className="min-w-max">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-primary-foreground text-center px-2">Bitcoin Network</span>
                </div>
              </div>
              <div className="text-2xl text-primary">→</div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/50 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-accent-foreground text-center px-2">Apollo Portal</span>
                </div>
              </div>
              <div className="text-2xl text-primary">→</div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-primary-foreground text-center px-2">Solana Chain</span>
                </div>
              </div>
              <div className="text-2xl text-primary">→</div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-primary/50 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-accent-foreground text-center px-2">Miner Wallets</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-bold text-primary mb-2">Mining Pool (Stratum)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom Stratum v1 implementation</li>
                <li>• Share validation & tracking</li>
                <li>• Real-time difficulty adjustment</li>
              </ul>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-bold text-accent mb-2">Smart Contracts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automated reward distribution</li>
                <li>• zBTC minting & burning</li>
                <li>• Transparent accounting</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

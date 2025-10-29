"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import thumbnail from "../public/image.png"
export default function DemoVideo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">See It In Action</h2>
          <p className="text-lg text-muted-foreground">
            Watch our Pitch Deck to understand how Project Axon revolutionizes Bitcoin mining
          </p>
        </motion.div>

<a href="https://www.loom.com/share/6262cd3b06b94c3ea1485fa9037fb6ab"    target="_blank">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative rounded-2xl overflow-hidden border border-border bg-background aspect-video flex items-center justify-center">
            <Image src={thumbnail} alt="Project Axon Demo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/50"
              >
                <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
              </motion.div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </motion.div>
  
</a>

        {/* Demo video link section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Our Pitch Deck is available on Loom to watch.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.loom.com/share/6262cd3b06b94c3ea1485fa9037fb6ab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-primary/10 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/20 transition"
            >
              Watch on Loom
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

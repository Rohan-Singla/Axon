"use client"

import { motion } from "framer-motion"
import { Github, X } from "lucide-react"

const team = [
  {
    name: "Rohan Singla",
    role: "Full Stack & Solana Dev",
    socials: { github: "https://github.com/Rohan-Singla", twitter: "https://x.com/rohanBuilds/" },
  },
  {
    name: "Kavyam Singh",
    role: "Backend & Solana Dev",
    socials: { github: "https://github.com/Kym0211", twitter: "https://x.com/KavyamSingh" },
  },
  {
    name: "Ishan Raghuvanshi",
    role: "Solana Dev",
    socials: { github: "https://github.com/IshanHunt77", twitter: "https://x.com/ishantwtss" },
  },
  {
    name: "Love Gupta",
    role: "Solana and Backend Dev ",
    socials: { github: "https://github.com/Lovegupta112", twitter: "https://x.com/MeLovegupta"},
  },
]

export default function Team() {
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Meet the Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate team of builders behind Axon.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold mb-1">{member.name}</h3>
              <p className="text-sm text-accent font-semibold mb-3">{member.role}</p>
              <div className="gap-3 flex text-base">
                <a href={member.socials.github} className="text-muted-foreground hover:text-primary transition">
                  <Github  />
                </a>
                <a href={member.socials.twitter} className="text-muted-foreground hover:text-primary transition font-bold text-xl">
                  X
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

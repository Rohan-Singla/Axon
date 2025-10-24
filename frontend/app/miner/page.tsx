"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, Zap, ArrowRight } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

export default function MinerDashboard() {
  const { publicKey, connected } = useWallet();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              Miner Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect your wallet to view your rewards and claim your zBTC
            </p>
          </motion.div>

          {/* Main Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-card to-background border border-border rounded-2xl p-8 sm:p-12 mb-8"
          >
            {!connected ? (
              // Not Connected
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Connect your Solana wallet to access your mining rewards and
                  claim your zBTC earnings
                </p>

                <div className="flex justify-center">
                  <WalletMultiButton className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 group mx-auto" />
                </div>
              </div>
            ) : (
              // Connected State
              <div>
                <div className="mb-8 pb-8 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Wallet Connected</h2>
                    <WalletDisconnectButton className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-card transition" />
                  </div>
                  <p className="text-lg text-gray-400">
                    {publicKey?.toBase58() || "Fetching address..."}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-background border border-border rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Total Earned
                      </h3>
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold">2.45 zBTC</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      ≈ $98,500 USD
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-background border border-border rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Pending Rewards
                      </h3>
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">0.32 zBTC</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Next payout in 2 days
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-background border border-border rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Hashrate
                      </h3>
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold">125 TH/s</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Active mining
                    </p>
                  </motion.div>
                </div>

                {/* Claim Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-8 text-center"
                >
                  <h3 className="text-xl font-bold mb-2">
                    Ready to Claim Your Rewards?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You have 0.32 zBTC available to claim. This will be
                    transferred to your connected wallet (which you used in the config of your mining device).
                  </p>
                  <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center gap-2 group mx-auto">
                    Claim zBTC Rewards
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                </motion.div>

                {/* Recent Activity */}
                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      {
                        date: "2 hours ago",
                        action: "Earned 0.05 zBTC",
                        status: "Pending",
                      },
                      {
                        date: "1 day ago",
                        action: "Claimed 0.25 zBTC",
                        status: "Completed",
                      },
                      {
                        date: "3 days ago",
                        action: "Earned 0.15 zBTC",
                        status: "Completed",
                      },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-background border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            activity.status === "Completed"
                              ? "bg-accent/20 text-accent"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-bold mb-3">How It Works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Connect your Solana wallet (which you used in the config of your mining device)</li>
                <li>• Claim zBTC based on contribution</li>
                <li>• Claim your reward in zBTC anytime</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-bold mb-3">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our TG for channel for to be a part of the community or be on the waitlist!
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-sm text-accent hover:underline">
                  Telegram
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

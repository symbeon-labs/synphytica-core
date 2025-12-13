"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CryptoFunding() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState("");

    const WALLETS = [
        { id: "ETH", label: "ETHEREUM (ERC-20)", address: "0x71C...a92F", full: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
        { id: "SOL", label: "SOLANA (SPL)", address: "DeSci...9Xq2", full: "DeSciDAO8i3j2kL92j23u9238j2938u283u2983u298" },
        { id: "BTC", label: "BITCOIN (SEG)", address: "bc1q...92kz", full: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" }
    ];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text); // In a real scenario usage
        setCopied(id);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <>
            {/* TRIGGER BUTTON (Header) */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-gold-400 hover:text-gold-400 transition-all group"
            >
                <div className="relative w-2 h-2">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs font-mono font-bold tracking-wider">SUPPORT_R&D</span>
            </button>

            {/* MODAL OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Terminal Window */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#05080f] border border-gold-500/30 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.1)] overflow-hidden"
                        >
                            {/* Terminal Bar */}
                            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center handle">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                </div>
                                <div className="text-[10px] font-mono text-gray-500">ANONYMOUS_FUNDING_PROTOCOL.exe</div>
                            </div>

                            {/* Content */}
                            <div className="p-6 font-mono">
                                <div className="mb-6 text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">ACCELERATE THE SINGULARITY</h3>
                                    <p className="text-xs text-gold-500 animate-pulse">NO KYC. NO BANKS. PURE SCIENCE.</p>
                                </div>

                                <div className="space-y-4">
                                    {WALLETS.map(wallet => (
                                        <div key={wallet.id} className="group">
                                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                                <span>{wallet.label}</span>
                                                {copied === wallet.id && <span className="text-green-400">COPIED TO CLIPBOARD</span>}
                                            </div>
                                            <div
                                                onClick={() => handleCopy(wallet.full, wallet.id)}
                                                className="relative bg-white/5 border border-white/10 p-3 rounded cursor-pointer hover:bg-white/10 hover:border-gold-500/50 transition-colors flex items-center justify-between"
                                            >
                                                <code className="text-xs text-gray-300 truncate font-mono">{wallet.address}</code>
                                                <svg className="w-4 h-4 text-gray-500 group-hover:text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z" /></svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-4 border-t border-white/10 text-center">
                                    <p className="text-[9px] text-gray-500 leading-relaxed uppercase">
                                        Funds are allocated directly to GPU Compute Clusters for SynPhytica Model Training.
                                        <br />Transactions are immutable.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
export interface WalletConfig {
    id: string;
    chain: 'ETH' | 'SOL' | 'BTC' | string;
    label: string;
    address: string;
}

export interface NFTConfig {
    enabled: boolean;
    collectionName?: string;
    mintFee?: string;
}

export interface GhostFundProps {
    projectId?: string;
    wallets?: WalletConfig[];
    nft?: NFTConfig;
    title?: string;
    tagline?: string;
    theme?: {
        primary: string;
        background: string;
    };
    triggerLabel?: string;
    /** URL do Webhook do Trinity AI Agent para verificação real */
    webhookUrl?: string;
}

// --- ICONS ---
const Icons = {
    Copy: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z" /></svg>,
    Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
    Mint: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    Close: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
};

// --- COMPONENT ---

export const CryptoFunding = ({
    projectId = "synphytica_core",
    wallets = [
        { id: 'eth', chain: 'ETH', label: 'Research DAO', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { id: 'sol', chain: 'SOL', label: 'Treasury', address: 'DeSo...9Xq2' }
    ],
    nft = { enabled: true, collectionName: "SynPhytica Genesis Patron", mintFee: "0.05 ETH" },
    title = "GHOST FUND PROTOCOL",
    tagline = "ANONYMOUS SUPPORT CHANNEL",
    theme = { primary: "#00FFCC", background: "#0a0a0a" },
    triggerLabel = "SUPPORT RESEARCH",
    webhookUrl
}: GhostFundProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'DONATE' | 'CLAIM'>('DONATE');
    const [copied, setCopied] = useState("");

    // Claim Logic States
    const [txHash, setTxHash] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [claimStatus, setClaimStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState("");

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(""), 2000);
    };

    const verifyTransaction = async () => {
        if (txHash.length < 10) return;
        setVerifying(true);
        setErrorMsg("");

        // TRINITY INTEGRATION LOGIC
        if (webhookUrl) {
            try {
                const res = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId,
                        txHash,
                        network: wallets[0].chain
                    })
                });

                const data = await res.json();
                if (res.ok && data.valid) {
                    setClaimStatus('SUCCESS');
                } else {
                    setClaimStatus('ERROR');
                    setErrorMsg(data.message || "Verification failed on-chain.");
                }
            } catch (e) {
                setClaimStatus('ERROR');
                setErrorMsg("Trinity Agent unreachable.");
            } finally {
                setVerifying(false);
            }
            return;
        }

        // Fallback Mock (Development Mode)
        setTimeout(() => {
            setVerifying(false); // Simulate verify
            setClaimStatus('SUCCESS');
        }, 2000);
    };

    return (
        <>
            {/* TRIGGER BUTTON */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#00FFCC]/30 rounded-full text-[#00FFCC] font-mono text-sm hover:bg-[#00FFCC]/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,204,0.1)]"
            >
                <Icons.Mint />
                <span>{triggerLabel}</span>
            </motion.button>

            {/* MODAL */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#050510] border border-[#00FFCC]/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,204,0.1)]"
                        >
                            {/* HEADER */}
                            <div className="p-6 border-b border-[#00FFCC]/10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
                                        Scan complete
                                        <span className="text-[#00FFCC]">_</span>
                                    </h3>
                                    <p className="text-xs text-gray-400 font-mono mt-1">{tagline}</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <Icons.Close />
                                </button>
                            </div>

                            {/* TABS */}
                            <div className="flex border-b border-[#00FFCC]/10">
                                <button
                                    onClick={() => setMode('DONATE')}
                                    className={`flex-1 py-3 text-sm font-mono transition-colors ${mode === 'DONATE' ? 'bg-[#00FFCC]/10 text-[#00FFCC]' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    // DONATE
                                </button>
                                {nft && nft.enabled && (
                                    <button
                                        onClick={() => setMode('CLAIM')}
                                        className={`flex-1 py-3 text-sm font-mono transition-colors ${mode === 'CLAIM' ? 'bg-[#00FFCC]/10 text-[#00FFCC]' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        // CLAIM PROOF
                                    </button>
                                )}
                            </div>

                            {/* CONTENT */}
                            <div className="p-6 space-y-4">
                                {mode === 'DONATE' ? (
                                    // DONATE MODE
                                    <div className="space-y-4">
                                        <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded text-xs text-blue-200 font-mono">
                                            ℹ️ 100% of funds go directly to research wallets. No platform fees.
                                        </div>

                                        {wallets.map((wallet) => (
                                            <div key={wallet.id} className="space-y-2">
                                                <div className="flex justify-between text-xs text-gray-400 font-mono uppercase">
                                                    <span>{wallet.chain} NETWORK</span>
                                                    <span>{wallet.label}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(wallet.address, wallet.id)}
                                                    className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded hover:border-[#00FFCC]/50 hover:bg-[#00FFCC]/5 transition-all group group-hover:shadow-[0_0_15px_rgba(0,255,204,0.15)]"
                                                >
                                                    <code className="text-sm text-gray-300 font-mono truncate mr-4">
                                                        {wallet.address}
                                                    </code>
                                                    <div className="text-[#00FFCC]">
                                                        {copied === wallet.id ? <Icons.Check /> : <Icons.Copy />}
                                                    </div>
                                                </button>
                                            </div>
                                        ))}

                                        {nft && nft.enabled && (
                                            <div className="pt-2 text-center">
                                                <p className="text-xs text-gray-500 font-mono">
                                                    Donated? Switch to <button onClick={() => setMode('CLAIM')} className="text-[#00FFCC] hover:underline">CLAIM PROOF</button> tab to mint your badge.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    // CLAIM MODE
                                    <div className="space-y-4">
                                        <div className="text-center pb-4">
                                            {/* NFT Badge Preview - Holographic Style */}
                                            <div className="relative w-32 h-32 mx-auto mb-4">
                                                {/* Glow Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#00FFCC] via-purple-500 to-gold-400 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
                                                
                                                {/* Badge Container */}
                                                <div className="relative w-full h-full bg-gradient-to-br from-[#00FFCC]/20 via-purple-500/20 to-gold-400/20 rounded-2xl border-2 border-[#00FFCC]/30 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(0,255,204,0.3)]">
                                                    {/* Animated Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]"></div>
                                                    
                                                    {/* Icon/Symbol */}
                                                    <div className="relative z-10">
                                                        <svg className="w-16 h-16 text-[#00FFCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                        </svg>
                                                    </div>
                                                    
                                                    {/* Corner Accents */}
                                                    <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#00FFCC]/50"></div>
                                                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-purple-400/50"></div>
                                                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-purple-400/50"></div>
                                                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gold-400/50"></div>
                                                </div>
                                            </div>
                                            
                                            <h4 className="text-white font-bold">{nft!.collectionName}</h4>
                                            <p className="text-xs text-gray-400 mt-1 font-mono">Mint Fee: {nft!.mintFee} (Goes to Protocol dev)</p>
                                        </div>

                                        {claimStatus === 'SUCCESS' ? (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="p-4 bg-green-900/20 border border-green-500/30 rounded text-center"
                                            >
                                                <div className="text-green-400 text-4xl mb-2">✓</div>
                                                <h5 className="text-white font-bold">VERIFIED</h5>
                                                <p className="text-xs text-green-200 mt-2 font-mono">Your badge has been minted and sent to the donor wallet.</p>
                                            </motion.div>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-gray-400 font-mono uppercase">Transaction Hash</label>
                                                    <input
                                                        type="text"
                                                        value={txHash}
                                                        onChange={(e) => setTxHash(e.target.value)}
                                                        placeholder="0x..."
                                                        className="w-full p-3 bg-white/5 border border-white/10 rounded text-white font-mono focus:border-[#00FFCC] focus:outline-none transition-colors"
                                                    />
                                                </div>

                                                {errorMsg && (
                                                    <div className="p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300 font-mono">
                                                        ⚠ {errorMsg}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={verifyTransaction}
                                                    disabled={verifying || txHash.length < 5}
                                                    className={`w-full py-3 rounded font-bold text-black transition-all ${verifying || txHash.length < 5
                                                        ? 'bg-gray-600 cursor-not-allowed'
                                                        : 'bg-[#00FFCC] hover:bg-[#00FFCC]/90 shadow-[0_0_20px_rgba(0,255,204,0.3)]'
                                                        }`}
                                                >
                                                    {verifying ? (
                                                        <span className="flex items-center justify-center gap-2 font-mono">
                                                            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                            VERIFYING...
                                                        </span>
                                                    ) : (
                                                        "VERIFY & CLAIM BADGE"
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

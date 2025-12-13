import OptimizationVisualizer from '@/components/OptimizationVisualizer';
import { BeakerIcon, ArrowUpTrayIcon, ServerIcon } from '@heroicons/react/24/outline'; // Exemplo, usaremos SVG direto se icons falharem

import CryptoFunding from "@/components/CryptoFunding";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#050914] text-gray-200 font-sans selection:bg-cyan-500/30 relative">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050914] to-[#050914] pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="border-b border-white/5 bg-[#0a0e27]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-black">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">SynPhytica <span className="text-cyan-400 text-[10px] align-top">CORE</span></h1>
              <p className="text-[10px] text-gray-400 font-mono">Generative Polypharmacology v0.2.0</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <a href="/docs" className="hover:text-cyan-400 transition-colors">Documentation</a>
            {/* Schema link hidden for demo cleanliness */}
            {/* <a href="#" className="hover:text-cyan-400 transition-colors">Schema</a> */}
            <CryptoFunding />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/30 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono">SYSTEM ONLINE</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Status Card */}
          <div className="glass-panel p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-400/20 blur-3xl rounded-full group-hover:bg-cyan-400/30 transition-all duration-500" />
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> System Ready
            </h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Core Engine</span>
                <span className="text-cyan-400 font-mono">RUST_V1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Dataset</span>
                <span className="text-gold-400 font-mono">REF_PHARMA_V1</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>GPU Memory</span>
                <span className="font-mono">4.2GB / 12GB</span>
              </div>
            </div>
          </div>

          {/* Validation Zone */}
          <div className="glass-panel p-6 rounded-xl border-dashed border-2 border-white/10 hover:border-cyan-400/50 transition-colors cursor-pointer text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="font-semibold text-white">Import Dataset</h3>
            <p className="text-xs text-gray-400 mt-2 mb-4">Upload CSV to validate against <br /> SynPhytica Standards</p>
            <button className="bg-white/10 hover:bg-cyan-400 hover:text-black px-4 py-2 rounded-md text-sm transition-all w-full">Select File</button>
          </div>

        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Visualization Component */}
          <OptimizationVisualizer />

          {/* Analysis Log */}
          <div className="glass-panel p-6 rounded-xl flex-1 min-h-[200px]">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Simulation Log</h3>
            <div className="font-mono text-xs space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
              <div className="text-gray-500">[12:40:01] System initialized.</div>
              <div className="text-cyan-400/80">[12:40:02] Loading 'reference_compounds.csv' (Gold Standard)...</div>
              <div className="text-gray-500">[12:40:02] 52 compounds loaded. Integrity: 100%.</div>
              <div className="text-yellow-400/80">[12:40:05] Starting NSGA-II optimization loop...</div>
              <div className="text-gray-500">[12:40:06] Generation 1: Entropy 0.98 (High Exploration)</div>
              <div className="text-gray-500">[12:40:08] Generation 5: First synergies detected in Terpenes cluster.</div>
              <div className="text-green-400">[12:40:12] Found local optimum: Formulation #42 (CBD:THC 2:1)</div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

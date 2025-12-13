export default function Documentation() {
    return (
        <main className="min-h-screen bg-[#0a0e27] text-gray-300 font-sans selection:bg-cyan-400 selection:text-black">

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full glass-panel z-50 border-b border-white/10 px-8 py-4 flex justify-between items-center bg-[#0a0e27]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-2xl">🧬</span>
                        <span className="font-bold text-white tracking-tight">SynPhytica <span className="text-cyan-400 font-normal">Docs</span></span>
                    </a>
                </div>
                <div className="flex gap-4 text-sm">
                    <a href="#intro" className="hover:text-cyan-400 transition-colors">Vision</a>
                    <a href="#technology" className="hover:text-cyan-400 transition-colors">Technology</a>
                    <a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a>
                    <a href="/" className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-all ml-4">Back to Dashboard</a>
                </div>
            </nav>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto pt-32 pb-20 px-6 sm:px-12">

                {/* Header */}
                <header className="mb-16 border-b border-white/10 pb-8">
                    <div className="text-cyan-400 font-mono text-sm mb-4">PUBLIC OVERVIEW v0.2.0</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Next-Generation Generative Polypharmacology Platform
                    </h1>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-400 font-mono">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Symbeon Labs R&D</span>
                        <span>Confidentiality: PROTECTED</span>
                    </div>
                </header>

                {/* Article Content */}
                <article className="prose prose-invert prose-cyan max-w-none space-y-12">

                    {/* 1. Introduction */}
                    <section id="intro">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-cyan-400 text-sm font-mono border border-cyan-400/30 px-2 py-1 rounded">01</span> The Vision
                        </h2>
                        <p className="leading-relaxed text-lg text-gray-300">
                            Traditional pharmacology relies on the "magic bullet" paradigm: one drug for one target. While effective for simple conditions, this approach struggles with complex biological systems where efficacy emerges from the synergy of multiple compounds.
                        </p>
                        <p className="leading-relaxed text-lg text-gray-300 mt-4">
                            <strong className="text-white">SynPhytica</strong> introduces a paradigm shift. We utilize advanced Artificial Intelligence to engineer complex multi-compound formulations that maximize therapeutic synergy while minimizing adverse effects. We don't just find drugs; we design molecular teams.
                        </p>
                    </section>

                    {/* 2. Technology (Black Box) */}
                    <section id="technology">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-cyan-400 text-sm font-mono border border-cyan-400/30 px-2 py-1 rounded">02</span> Core Technology
                        </h2>
                        <p className="leading-relaxed mb-8">
                            Our proprietary platform integrates three cutting-edge engines to solve the combinatorial explosion problem in drug discovery.
                        </p>

                        {/* ARCHITECTURE DIAGRAM (SVG/CSS) */}
                        <div className="w-full bg-[#05081a] border border-white/10 rounded-xl p-8 mb-10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                            {/* Flowchart Container */}
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">

                                {/* Node 1: INPUT */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-lg border-2 border-gray-600 bg-gray-900/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                        <span className="text-2xl">🧬</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Input Data</span>
                                </div>

                                {/* Arrow */}
                                <div className="h-8 w-0.5 md:h-0.5 md:w-12 bg-gray-700 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-500/50 animate-[shimmer_2s_infinite]"></div>
                                </div>

                                {/* Node 2: NEURAL CORE */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-20 h-20 rounded-full border-2 border-cyan-500 bg-cyan-900/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,200,0.2)] animate-pulse">
                                        <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Neural Core</span>
                                </div>

                                {/* Arrow */}
                                <div className="h-8 w-0.5 md:h-0.5 md:w-12 bg-gray-700 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-500/50 animate-[shimmer_2s_infinite] delay-75"></div>
                                </div>

                                {/* Node 3: EVOLUTION ENGINE */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-20 h-20 rounded-full border-2 border-gold-400 bg-yellow-900/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                                        <svg className="w-8 h-8 text-gold-400 animate-[spin_10s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </div>
                                    <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest font-bold">Evolution</span>
                                </div>

                                {/* Arrow */}
                                <div className="h-8 w-0.5 md:h-0.5 md:w-12 bg-gray-700 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-500/50 animate-[shimmer_2s_infinite] delay-150"></div>
                                </div>

                                {/* Node 4: OUTPUT */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-lg border-2 border-green-500 bg-green-900/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                                        <span className="text-2xl">💊</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">Optimized Formula</span>
                                </div>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-cyan-400 font-bold mb-2">Neural Synergy Model™</h3>
                                <p className="text-sm text-gray-400">A deep learning architecture trained to predict non-linear interactions between disparate bioactive compounds.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-gold-400 font-bold mb-2">Evolutionary Engine</h3>
                                <p className="text-sm text-gray-400">High-performance optimization algorithms that explore millions of molecular combinations per second.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-purple-400 font-bold mb-2">Adaptive Safety Guardrails</h3>
                                <p className="text-sm text-gray-400">Real-time uncertainty quantification ensures that generated formulations remain within safe physiological limits.</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Capabilities (Results) */}
                    <section id="capabilities">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-cyan-400 text-sm font-mono border border-cyan-400/30 px-2 py-1 rounded">03</span> Capabilities
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-black/40 border-l-4 border-cyan-400 p-6 rounded-r-lg">
                                <h3 className="text-white font-bold text-lg mb-2">🔬 Precision Formulation</h3>
                                <p className="text-gray-300">
                                    SynPhytica can tailor complex botanical formulations to specific patient profiles, balancing efficacy against individual risk factors.
                                </p>
                            </div>

                            <div className="bg-black/40 border-l-4 border-gold-400 p-6 rounded-r-lg">
                                <h3 className="text-white font-bold text-lg mb-2">⚡ Accelerated Discovery</h3>
                                <p className="text-gray-300">
                                    Reduces the R&D cycle for new polypharmacological therapies from years to weeks by digitally simulating bio-interactions before wet-lab testing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Developers & API (Enterprise Ready) */}
                    <section id="developers">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-cyan-400 text-sm font-mono border border-cyan-400/30 px-2 py-1 rounded">04</span> Developers & Integration
                        </h2>
                        <p className="mb-6 text-gray-300">
                            SynPhytica is built as an API-First platform, designed to integrate seamlessly into existing Hospital Information Systems (HIS) and Electronic Health Records (EHR) via secure RESTful endpoints.
                        </p>

                        <div className="bg-[#0f1429] rounded-xl border border-white/10 overflow-hidden shadow-2xl mb-8">
                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                <span className="text-xs font-mono text-gray-400">POST /v1/optimize</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                {/* Request */}
                                <div>
                                    <div className="text-gray-500 mb-2">// Request Formulation from EHR</div>
                                    <pre className="text-cyan-300">
                                        {`{
  "auth_token": "sk_live_...",
  "patient_profile": {
    "id": "anon_8492X",
    "target": "chronic_pain",
    "restrictions": ["no_thc"]
  },
  "constraints": {
    "delivery": "oral_oil",
    "max_cost": 200.00
  }
}`}
                                    </pre>
                                </div>
                                {/* Response */}
                                <div className="border-l border-white/5 pl-4 opacity-80">
                                    <div className="text-gray-500 mb-2">// SynPhytica Response (34ms)</div>
                                    <pre className="text-green-300">
                                        {`{
  "status": "optimized",
  "candidate": {
    "id": "syn_v9_22",
    "synergy_score": 0.98,
    "components": [
      { "name": "CBD", "ratio": 0.8 },
      { "name": "Beta-Caryophyllene", "ratio": 0.15 },
      { "name": "Myrcene", "ratio": 0.05 }
    ]
  }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Badge */}
                        <div className="flex flex-col md:flex-row gap-4 items-center bg-green-900/10 border border-green-500/30 p-4 rounded-lg">
                            <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">HIPAA & GDPR Compliant Processing</h4>
                                <p className="text-xs text-gray-400 mt-1">
                                    All patient data is anonymized at the edge. The SynPhytica Core Engine processes mathematical vectors, never PII (Personally Identifiable Information). End-to-end encryption (AES-256) is standard.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. Contact */}
                    <section id="contact">
                        <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-8 rounded-2xl border border-cyan-500/20 text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">Investment & Partnerships</h3>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                Detailed technical specifications, IP documentation, and clinical validation data are available under NDA for qualified partners.
                            </p>
                            <button className="bg-cyan-500 text-black font-bold px-8 py-3 rounded-full hover:bg-cyan-400 transition-colors">
                                Request Access
                            </button>
                        </div>
                    </section>

                </article>

                {/* Footer */}
                <footer className="mt-20 pt-10 border-t border-white/10 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
                    <p>© 2025 Symbeon Labs. All Rights Reserved.</p>
                    <div className="flex items-center gap-2 text-xs font-mono opacity-50">
                        <span>IP PROTECTION ACTIVE</span>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                </footer>

            </div>
        </main>
    );
}

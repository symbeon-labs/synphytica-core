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
                        <p className="leading-relaxed mb-6">
                            Our proprietary platform integrates three cutting-edge engines to solve the combinatorial explosion problem in drug discovery.
                        </p>

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

                    {/* 4. Contact */}
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

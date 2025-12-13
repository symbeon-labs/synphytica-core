"use client";

import { useEffect, useRef, useState } from "react";

// --- CHEMICAL DATABASE ---
const MOLECULAR_DB = [
    { name: "Cannabidiol (CBD)", type: "SCAFFOLD", formula: "C21H30O2", weight: "314.46 g/mol", role: "Anxiolytic / Anti-inflammatory" },
    { name: "Delta-9-THC", type: "LIGAND", formula: "C21H30O2", weight: "314.47 g/mol", role: "Analgesic / Psychoactive" },
    { name: "Myrcene", type: "ENHANCER", formula: "C10H16", weight: "136.23 g/mol", role: "Sedative / Permeability Enhancer" },
    { name: "Limonene", type: "ENHANCER", formula: "C10H16", weight: "136.24 g/mol", role: "Mood Elevator / Anti-bacterial" },
    { name: "Beta-Caryophyllene", type: "LIGAND", formula: "C15H24", weight: "204.36 g/mol", role: "CB2 Agonist / Anti-inflammatory" },
    { name: "Cannabigerol (CBG)", type: "SCAFFOLD", formula: "C21H32O2", weight: "316.48 g/mol", role: "Neuroprotective / Antibacterial" },
    { name: "Linalool", type: "ENHANCER", formula: "C10H18O", weight: "154.25 g/mol", role: "Anesthetic / Anti-convulsant" },
    { name: "Alpha-Pinene", type: "ENHANCER", formula: "C10H16", weight: "136.23 g/mol", role: "Bronchodilator / Memory Aid" }
];

// Types
interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    color: string;
    size: number;
    type: 'LIGAND' | 'SCAFFOLD' | 'ENHANCER';
    docked: boolean;
    angle: number;
    compoundData: typeof MOLECULAR_DB[0]; // Linked Real Data
}

interface Receptor {
    x: number;
    y: number;
    radius: number;
    active: boolean;
}

interface Shockwave {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    color: string;
}

interface GridPoint {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
}

export default function OptimizationVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sysStatus, setSysStatus] = useState("IDLE");
    const [aiLog, setAiLog] = useState(">> WAITING FOR INPUT...");
    const [synergyScore, setSynergyScore] = useState(0);
    const [selectedMolecule, setSelectedMolecule] = useState<Particle | null>(null);

    // Controls
    const [aiMode, setAiMode] = useState(true);

    // Mouse
    const mouseRef = useRef({ x: -1000, y: -1000, active: false, clickTrigger: false });

    // Refs for loop
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize
        const resizeObserver = new ResizeObserver(() => {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 600;
        });
        if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

        // Systems
        const nParticles = 80;
        // Don't re-init particles if they exist just update refs
        if (particlesRef.current.length === 0) {
            const particles: Particle[] = [];
            const PALETTE = {
                LIGAND: "rgba(0, 255, 200, 1)",
                SCAFFOLD: "rgba(255, 0, 255, 1)",
                ENHANCER: "rgba(255, 255, 0, 1)"
            };

            for (let i = 0; i < nParticles; i++) {
                // Assign Real Chemical Data
                const compound = MOLECULAR_DB[Math.floor(Math.random() * MOLECULAR_DB.length)];

                let color = PALETTE.LIGAND;
                if (compound.type === "SCAFFOLD") color = PALETTE.SCAFFOLD;
                if (compound.type === "ENHANCER") color = PALETTE.ENHANCER;

                particles.push({
                    id: i,
                    x: Math.random() * 800, y: Math.random() * 600,
                    vx: 0, vy: 0, targetX: 400, targetY: 300,
                    color, size: Math.random() * 3 + 2,
                    type: compound.type as any,
                    docked: false,
                    angle: Math.random() * Math.PI * 2,
                    compoundData: compound
                });
            }
            particlesRef.current = particles;
        }

        const receptors: Receptor[] = [];
        let shockwaves: Shockwave[] = [];
        const grid: GridPoint[] = [];

        const initGrid = () => { grid.length = 0; for (let x = 0; x < canvas.width; x += 50) for (let y = 0; y < canvas.height; y += 50) grid.push({ x, y, baseX: x, baseY: y, size: 1 }); };
        const initReceptors = () => { receptors.length = 0; for (let i = 0; i < 3; i++) receptors.push({ x: 0, y: 0, radius: 30, active: false }); };

        const drawHexagon = (x: number, y: number, r: number, c: string, w: number) => {
            ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const px = x + Math.cos(a) * r; const py = y + Math.sin(a) * r; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke();
        };

        // --- AI LOGIC VARS ---
        let currentPhase = "CHAOS";
        let frame = 0;
        let aiTimer = 0;

        const render = () => {
            frame++;
            aiTimer++;

            if ((receptors.length === 0 || grid.length === 0) && canvas.width > 0) { initReceptors(); initGrid(); }
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const minDim = Math.min(canvas.width, canvas.height);
            const scale = minDim / 600;
            const particles = particlesRef.current;

            // AI Logic (Brief)
            if (aiMode && aiTimer > 60) {
                aiTimer = 0;
                let dockedCount = particles.filter(p => p.docked).length;
                let score = (dockedCount / nParticles) * 100;
                // Simple State Machine
                if (score < 10 && currentPhase === "CHAOS" && frame > 200) { currentPhase = "VORTEX"; setAiLog(">> ENTROPY SUFFICIENT. INITIATING VORTEX..."); }
                if (currentPhase === "VORTEX" && frame > 600) { currentPhase = "APPROACH"; setAiLog(">> RECEPTOR AFFINITY DETECTED."); }
                if (currentPhase === "APPROACH" && frame > 900) { currentPhase = "DOCKING"; setAiLog(">> MAXIMIZING PARETO EFFICIENCY."); }
                if (currentPhase === "DOCKING" && frame > 1300) { currentPhase = "CHAOS"; frame = 0; setAiLog(">> RESTARTING WITH NEW SEED..."); }
                setSysStatus(currentPhase); setSynergyScore(Math.floor(score + (frame / 1200) * 80));
            }

            // Update Receptors
            receptors.forEach((rec, i) => {
                const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                rec.x = cx + Math.cos(angle) * (120 * scale);
                rec.y = cy + Math.sin(angle) * (120 * scale);
                rec.radius = 30 * scale;
            });

            // Clear
            ctx.fillStyle = "rgba(10, 14, 39, 0.3)"; ctx.fillRect(0, 0, canvas.width, canvas.height);

            // MOUSE CLICK LOGIC (Selection)
            if (mouseRef.current.active && mouseRef.current.clickTrigger) {
                mouseRef.current.clickTrigger = false;
                // Find clicked particle
                let found: Particle | null = null;
                let minD = 999;
                particles.forEach(p => {
                    const d = Math.hypot(p.x - mouseRef.current.x, p.y - mouseRef.current.y);
                    if (d < 30 * scale && d < minD) { minD = d; found = p; }
                });
                if (found) {
                    setSelectedMolecule(found);
                    // Visual Feedback
                    shockwaves.push({ x: (found as Particle).x, y: (found as Particle).y, radius: 10, opacity: 1, color: "#ffffff" });
                } else {
                    setSelectedMolecule(null); // Deselect on void click
                }
            }

            // GRID
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            grid.forEach(gp => {
                let dx = 0, dy = 0, active = false;
                if (mouseRef.current.active) {
                    const md = Math.hypot(mouseRef.current.x - gp.baseX, mouseRef.current.y - gp.baseY);
                    const mRadius = 150 * scale;
                    if (md < mRadius) {
                        const mf = (mRadius - md) / mRadius;
                        dx -= ((mouseRef.current.x - gp.baseX) / md) * mf * 40;
                        dy -= ((mouseRef.current.y - gp.baseY) / md) * mf * 40;
                        active = true;
                    }
                }
                gp.x += (gp.baseX + dx - gp.x) * 0.1; gp.y += (gp.baseY + dy - gp.y) * 0.1;
                ctx.beginPath(); ctx.arc(gp.x, gp.y, active ? 1.5 : 1, 0, Math.PI * 2); ctx.fill();
            });

            // SHOCKWAVES
            shockwaves.forEach((sw, i) => {
                sw.radius += 2; sw.opacity -= 0.02;
                if (sw.opacity <= 0) { shockwaves.splice(i, 1); return; }
                ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.strokeStyle = sw.color.replace('1)', `${sw.opacity})`); ctx.lineWidth = 2; ctx.stroke();
            });

            // RECEPTORS
            const recAlpha = (currentPhase === "APPROACH" || currentPhase === "DOCKING") ? 1 : 0;
            if (recAlpha > 0) {
                receptors.forEach(rec => {
                    ctx.save(); ctx.translate(rec.x, rec.y); ctx.rotate(frame * 0.005);
                    drawHexagon(0, 0, rec.radius, `rgba(255,255,255,${recAlpha * 0.2})`, 2);
                    drawHexagon(0, 0, rec.radius * 0.6, `rgba(255,255,255,${recAlpha * 0.4})`, 1);
                    ctx.restore();
                });
            }

            // PARTICLES
            const PALETTE_OPTIMAL = "rgba(255, 215, 0, 1)";
            particles.forEach((p, i) => {
                p.docked = false;

                // PHYSICS
                if (currentPhase === "CHAOS") {
                    const wander = 60 * scale;
                    p.targetX = p.x + (Math.random() - 0.5) * wander;
                    p.targetY = p.y + (Math.random() - 0.5) * wander;
                    const m = 20; if (p.x < m) p.targetX += 30; if (p.x > canvas.width - m) p.targetX -= 30; if (p.y < m) p.targetY += 30; if (p.y > canvas.height - m) p.targetY -= 30;
                }
                else if (currentPhase === "VORTEX") {
                    p.angle += 0.03 + (i % 3) * 0.01;
                    const r = (minDim * 0.35) + Math.sin(frame * 0.05 + i) * (20 * scale);
                    p.targetX = cx + Math.cos(p.angle) * r; p.targetY = cy + Math.sin(p.angle) * r;
                }
                else {
                    const tr = receptors[i % receptors.length];
                    const la = i + frame * 0.02;
                    let r = 70 * scale; if (currentPhase === "DOCKING") r = tr.radius + (10 * scale);
                    const tx = tr.x + Math.cos(la) * r; const ty = tr.y + Math.sin(la) * r;
                    p.targetX = tx; p.targetY = ty;

                    if (currentPhase === "DOCKING" && Math.abs(p.x - tx) < 10) {
                        p.docked = true;
                        if (Math.random() > 0.99) shockwaves.push({ x: p.x, y: p.y, radius: 5, opacity: 1, color: PALETTE_OPTIMAL });
                    }
                }

                // MOUSE DISPLACEMENT
                if (mouseRef.current.active && !p.docked) {
                    const mx = mouseRef.current.x; const my = mouseRef.current.y;
                    const md = Math.hypot(p.x - mx, p.y - my);
                    const pushRadius = 120 * scale;
                    if (md < pushRadius) {
                        const pushForce = (pushRadius - md) / pushRadius;
                        p.targetX += ((p.x - mx) / md) * pushForce * 100 * scale;
                        p.targetY += ((p.y - my) / md) * pushForce * 100 * scale;
                    }
                }

                p.x += (p.targetX - p.x) * 0.05; p.y += (p.targetY - p.y) * 0.05;
                p.x = Math.max(5, Math.min(canvas.width - 5, p.x)); p.y = Math.max(5, Math.min(canvas.height - 5, p.y));

                // Draw Connections (Lighter)
                particles.forEach((p2, j) => {
                    if (i >= j) return;
                    const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                    const limit = (currentPhase === "VORTEX" ? 80 : 50) * scale;
                    if (d < limit) {
                        const g = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
                        g.addColorStop(0, p.color); g.addColorStop(1, p2.color);
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = g; ctx.lineWidth = (1 - d / limit) * 2; ctx.stroke();
                    }
                });

                ctx.beginPath(); ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
                ctx.fillStyle = p.docked ? PALETTE_OPTIMAL : p.color;
                ctx.shadowBlur = p.docked ? 20 : 0; ctx.shadowColor = PALETTE_OPTIMAL;
                ctx.fill();

                // Selection Ring
                if (selectedMolecule && selectedMolecule.id === p.id) {
                    ctx.beginPath(); ctx.arc(p.x, p.y, (p.size * scale) + 8, 0, Math.PI * 2);
                    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
                }
            });

            requestAnimationFrame(render);
        };

        const animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [aiMode, selectedMolecule]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
    };
    const handleMouseClick = () => { mouseRef.current.clickTrigger = true; };
    const handleMouseLeave = () => { mouseRef.current.active = false; };

    return (
        <div
            className="relative w-full h-[400px] bg-[#0a0e27] rounded-xl overflow-hidden glass-panel border border-cyan-400/30 shadow-[0_0_50px_rgba(0,255,200,0.1)] group cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleMouseClick}
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* AI TERMINAL */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none select-none font-mono">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded border border-cyan-500/30">
                        <span className={`w-2 h-2 rounded-full ${aiMode ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className="text-xs text-cyan-400 font-bold tracking-widest">
                            {aiMode ? 'AI AGENT ACTIVE' : 'MANUAL OVERRIDE'}
                        </span>
                    </div>

                    <div className="text-[10px] text-gray-400 max-w-[250px] bg-black/20 p-2 rounded border-l-2 border-cyan-500/50">
                        <div className="opacity-50">sys_check: OK</div>
                        <div className="text-cyan-300 animate-pulse">{aiLog}</div>
                    </div>
                </div>
            </div>

            {/* INSPECTOR CARD (Holographic Overlay) */}
            {selectedMolecule && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in duration-300">
                    <div className="bg-black/60 backdrop-blur-xl border border-cyan-400/50 p-4 rounded-xl shadow-[0_0_30px_rgba(0,255,200,0.2)] w-[280px] text-left relative overflow-hidden">
                        {/* Scanline Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 blur-sm animate-[scan_2s_linear_infinite]" />

                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-cyan-400 font-bold font-mono text-sm uppercase">{selectedMolecule.compoundData.name}</h3>
                            <span className="text-[9px] bg-cyan-900/50 px-1 rounded text-cyan-300 border border-cyan-500/30">{selectedMolecule.compoundData.type}</span>
                        </div>

                        <div className="space-y-1 text-[10px] text-gray-300 font-mono">
                            <div className="flex justify-between border-b border-white/10 pb-1">
                                <span>FORMULA:</span> <span className="text-white">{selectedMolecule.compoundData.formula}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-1">
                                <span>WEIGHT:</span> <span className="text-white">{selectedMolecule.compoundData.weight}</span>
                            </div>
                            <div className="pt-1">
                                <span className="text-xs text-gray-500 block mb-0.5">THERAPEUTIC ROLE:</span>
                                <span className="text-gold-400">{selectedMolecule.compoundData.role}</span>
                            </div>
                        </div>

                        {/* Mock Structure Grid */}
                        <div className="absolute top-[-10px] right-[-10px] opacity-10">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400" />
                            </svg>
                        </div>
                    </div>

                    {/* Connecting Line to Particle (Visual fake) */}
                    <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400/50 to-transparent mx-auto"></div>
                </div>
            )}

            {/* HUD RIGHT */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs font-mono w-[180px] pointer-events-none">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-400">SYNERGY</span>
                    <span className="text-gold-400 font-bold">{Math.min(100, synergyScore).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gold-400 transition-all duration-500" style={{ width: `${Math.min(100, synergyScore)}%` }}></div>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-[10px]">
                    <span className="text-gray-500">PHASE</span>
                    <span className="text-cyan-400">{sysStatus}</span>
                </div>
            </div>

        </div>
    );
}

<div align="center">

![SynPhytica Banner](assets/images/banner.png)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/SH1W4/synphytica-core/blob/main/notebooks/SynPhytica_Validation.ipynb)
[![English](https://img.shields.io/badge/🇬🇧_English-Documentation-blue?style=for-the-badge)](docs/en/README.md)
[![Português](https://img.shields.io/badge/🇧🇷_Português-Documentação-green?style=for-the-badge)](docs/pt/README.md)
[![Web Interface](https://img.shields.io/badge/🚀_Web_App-v0.2.0-cyan?style=for-the-badge)](web/)

---

[Overview](#-overview) • [Web Interface](#-synphytica-web-interface) • [Core Engine](#-core-architecture) • [DeSci Funding](#-desci--anonymous-funding) • [Installation](#-installation)

</div>

---

> 🧬 **MAJOR UPDATE (v0.2.0):** The **SynPhytica Web Interface** is now live! Experience the **Neural Field Visualizer** and the **Interactive Documentation** directly in your browser.

---

## 📋 Overview

**SynPhytica** is a computational framework that bridges the gap between ancient botanical wisdom and modern artificial intelligence. By treating molecular interactions as a language, it decodes the "Entourage Effect" to design personalized formulations that maximize therapeutic efficacy while minimizing risks.

Unlike traditional drug discovery that focuses on single-molecule targets, SynPhytica embraces **Polypharmacology**—optimizing complex mixtures of compounds for multi-target synergy.

---

## 🚀 SynPhytica Web Interface

The new frontend (`/web`) brings the mathematical core to life, offering a tactile and visual experience for researchers and investors.

### 🌌 Neural Field Visualizer (v4.0)
An interactive physics simulation that represents the optimization process as a "living" biological system.
- **Chaos to Order**: Watch molecules organize from high entropy (randomness) to Pareto-optimal clusters.
- **Chemical Inspector**: Click on particles to reveal real compound data (CBD, Limonene, Myrcene) via holographic cards.
- **Tactile Feedback**: The visualization reacts to mouse movement, simulating fluid dynamics in a biological medium.
- **AI Conductor**: An autonomous agent monitors synergy scores and creates a narrative log of the optimization process.

### 📚 Interactive Documentation
Access the full whitepaper, architecture diagrams, and API references directly through the web dashboard at `/docs`.

---

## ⚡ Core Architecture

### 🧠 Neural Synergy Model
A **Dual-Attention Transformer** that processes the chemical profile of the plant and the biological profile of the patient.
- **Inputs**: Compound Vectors + Patient Profile.
- **Mechanism**: Self-Attention learns non-linear synergies (Entourage Effect).
- **Output**: Efficacy vs. Risk Scores with Uncertainty Quantification.

### 🧬 Evolutionary Engine (Rust Accelerated)
A hybrid **NSGA-II + PSO** optimizer that navigates the vast combinatorial space of plant compounds.
1.  **Exploration**: Genetic algorithms find promising compound combinations.
2.  **Refinement**: Particle Swarm Optimization fine-tunes ratios.
3.  **Validation**: Pareto front analysis ensures optimal trade-offs.

---

## 🪙 DeSci & Anonymous Funding

SynPhytica operates as a **Decentralized Science (DeSci)** protocol. We believe in open research without bureaucratic bottlenecks.

- **No KYC**: Support the research anonymously via Crypto (BTC, ETH, SOL).
- **Direct Compute**: Funds are allocated directly to GPU clusters for model training.
- **Access**: Contributors receive early access to API keys.

*Check the "Support R&D" module on the Web Interface documentation page.*

---

## 💻 Installation

### 1. Core Engine (Python/Rust)
```bash
# Clone repository
git clone https://github.com/SH1W4/synphytica-core.git
cd synphytica-core

# Setup Virtual Environment
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt
```

### 2. Web Interface (Next.js)
```bash
# Navigate to web directory
cd web

# Install Node dependencies
npm install

# Run Development Server
npm run dev
```
Access the dashboard at `http://localhost:3000`.

---

## 📂 Project Structure

```text
SynPhytica/
├── 🧠 synphytica_core.py       # Core AI Engine (Python)
├── 🌐 web/                     # Next.js Application (New!)
│   ├── src/components/         # Visualizers & Crypto Modules
│   └── src/app/docs/           # Public Documentation Page
├── 📊 data/                    # Processed Compound Datasets
├── 📚 docs/                    # Whitepapers & Schemas
├── 🧪 examples/                # Usage Scripts
└── 🎨 assets/                  # Images and Visuals
```

---

## 📜 Citation

If you use SynPhytica in your research, please cite:

```bibtex
@software{symbeon2025synphytica,
  author = {Symbeon Labs},
  title = {SynPhytica: AI-Powered Framework for Personalized Phytotherapeutic Formulation Optimization},
  year = {2025},
  publisher = {GitHub},
  version = {0.2.0-beta},
  url = {https://github.com/SH1W4/synphytica-core}
}
```

---

<div align="center">

**© 2025 Symbeon Labs** • Research & Development Division

📧 [Contact Us](mailto:contact@symbeonlabs.com)

</div>

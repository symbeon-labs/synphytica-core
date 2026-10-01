<div align="center">

![SynPhytica Banner](assets/images/banner.png)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/SH1W4/synphytica-core/blob/main/notebooks/SynPhytica_Validation.ipynb)
[![English](https://img.shields.io/badge/🇬🇧_English-Documentation-blue?style=for-the-badge)](docs/en/README.md)
[![Português](https://img.shields.io/badge/🇧🇷_Português-Documentação-green?style=for-the-badge)](docs/pt/README.md)
[![Web Interface](https://img.shields.io/badge/🚀_Web_App-v0.2.0-cyan?style=for-the-badge)](web/)
[![Built with Trinity OS](https://img.shields.io/badge/Built_with-Trinity_OS-blueviolet?style=for-the-badge&logo=dna)](https://github.com/th3m1s-core)
[![Funded via GhostFund](https://img.shields.io/badge/Funded_via-GhostFund_Protocol-00C853?style=for-the-badge&logo=ethereum)](https://github.com/ghostfund-protocol)

---

[Overview](#-overview) • [Web Interface](#-synphytica-web-interface-new) • [Features](#-key-features) • [Architecture](#-neural-architecture) • [Scalability](#-scalability--multi-domain) • [Installation](#-manual-installation)

</div>

---

> 📖 **New to SynPhytica?** See the complete system walkthrough in [`docs/guides/WALKTHROUGH.md`](docs/guides/WALKTHROUGH.md) for detailed architecture, validation results, and usage examples.
>
> 🧬 **UPDATE (v0.2.0):** The **Web Interface** is now live! Experience the Neural Visualizer at `/web`.

---

## 📋 Overview

**SynPhytica** is an experimental computational research framework exploring AI-assisted analysis and optimization of complex botanical formulations. By treating molecular interactions as a language, it decodes the "Entourage Effect" to investigate computational representations of botanical mixtures and multi-objective optimization. Experimental outputs should not be interpreted as clinical recommendations or proof of therapeutic efficacy.

Unlike traditional drug discovery that focuses on single-molecule targets, SynPhytica embraces **Polypharmacology**—optimizing complex mixtures of compounds (Cannabinoids, Terpenes, Flavonoids) for multi-target synergy.

---

## 🚀 SynPhytica Web Interface (New)

The new frontend (`/web`) brings the mathematical core to life, offering a tactile and visual experience.

### 🌌 Neural Field Visualizer (v4.0)
An interactive physics simulation that represents the optimization process as a "living" biological system.
- **Chaos to Order**: Watch molecules organize from high entropy to Pareto-optimal clusters.
- **Chemical Inspector**: Click on particles to reveal real compound data (CBD, Limonene) via holographic cards.
- **Tactile Feedback**: The visualization reacts to mouse movement.
- **AI Agent**: An autonomous agent monitors synergy scores and creates a narrative log.

### 🪙 DeSci & Anonymous Funding
SynPhytica operates as a **Decentralized Science (DeSci)** protocol.
- **No KYC**: Support research anonymously via Crypto (BTC, ETH, SOL).
- **Direct Compute**: Funds go directly to GPU clusters.
- *Check the "Support R&D" module on the Web Interface.*

---

## ⚡ Demo: Optimization Engine

Watch the **SynPhytica Engine** evolve formulations in real-time. The animation below visualizes the 3 phases of our genetic algorithm:

1. **Exploration**: Random sampling (Green Chaos)
2. **Clusterization**: Finding synergy hotspots
3. **Pareto Convergence**: Fine-tuning to Golden Ratio (Optimal Solutions)

<div align="center">

![SynPhytica Optimization Demo](docs/articles/images/synphytica_demo.gif)

</div>

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **🧠 Transformer Core** | Uses Self-Attention mechanisms to model non-linear molecular synergies. |
| **🧬 Multi-Objective** | Simultaneously optimizes for Efficacy, Safety, and Patient Preferences (NSGA-II). |
| **🔍 Explainable AI** | "Glass-box" approach allowing visualization of attention weights (Synergy Heatmaps). |
| **🛡️ Uncertainty UQ** | Monte Carlo Dropout quantification to ensure safety-first predictions. |
| **🌿 Plant-Agnostic** | Designed for Cannabis, but adaptable to TCM, Ayurveda, and Amazonian flora. |

---

## 🧠 Neural Architecture

The heart of SynPhytica is a **Dual-Attention Transformer**. It processes the chemical profile of the plant and the biological profile of the patient to predict outcomes (Efficacy vs Risk).

<div align="center">
<img src="assets/images/neural_architecture_diagram.png" width="100%" alt="Neural Architecture Bio-Digital Diagram">
*Bio-Digital Fusion: Neural Networks decoding Plant Intelligence*
</div>

---

## 🌍 Research scope

Medicinal Cannabis is the primary research case documented in this repository. Extensions to other botanical domains remain research directions rather than validated capabilities.

### 🚀 Target Domains
1.  **🇧🇷 Brazilian Biodiversity (Amazon/Cerrado)**: Copaíba, Andiroba, Açaí.
2.  **🇨🇳 Traditional Chinese Medicine (TCM)**: *Panax ginseng*, *Astragalus*.
3.  **🇮🇳 Ayurveda**: Ashwagandha, Curcumin.

---

---

## 🔬 Collaborative DeSci Ecosystem

SynPhytica is not just a tool; it is a **Decentralized Science Protocol**. We combine financial sovereignty with collaborative intelligence.

### 1. Funding: GhostFund Protocol
Integrated directly into the dashboard, the [GhostFund Protocol](./web/src/components/CryptoFunding.tsx) allows labs to receive direct crypto donations without intermediaries.
- **Benefit:** 100% of funds go to research.
- **Proof:** Donors receive "Patron Badges" (NFTs).

### 2. Knowledge: The Scholar Program
Researchers can contribute verified botanical data to our Vector Database and earn computational credits.
- **Action:** Submit species using the [Standard Template](templates/research/SPECIES_CONTRIBUTION_TEMPLATE.md).
- **Reward:** Mint **"Contributor SBTs"** (Soulbound Tokens) that unlock premium Neural Core features.
- **Learn More:** [Read the Scientific Contribution Guide](docs/SCIENTIFIC_CONTRIBUTION.md).

---

## 🐳 Docker (Recommended for Devs)

Run the entire environment with a single command:

```bash
docker-compose up --build
```

---

## 💻 Manual Installation

### 1. Core Engine (Python/Rust)

```bash
# Clone
git clone https://github.com/SH1W4/synphytica-core.git
cd synphytica-core

# Setup Venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install
pip install -r requirements.txt
```

### 2. Web Interface (Next.js)

```bash
cd web
npm install
npm run dev
```
Access dashboard at `http://localhost:3000`.

---

## 📂 Project Structure

```text
SynPhytica/
├── 🧠 synphytica_core.py       # Core AI Engine (Transformer + Genetic Algo)
├── 🌐 web/                     # Next.js Application (Active Interface)
├── 📊 data/
│   ├── raw/                    # Raw downloads (XML, SDF)
│   ├── processed/              # Cleaned CSVs
│   └── schema/                 # Validation schemas
├── 📚 docs/
│   ├── en/                     # English Documentation
│   ├── pt/                     # Portuguese Documentation
│   └── COMPOUND_DATA_SCHEMA.md # Standards
├── 🧪 examples/                # Usage scripts
├── 🛠️ scripts/                 # ETL and Utility scripts
└── 🎨 assets/                  # Images and Visuals
```

---

## 🤝 Contributing

We welcome contributions from developers, pharmacologists, and data scientists! 
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
- See [COMPOUND_DATA_SCHEMA.md](docs/COMPOUND_DATA_SCHEMA.md) to contribute plant data.

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

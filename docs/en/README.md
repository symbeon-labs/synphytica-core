# SynPhytica

**AI-Powered Framework for Personalized Phytotherapeutic Formulation Optimization**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-red)](https://pytorch.org/)

**🌍 Language**: [🇬🇧 English](docs/en/README.md) | [🇧🇷 Português](docs/pt/README.md)

---

<div align="center">

![SynPhytica Banner](assets/images/banner.png)

</div>

## 📋 Overview

**SynPhytica** is an innovative computational framework that applies artificial intelligence, multi-objective optimization, and network pharmacology to the rational design of personalized phytotherapeutic formulations. Inspired by recent advances in computational biology, SynPhytica transposes deep learning and evolutionary algorithms to the realm of natural medicine.

### 🎯 Problem Solved

How can we objectively and scientifically design a customized natural formulation for a specific patient, in a universe of thousands of possible compounds, without relying exclusively on empirical tradition or trial-and-error?

### 💡 Solution

SynPhytica mathematically formalizes the problem of **personalized polypharmacology**, balancing:
- ✅ **Therapeutic efficacy** for specific indications
- ⚠️ **Safety** and risk minimization
- 🎨 **Patient preferences** (taste, form, routine)
- ⚖️ **Regulatory constraints** and dosage limits
- 📊 **Epistemic uncertainty** of predictions

<div align="center">

![Concept SynPhytica](assets/images/concept.png)
*Fusion of Mathematics, AI, and Natural Medicine*

</div>

### 🎬 Optimization Engine Visualization

Watch the **SynPhytica Engine** evolve formulations in real-time. The animation below visualizes the 3 phases of our genetic algorithm:
1. **Exploration**: Random sampling (Green Chaos)
2. **Clusterization**: Finding synergy hotspots
3. **Pareto Convergence**: Fine-tuning to Golden Ratio (Optimal Solutions)

<div align="center">

![SynPhytica Optimization Demo](../../docs/articles/images/synphytica_demo.gif)

</div>

---

### ⚡ See SynPhytica in Action

The GIF below demonstrates the formulation evolution process. Starting from random combinations (scattered points), the algorithm rapidly converges to the **Pareto Frontier** (golden points), maximizing efficacy while minimizing risks.

<div align="center">

![Optimization Process](assets/images/optimization_process.gif)
*Dynamic evolution of formulation population over 60 generations*

</div>

---

## 🔬 Scientific Foundations

### Mathematical Modeling

The framework is based on a multi-objective fitness function:

```
F(x,u) = αE(x,u) - βR(x,u) + γM(x,u) - δP(x) - εU(x,u)
```

Where:
- **E(x,u)**: Weighted predicted efficacy
- **R(x,u)**: Weighted risks
- **M(x,u)**: Preference matching
- **P(x)**: Constraint penalties
- **U(x,u)**: Uncertainty penalization

### Neural Architecture

The heart of SynPhytica is a specialized Transformer model that processes the "language" of molecular interactions.

- **Self-Attention**: Captures non-linear synergies between compounds (e.g., terpenes modulating cannabinoids).
- **Cross-Attention**: Integrates the patient's genetic/clinical profile to personalize predictions.
- **Dual Heads**: Simultaneously estimates efficacy probability and adverse effect risk.

<div align="center">

![Neural Architecture](assets/images/neural_architecture_diagram.png)
*Schematic diagram of the Dual Attention mechanism*

</div>

---

## 🚀 Installation

### Requirements

- Python 3.9+
- PyTorch 2.0+
- CUDA (optional, for GPU)

### Setup

```bash
# Clone repository
git clone https://github.com/SH1W4/synphytica-core.git
cd synphytica-core

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## 💻 Basic Usage

### Example: Cannabis Formulation Optimization

```python
from synphytica_core import SynPhyticaOptimizer, CompoundLibrary, UserProfile

# 1. Load compound library
library = CompoundLibrary.from_csv('data/cannabis_compounds.csv')

# 2. Define patient profile
user = UserProfile(
    therapeutic_goals=['pain_relief', 'anxiety_reduction'],
    risk_sensitivities={'psychoactive': 0.8},
    preferences={'flavor': 'citrus', 'form': 'oil'}
)

# 3. Run optimization
optimizer = SynPhyticaOptimizer(
    library=library,
    user_profile=user,
    population_size=100,
    generations=50
)

results = optimizer.optimize()

# 4. Visualize top solutions
for solution in results.pareto_front[:5]:
    print(solution.summary())
```

### Expected Output

```
╔══════════════════════════════════════════════╗
║      SYNPHYTICA OPTIMIZATION ENGINE          ║
║   AI for Synergistic Phytopharmacology      ║
╚══════════════════════════════════════════════╝

Solution 1: Efficacy-Focused
├── Fitness: 0.9123
├── Efficacy: 0.89 | Risk: 0.12 | Match: 0.88
├── Compounds:
│   ├── CBD: 14.2%
│   ├── THC: 6.8%
│   ├── Limonene: 1.2%
│   └── β-Caryophyllene: 0.9%
└── Explanation: "High CBD:THC ratio balances analgesia..."
```

---

## 📁 Project Structure

```
SynPhytica/
├── synphytica_core.py          # Core implementation
├── README.md                    # Project documentation
├── LICENSE                      # Apache 2.0
├── requirements.txt             # Python dependencies
├── CONTRIBUTING.md              # Contribution guidelines
├── assets/                      # Visual resources
├── docs/                        # Scientific & Strategic Documentation
│   ├── en/                      # English documentation
│   └── pt/                      # Portuguese documentation
├── examples/
│   └── cannabis_optimization.py
└── tests/
    └── test_core.py
```

---

## 📊 Use Cases

### 1. Medicinal Cannabis
- 52 compounds (9 cannabinoids + 43 terpenes)
- 18 therapeutic indications
- Validation with scientific literature

### 2. Traditional Chinese Medicine (TCM)
- Libraries of herbs and classical formulas
- Optimization of personalized blends

### 3. Nutraceuticals
- Supplements and vitamins
- Genetics-based personalization

---

## 🔬 Scientific Validation

### Optimization Performance

The graph below demonstrates the superiority of SynPhytica's hybrid algorithm (Pareto Frontier) compared to traditional methods. Note how SynPhytica finds solutions with higher efficacy for the same risk level.

<div align="center">

![Pareto Frontier](assets/images/pareto_front.png)
*Comparison: SynPhytica (Green/Gold) vs. Random Search (Blue)*

</div>

### Explainable AI: Decoding the "Entourage Effect"

Unlike "black-box" models, SynPhytica's attention mechanism allows visualization of exactly which molecular interactions the model is prioritizing. The heatmap below shows the **Self-Attention Matrix**, where hot spots indicate strong detected synergy (e.g., THC modulated by Limonene).

<div align="center">

![Synergy Heatmap](assets/images/synergy_heatmap.png)
*Neural Attention Matrix revealing molecular synergy clusters*

</div>

### Performance Metrics

- **Hypervolume**: 25% superior Pareto space coverage
- **Constraint Satisfaction**: 100% viable solutions
- **Explainability**: Compound contribution visualizations

### Publications

- 📄 **Mathematical Formalization**: `docs/SynPhytica_Scientific_Foundation.tex`
- 📄 **Executive Summary**: `docs/Scientific_Foundation_Summary.md`

---

## 🛡️ Intellectual Property
 
- **Author**: Symbeon Labs
- **Institution**: Symbeon Labs
- **License**: Apache 2.0
- **Copyright**: © 2025 Symbeon Labs
 
### Prior Art
 
- Timestamped commits on GitHub
- Planned arXiv submission
- Complete authorship documentation
 
---
 
## 🤝 Contributing
 
Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and pull request submission process.
 
---
 
## 📧 Contact
 
**Symbeon Labs**  
📧 Email: contact@symbeonlabs.com  
🏢 Research & Development Division
 
---
 
## 📜 Citation
 
If you use SynPhytica in your research, please cite:
 
```bibtex
@software{symbeon2025synphytica,
  author = {Symbeon Labs},
  title = {SynPhytica: AI-Powered Framework for Personalized Phytotherapeutic Formulation Optimization},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/SH1W4/synphytica-core}
}
```
 
---
 
## 📝 License
 
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
 
---
 
## 🌟 Acknowledgments
 
- Inspired by recent advances in Deep Learning and Computational Biology
- Grounded in network pharmacology and polypharmacology principles
- Developed by Symbeon Labs

---

<div align="center">

**SynPhytica** — *The Mathematics of Personalized Polypharmacology*

[![GitHub](https://img.shields.io/badge/GitHub-SynPhytica-black?logo=github)](https://github.com/SH1W4/synphytica-core)

</div>

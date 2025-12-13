# 🧬 SynPhytica

<div align="center">

![SynPhytica Banner](../../assets/images/banner.png)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/SH1W4/synphytica-core/blob/main/notebooks/SynPhytica_Validation.ipynb)
[![English](https://img.shields.io/badge/🇬🇧_English-Documentation-blue?style=for-the-badge)](../en/README.md)
[![Web Interface](https://img.shields.io/badge/🚀_Web_App-v0.2.0-cyan?style=for-the-badge)](../../web/)

**Framework de IA para Otimização Personalizada de Formulações Fitoterápicas**

</div>

---

> 📖 **Novo no SynPhytica?** Veja o guia completo do sistema em [`../guide/WALKTHROUGH.md`](../guide/WALKTHROUGH.md).
>
> 🧬 **ATUALIZAÇÃO (v0.2.0):** A **Interface Web** está ativa! Acesse o Visualizador Neural em `/web`.

---

## 📋 Visão Geral

**SynPhytica** é um framework computacional inovador que aplica inteligência artificial, otimização multiobjetivo e farmacologia de rede para o design racional de formulações fitoterápicas personalizadas. Inspirado por avanços recentes em biologia computacional, SynPhytica transpõe técnicas de deep learning e algoritmos evolutivos para o universo da medicina natural.

Diferente da descoberta de medicamentos tradicional baseada em "uma molécula, um alvo", o SynPhytica abraça a **Polifarmacologia** — otimizando misturas complexas de compostos (Canabinoides, Terpenos, Flavonoides) para sinergia em múltiplos alvos.

---

## 🚀 Interface Web SynPhytica (Novo)

O novo frontend (`/web`) traz o núcleo matemático à vida, oferecendo uma experiência tátil e visual.

### 🌌 Visualizador de Campo Neural (v4.0)
Uma simulação física interativa que representa o processo de otimização como um sistema biológico "vivo".
- **Do Caos à Ordem**: Observe moléculas se organizarem de alta entropia para clusters Pareto-ótimos.
- **Inspetor Químico**: Clique em partículas para revelar dados reais via cartões holográficos.
- **Maestro IA**: Um agente autônomo monitora pontuações de sinergia e narra o processo.

### 🪙 DeSci & Financiamento Anônimo
SynPhytica opera como um protocolo de **Ciência Descentralizada (DeSci)**.
- **Sem KYC**: Apoie a pesquisa anonimamente via Cripto (BTC, ETH, SOL).
- **Computação Direta**: Fundos vão direto para clusters de GPU.

---

## ⚡ Demo: Motor de Otimização

Veja o **SynPhytica Engine** evoluir formulações em tempo real. A animação abaixo visualiza as 3 fases do nosso algoritmo genético:

1. **Exploração**: Amostragem aleatória (Caos Verde)
2. **Clusterização**: Encontrando pontos de sinergia
3. **Convergência de Pareto**: Ajuste fino para a Proporção Áurea (Soluções Ótimas)

<div align="center">

![SynPhytica Optimization Demo](../../docs/articles/images/synphytica_demo.gif)

</div>

---

## 🌟 Principais Recursos

| Recurso | Descrição |
| :--- | :--- |
| **🧠 Núcleo Transformer** | Usa mecanismos de Self-Attention para modelar sinergias não-lineares. |
| **🧬 Multi-Objetivo** | Otimiza simultaneamente para Eficácia, Segurança e Preferências (NSGA-II). |
| **🔍 Explainable AI** | Abordagem "caixa de vidro" permitindo visualizar pesos de atenção (Mapas de Calor). |
| **🛡️ Incerteza UQ** | Quantificação via Monte Carlo Dropout para garantir previsões "Safety-First". |
| **🌿 Planta-Agnóstico** | Desenhado para Cannabis, mas adaptável para MTC, Ayurveda e flora Amazônica. |

---

## 🧠 Arquitetura Neural

O coração do SynPhytica é um **Dual-Attention Transformer**. Ele processa o perfil químico da planta e o perfil biológico do paciente para prever resultados.

<div align="center">
<img src="../../assets/images/neural_architecture_diagram.png" width="100%" alt="Arquitetura Neural Diagrama">
*Fusão Bio-Digital: Redes Neurais decodificando a Inteligência das Plantas*
</div>

---

## 🌍 Escalabilidade e Multidomínio

Embora a **Cannabis Medicinal** seja nosso caso de validação primário, o SynPhytica Engine foi projetado para decodificar a complexidade de *qualquer* sistema botânico.

### 🚀 Domínios Alvo
1.  **🇧🇷 Biodiversidade Brasileira (Amazônia/Cerrado)**: Copaíba, Andiroba, Açaí.
2.  **🇨🇳 Medicina Tradicional Chinesa (MTC)**: *Panax ginseng*, *Astragalus*.
3.  **🇮🇳 Ayurveda**: Ashwagandha, Curcumina.

---

## 💻 Instalação Manual

### 1. Motor Principal (Python/Rust)

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

### 2. Interface Web (Next.js)

```bash
cd web
npm install
npm run dev
```
Acesse o dashboard em `http://localhost:3000`.

---

## 📂 Estrutura do Projeto

```text
SynPhytica/
├── 🧠 synphytica_core.py       # Core AI Engine
├── 🌐 web/                     # Next.js Application (Interface Ativa)
├── 📊 data/
│   ├── raw/                    # Dados brutos
│   ├── processed/              # CSVs limpos
│   └── schema/                 # Schemas de validação
├── 📚 docs/
│   ├── en/                     # Documentação em Inglês
│   ├── pt/                     # Documentação em Português
│   └── COMPOUND_DATA_SCHEMA.md # Padrões de Contribuição
├── 🧪 examples/                # Scripts de uso
└── 🎨 assets/                  # Imagens e Visuais
```

---

## 🤝 Contribuindo

Congratulamos contribuições de desenvolvedores, farmacologistas e cientistas de dados!
- Veja [CONTRIBUTING.md](../../CONTRIBUTING.md) para diretrizes.

---

## 📜 Citação

Se você usar o SynPhytica em sua pesquisa, por favor cite:

```bibtex
@software{symbeon2025synphytica,
  author = {Symbeon Labs},
  title = {SynPhytica: AI-Powered Framework for Personalized Phytotherapeutic Formulation Optimization},
  year = {2025},
  publisher = {GitHub},
  version = {0.2.0-beta}
}
```

---

<div align="center">

**© 2025 Symbeon Labs** • Divisão de Pesquisa & Desenvolvimento

📧 [Fale Conosco](mailto:contact@symbeonlabs.com)

</div>

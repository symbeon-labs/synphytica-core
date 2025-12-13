# 🧬 SynPhytica

<div align="center">

![SynPhytica Banner](../../assets/images/banner.png)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/SH1W4/synphytica-core/blob/main/notebooks/SynPhytica_Validation.ipynb)
[![English](https://img.shields.io/badge/🇬🇧_English-Documentation-blue?style=for-the-badge)](../en/README.md)
[![Web Interface](https://img.shields.io/badge/🚀_Web_App-v0.2.0-cyan?style=for-the-badge)](../../web/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](../../LICENSE)

**Framework de IA para Otimização Personalizada de Formulações Fitoterápicas**

</div>

---

> 🧬 **GRANDE ATUALIZAÇÃO (v0.2.0):** A **Interface Web SynPhytica** está no ar! Experimente o **Visualizador de Campo Neural** e a **Documentação Interativa** diretamente no seu navegador.

---

## 📋 Visão Geral

**SynPhytica** é um framework computacional inovador que aplica inteligência artificial, otimização multiobjetivo e farmacologia de rede para o design racional de formulações fitoterápicas personalizadas. Inspirado por avanços recentes em biologia computacional, SynPhytica transpõe técnicas de deep learning e algoritmos evolutivos para o universo da medicina natural.

### 🎯 Problema Resolvido

Como desenhar, de modo objetivo e cientificamente justificável, uma formulação natural customizada para um paciente específico, em um universo de milhares de compostos possíveis, sem depender exclusivamente de tradição empírica ou tentativa-erro?

### 💡 Solução

SynPhytica formaliza matematicamente o problema de **polypharmacology personalizada**, balanceando eficácia, segurança e incerteza.

---

## 🚀 Interface Web SynPhytica

O novo frontend (`/web`) traz o núcleo matemático à vida, oferecendo uma experiência tátil e visual para pesquisadores e investidores.

### 🌌 Visualizador de Campo Neural (v4.0)
Uma simulação física interativa que representa o processo de otimização como um sistema biológico "vivo".
- **Do Caos à Ordem**: Observe moléculas se organizarem de alta entropia para clusters Pareto-ótimos.
- **Inspetor Químico**: Clique em partículas para revelar dados reais dos compostos (CBD, Limoneno, Mirceno) via cartões holográficos.
- **Feedback Tátil**: A visualização reage ao movimento do mouse, simulando dinâmica de fluidos.
- **Maestro IA**: Um agente autônomo monitora pontuações de sinergia e narra o processo de otimização.

### 📚 Documentação Interativa
Acesse o whitepaper completo, diagramas de arquitetura e referências de API diretamente através do dashboard web em `/docs`.

---

## 🔬 Fundamentos Científicos

### Modelagem Matemática

O framework baseia-se em uma função de fitness multiobjetivo:

```
F(x,u) = αE(x,u) - βR(x,u) + γM(x,u) - δP(x) - εU(x,u)
```

Onde:
- **E(x,u)**: Eficácia prevista ponderada
- **R(x,u)**: Riscos ponderados
- **M(x,u)**: Match de preferências
- **P(x)**: Penalidades de restrições
- **U(x,u)**: Penalização por incerteza

### Arquitetura Neural

O coração do SynPhytica é um modelo Transformer especializado que processa a "linguagem" das interações moleculares.

<div align="center">
<img src="../../assets/images/neural_architecture_diagram.png" width="100%" alt="Neural Architecture Bio-Digital Diagram">
</div>

---

## 🪙 DeSci & Financiamento Anônimo

SynPhytica opera como um protocolo de **Ciência Descentralizada (DeSci)**. Acreditamos na pesquisa aberta sem gargalos burocráticos.

- **Sem KYC**: Apoie a pesquisa anonimamente via Cripto (BTC, ETH, SOL).
- **Computação Direta**: Os fundos são alocados diretamente para clusters GPU para treinamento de modelos.
- **Acesso**: Contribuidores recebem acesso antecipado a chaves de API.

*Confira o módulo "Support R&D" na página de documentação da Interface Web.*

---

## 💻 Instalação e Uso

### 1. Motor Principal (Python/Rust)

```bash
git clone https://github.com/SH1W4/synphytica-core.git
cd synphytica-core
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
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

## 🌍 Escalabilidade e Multidomínio

Embora a **Cannabis Medicinal** seja nosso caso de validação primário, o SynPhytica Engine foi projetado para decodificar a complexidade de *qualquer* sistema botânico:

1.  **🇧🇷 Biodiversidade Brasileira** (Copaíba, Andiroba, Açaí)
2.  **🇨🇳 Medicina Tradicional Chinesa** (Panax ginseng)
3.  **🇮🇳 Ayurveda** (Ashwagandha)

---

## 📜 Citação

Se você usar o SynPhytica em sua pesquisa, por favor cite:

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

<div align="center">

**© 2025 Symbeon Labs** • Divisão de Pesquisa & Desenvolvimento

📧 [Fale Conosco](mailto:contact@symbeonlabs.com)

</div>

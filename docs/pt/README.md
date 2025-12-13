# 🧬 SynPhytica

<div align="center">

![SynPhytica Banner](assets/images/banner.png)

**AI-Powered Framework for Personalized Phytotherapeutic Formulation Optimization**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-red.svg)](https://pytorch.org/)
[![Status](https://img.shields.io/badge/Status-Research-yellow.svg)]()

</div>

---

## 📋 Visão Geral

**SynPhytica** é um framework computacional inovador que aplica inteligência artificial, otimização multiobjetivo e farmacologia de rede para o design racional de formulações fitoterápicas personalizadas. Inspirado por avanços recentes em biologia computacional, SynPhytica transpõe técnicas de deep learning e algoritmos evolutivos para o universo da medicina natural.

### 🎯 Problema Resolvido

Como desenhar, de modo objetivo e cientificamente justificável, uma formulação natural customizada para um paciente específico, em um universo de milhares de compostos possíveis, sem depender exclusivamente de tradição empírica ou tentativa-erro?

### 💡 Solução

SynPhytica formaliza matematicamente o problema de **polypharmacology personalizada**, balanceando:
- ✅ **Eficácia terapêutica** para indicações específicas
- ⚠️ **Segurança** e minimização de riscos
- 🎨 **Preferências do paciente** (sabor, forma, rotina)
- ⚖️ **Restrições regulatórias** e de dose
- 📊 **Incerteza epistemológica** das previsões

<div align="center">

![Conceito SynPhytica](assets/images/concept.png)
*Fusão de Matemática, IA e Medicina Natural*

</div>

### 🎬 Visualização do Motor de Otimização
Veja o **SynPhytica Engine** evoluir formulações em tempo real. A animação abaixo visualiza as 3 fases do nosso algoritmo genético:
1. **Exploração**: Amostragem aleatória (Caos Verde)
2. **Clusterização**: Encontrando pontos de sinergia
3. **Convergência de Pareto**: Ajuste fino para a Proporção Áurea (Soluções Ótimas)

<div align="center">

![SynPhytica Optimization Demo](../articles/images/synphytica_demo.gif)

</div>

---

### ⚡ Veja o SynPhytica em Ação

O GIF abaixo demonstra o processo de evolução das formulações. Partindo de combinações aleatórias (pontos dispersos), o algoritmo converge rapidamente para a **Fronteira de Pareto** (pontos dourados), maximizando a eficácia enquanto minimiza os riscos.

<div align="center">

![Optimization Process](assets/images/optimization_process.gif)
*Evolução dinâmica da população de formulações ao longo de 60 gerações*

</div>

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

- **Self-Attention**: Captura sinergias não-lineares entre compostos (ex: terpenos modulando canabinoides).
- **Cross-Attention**: Integra o perfil genético/clínico do paciente para personalizar a predição.
- **Dual Heads**: Estima simultaneamente a probabilidade de eficácia e o risco de efeitos adversos.

<div align="center">

![Neural Architecture](assets/images/neural_architecture_diagram.png)
*Diagrama esquemático do mecanismo de Atenção Dupla (Dual Attention)*

</div>

---

## 🚀 Instalação

### Requisitos

- Python 3.9+
- PyTorch 2.0+
- CUDA (opcional, para GPU)

### Setup

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/SynPhytica.git
cd SynPhytica

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

---

## 💻 Uso Básico

### Exemplo: Otimização de Formulação de Cannabis

```python
from synphytica import SynPhyticaOptimizer, CompoundLibrary, UserProfile

# 1. Carregar biblioteca de compostos
library = CompoundLibrary.from_csv('data/cannabis_compounds.csv')

# 2. Definir perfil do paciente
user = UserProfile(
    therapeutic_goals=['pain_relief', 'anxiety_reduction'],
    risk_sensitivities={'psychoactive': 0.8},
    preferences={'flavor': 'citrus', 'form': 'oil'}
)

# 3. Executar otimização
optimizer = SynPhyticaOptimizer(
    library=library,
    user_profile=user,
    population_size=100,
    generations=50
)

results = optimizer.optimize()

# 4. Visualizar top soluções
for solution in results.pareto_front[:5]:
    print(solution.summary())
```

### Output Esperado

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

## 📁 Estrutura do Projeto

```
SynPhytica/
├── synphytica/
│   ├── __init__.py
│   ├── core.py              # Modelo Transformer e otimizador
│   ├── compounds.py         # Classes de dados
│   ├── fitness.py           # Função de fitness
│   └── utils.py             # Utilitários
├── data/
│   └── example_compounds.csv
├── examples/
│   └── cannabis_optimization.py
├── docs/
│   ├── SynPhytica_paper_PT.pdf
│   ├── SynPhytica_paper_EN.pdf
│   └── mathematical_formalization.tex
├── tests/
│   └── test_core.py
├── requirements.txt
├── LICENSE
└── README.md
```

---

## 📊 Casos de Uso

### 1. Cannabis Medicinal
- 52 compostos (9 canabinoides + 43 terpenos)
- 18 indicações terapêuticas
- Validação com literatura científica

### 2. Medicina Tradicional Chinesa (TCM)
- Bibliotecas de ervas e fórmulas clássicas
- Otimização de blends personalizados

### 3. Nutracêuticos
- Suplementos e vitaminas
- Personalização baseada em genética

---

## 🔬 Validação Científica

### Performance de Otimização

O gráfico abaixo demonstra a superioridade do algoritmo híbrido do SynPhytica (Fronteira de Pareto) comparado a métodos tradicionais. Note como o SynPhytica encontra soluções com maior eficácia para o mesmo nível de risco.

<div align="center">

![Pareto Frontier](assets/images/pareto_front.png)
*Comparativo: SynPhytica (Verde/Dourado) vs. Random Search (Azul)*

</div>

### Explainable AI: Decodificando o "Entourage Effect"

Diferente de modelos "caixa-preta", o mecanismo de atenção do SynPhytica permite visualizar exatamente quais interações moleculares o modelo está priorizando. O mapa de calor abaixo mostra a **Matriz de Self-Attention**, onde pontos quentes indicam forte sinergia detectada (ex: THC modulado por Limoneno).

<div align="center">

![Synergy Heatmap](assets/images/synergy_heatmap.png)
*Matriz de Atenção Neural revelando clusters de sinergia molecular*

</div>

### Métricas de Performance

- **Hipervolume**: Cobertura do espaço Pareto superior em 25%
- **Satisfação de Restrições**: 100% de soluções viáveis
- **Explicabilidade**: Visualizações de contribuição por composto

### Publicações

- 📄 **Formalização Matemática**: `docs/SynPhytica_paper_PT.pdf`
- 📄 **Technical Specification**: `docs/SynPhytica_paper_EN.pdf`

[![GitHub](https://img.shields.io/badge/GitHub-SynPhytica-black?logo=github)](https://github.com/seu-usuario/SynPhytica)

</div>

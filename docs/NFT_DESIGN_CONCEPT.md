# SynPhytica NFT Design Concept: "Bio-Digital Genesis"

## Visão Geral
Os NFTs do SynPhytica não são apenas colecionáveis; são **Chaves de Acesso** e **Certificados de Contribuição Científica**. Eles representam a fusão entre biologia orgânica e inteligência artificial ética.

Inspiração: GhostFund Patron Genesis (Estética Cyberpunk/Etérea).

## Coleção: "Genesis Molecules"

### Estrutura Visual
Cada NFT é um cartão holográfico animado contendo três camadas de informação visual:
1.  **O Núcleo (Core):** Uma representação 3D de uma estrutura biológica (Molécula, DNA, Neurônio).
2.  **A Aura (Data):** Fluxos de dados binários e tensores que orbitam o núcleo, representando a IA.
3.  **O Selo (Validation):** Um selo dourado ou prateado com a marca do **SEVE Framework**, garantindo que aquela contribuição apoiou ciência ética.

### Tiers (Níveis de Raridade/Contribuição)

#### Tier 0: Genesis Founder (Edição Limitada)
*   **Asset Original:** `assets/images/genesis_patron_badge_nft_1765668245579.png`
*   **Status:** **LENDÁRIO** (Apenas para os primeiros 100 apoiadores).
*   **Conceito:** A semente original do projeto. O selo que prova que você estava lá antes de tudo começar.
*   **Utilidade:** Governance Power Multiplier (2x) e Acesso Vitalício a todos os produtos futuros do ecossistema Symbeon.

#### Tier 1: The Observer (O Observador)
*   **Conceito:** O olhar curioso que inicia a ciência.
*   **Visual:** Uma placa de Petri digital vista de cima. Dentro, pequenos pontos de luz (dados) começam a se aglutinar.
*   **Cor Primária:** Deep Blue / Faded Purple.
*   **Utilidade:** Acesso a newsletters exclusivas e ao canal "Community" no Discord.

#### Tier 2: The Catalyst (O Catalisador)
*   **Conceito:** A energia que impulsiona a reação.
*   **Visual:** Uma molécula de **Canabidiol (CBD)** ou **Limoneno** estilizada, girando em 3D. Estrutura de arame (wireframe) brilhante.
*   **Cor Primária:** Neon Cyan / Electric Blue.
*   **Utilidade:** Acesso ao Painel de Visualização do SynPhytica (versão Lite) e votação em quais compostos investigar na próxima rodada.

#### Tier 3: The Architect (O Arquiteto)
*   **Conceito:** Aquele que constrói a fundação do futuro.
*   **Visual:** Uma **Dupla Hélice de DNA** onde uma das fitas é orgânica e a outra é feita de nós de rede neural brilhantes. Elas se entrelaçam perfeitamente.
*   **Cor Primária:** Gold / Platinum / Iridescent.
*   **Utilidade:** 
    *   Acesso total aos dados "Protected Viewer" (implementado no site).
    *   Direito de baixar os pesos do modelo (sob licença restrita).
    *   Crédito nominal no paper acadêmico final ("Supported by...").

## Lógica Técnica (Integrada ao GhostFund)

### Metadados (On-Chain)
Cada NFT conterá metadados imutáveis gerados no momento da doação:

```json
{
  "name": "SynPhytica Genesis #042",
  "description": "Proof of contribution to Ethical AI-Driven Polypharmacology.",
  "attributes": [
    { "trait_type": "Tier", "value": "Architect" },
    { "trait_type": "Research Phase", "value": "Validating Neural Surrogate" },
    { "trait_type": "Ethical Compliance", "value": "SEVE-Strict-Pass" },
    { "trait_type": "Contribution Date", "value": "2025-12-14" }
  ],
  "image": "ipfs://..."
}
```

### Mecanismo de Geração
1.  **Input:** Valor da Doação (ETH) + Timestamp.
2.  **Processamento:** O contrato GhostFund detecta o valor.
    *   < 0.1 ETH: Tier 1
    *   0.1 - 1.0 ETH: Tier 2
    *   > 1.0 ETH: Tier 3
3.  **Validação SEVE:** O oracle valida se o projeto ainda está em conformidade.
4.  **Mint:** O NFT é gerado e enviado para a carteira do doador.

## Próximos Passos de Design
1.  Utilizar ferramentas de IA Generativa (Midjourney/DALL-E) para criar os assets base dos 3 Tiers seguindo a estética "Bio-Digital".
2.  Criar o contrato `SynPhyticaGenesis.sol` herdando do padrão `GhostFundPatronSeal`.

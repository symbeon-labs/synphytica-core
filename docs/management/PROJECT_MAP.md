# SynPhytica Project Map (Navigational Chart)

Este documento mapeia o estado atual do projeto e as rotas para as próximas sessões de desenvolvimento.

---

## 📍 Você Está Aqui (Status Atual)

O projeto evoluiu de um script de backend para uma **Plataforma Full-Stack**.

*   **📂 /synphytica_core.py**: O cérebro (Matemática + IA). Funcional e validado.
*   **📂 /web**: O rosto (Next.js Dashboard). Visualmente pronto, mas rodando em modo simulação.
*   **📂 /docs**: A voz (Whitepaper + API Specs). Sanitizado para investidores.

---

## 🗺️ Próxima Sessão: "The Synapse" (Integração)

O objetivo da próxima sessão deve ser **conectar o Cérebro ao Rosto**.

### Passo 1: Criar a API Python (FastAPI)
- Transformar `synphytica_core.py` em um microserviço.
- Endpoints:
    - `POST /optimize`: Recebe JSON do paciente, retorna Stream de evolução.
    - `GET /compounds`: Retorna a lista da biblioteca.

### Passo 2: Conectar o Frontend
- Substituir a lógica simulada do `OptimizationVisualizer.tsx` por **WebSockets** ou **SSE (Server-Sent Events)** recebendo dados reais da API Python.
- Fazer o "Inspetor Molecular" puxar dados reais do `CompoundLibrary`.

### Passo 3: Deploy
- Colocar o Frontend na Vercel.
- Colocar o Backend no Railway/Render (Docker).

---

## 💡 Ideia Incubada: "GhostFund Protocol"

**Conceito**: Extrair o componente de doação anônima (`web/src/components/CryptoFunding.tsx`) para um repositório próprio.

**Ações Futuras:**
1.  Criar repo `ghost-fund-protocol`.
2.  Generalizar o componente (aceitar props de carteiras).
3.  Publicar como pacote npm (`npm install @ghostfund/react`).
4.  Criar landing page minimalista focada em DeSci.

---

## ⚠️ Arquivos Críticos para Manter

*   `push_fix.ps1`: Script de deploy git (essencial devido a problemas de token).
*   `web/src/components/OptimizationVisualizer.tsx`: Onde reside a mágica visual (v4.0).

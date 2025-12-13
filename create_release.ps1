# Script para criar release sem conflito com GITHUB_TOKEN
# Remove temporariamente a variável de ambiente e cria a release

# Salvar o token atual (se existir)
$oldToken = $env:GITHUB_TOKEN

# Remover temporariamente
$env:GITHUB_TOKEN = $null

Write-Host "🔓 GITHUB_TOKEN removido temporariamente" -ForegroundColor Yellow
Write-Host "📦 Criando release v0.2.0-beta..." -ForegroundColor Cyan

# Criar a release
gh release create v0.2.0-beta `
    --title "SynPhytica v0.2.0-beta: Hybrid Rust Engine" `
    --notes-file RELEASE_NOTES.md

# Restaurar o token
$env:GITHUB_TOKEN = $oldToken

Write-Host "✅ Release criada! Token restaurado." -ForegroundColor Green

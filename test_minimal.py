"""
Teste Mínimo do SynPhytica Core
================================

Testa apenas a importação e estrutura básica, sem rodar otimização completa.
"""

import sys
import os

print("=" * 80)
print("SYNPHYTICA - TESTE MÍNIMO DE IMPORTAÇÃO")
print("=" * 80)

# Teste 1: Verificar se o arquivo existe
print("\n[Teste 1/3] Verificando arquivo synphytica_core.py...")
core_file = "synphytica_core.py"
if os.path.exists(core_file):
    print(f"✓ Arquivo encontrado: {core_file}")
    print(f"  Tamanho: {os.path.getsize(core_file)} bytes")
else:
    print(f"✗ ERRO: Arquivo não encontrado!")
    sys.exit(1)

# Teste 2: Tentar importar o módulo
print("\n[Teste 2/3] Importando módulo...")
try:
    import synphytica_core
    print("✓ Módulo importado com sucesso")
except Exception as e:
    print(f"✗ ERRO na importação: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Teste 3: Verificar classes principais
print("\n[Teste 3/3] Verificando classes principais...")
required_classes = [
    'Compound',
    'CompoundLibrary',
    'UserProfile',
    'SynPhyticaOptimizer',
    'FormulationResult'
]

missing = []
for class_name in required_classes:
    if hasattr(synphytica_core, class_name):
        print(f"  ✓ {class_name}")
    else:
        print(f"  ✗ {class_name} NÃO ENCONTRADA")
        missing.append(class_name)

if missing:
    print(f"\n✗ FALHA: {len(missing)} classes faltando: {missing}")
    sys.exit(1)

# Resumo
print("\n" + "=" * 80)
print("RESULTADO: TODOS OS TESTES PASSARAM ✓")
print("=" * 80)
print("\nO módulo synphytica_core está estruturalmente correto.")
print("Próximo passo: Testar execução completa com otimização.")

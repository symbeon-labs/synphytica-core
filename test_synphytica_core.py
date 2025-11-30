"""
SynPhytica Core - Validation Test
==================================

Testa o funcionamento real do motor de otimização.

Author: Symbeon Labs
"""

import sys
import traceback
import numpy as np

print("=" * 80)
print("SYNPHYTICA CORE - TESTE DE VALIDAÇÃO")
print("=" * 80)

# Teste 1: Importação
print("\n[Teste 1/5] Importando módulo core...")
try:
    from synphytica_core import (
        Compound,
        CompoundLibrary,
        UserProfile,
        SynPhyticaOptimizer,
        SynPhyticaTransformer
    )
    print("✓ Importação bem-sucedida")
except Exception as e:
    print(f"✗ ERRO na importação: {e}")
    traceback.print_exc()
    sys.exit(1)

# Teste 2: Criação de biblioteca sintética
print("\n[Teste 2/5] Criando biblioteca sintética de cannabis...")
try:
    library = CompoundLibrary.create_synthetic_cannabis_library()
    print(f"✓ Biblioteca criada com {library.size()} compostos")
    print(f"  Indicações disponíveis: {len(library.all_indications)}")
    print(f"  Efeitos adversos catalogados: {len(library.all_effects)}")
except Exception as e:
    print(f"✗ ERRO ao criar biblioteca: {e}")
    traceback.print_exc()
    sys.exit(1)

# Teste 3: Criação de perfil de usuário
print("\n[Teste 3/5] Criando perfil de usuário...")
try:
    user = UserProfile(
        therapeutic_goals={'pain': 0.9, 'anxiety': 0.7},
        risk_sensitivities={'psychoactive': 0.8, 'sedation': 0.5},
        preferences={'flavor': 'citrus', 'form': 'oil'}
    )
    print("✓ Perfil de usuário criado")
    print(f"  Objetivos terapêuticos: {user.therapeutic_goals}")
except Exception as e:
    print(f"✗ ERRO ao criar perfil: {e}")
    traceback.print_exc()
    sys.exit(1)

# Teste 4: Inicialização do modelo e otimizador
print("\n[Teste 4/5] Inicializando modelo e otimizador...")
try:
    # Calcular dimensões
    n_indications = len(library.all_indications)
    n_effects = len(library.all_effects)
    
    sample_compound = library.compounds[0]
    compound_vec = sample_compound.to_vector(library.all_indications, library.all_effects)
    compound_dim = len(compound_vec)
    
    user_vec = user.to_vector(library.all_indications, library.all_effects)
    user_dim = len(user_vec)
    
    # Instanciar Modelo
    model = SynPhyticaTransformer(
        compound_dim=compound_dim,
        user_dim=user_dim,
        n_indications=n_indications,
        n_effects=n_effects,
        d_model=64,
        n_heads=4,
        n_layers=2
    )
    print("✓ Modelo Transformer inicializado")

    # Instanciar Otimizador
    optimizer = SynPhyticaOptimizer(
        library=library,
        model=model,
        user_profile=user,
        population_size=20,  # Pequeno para teste rápido
        n_generations=5,     # Poucas gerações
    )
    print("✓ Otimizador inicializado")
    print(f"  População: {optimizer.pop_size}")
    print(f"  Gerações: {optimizer.n_gen}")
except Exception as e:
    print(f"✗ ERRO ao inicializar otimizador: {e}")
    traceback.print_exc()
    sys.exit(1)

# Teste 5: Execução da otimização
print("\n[Teste 5/5] Executando otimização (5 gerações)...")
try:
    results = optimizer.optimize()
    print(f"✓ Otimização concluída!")
    print(f"  Soluções na Fronteira de Pareto: {len(results)}")
    
    if len(results) > 0:
        print("\n" + "=" * 80)
        print("MELHOR SOLUÇÃO (Top 1)")
        print("=" * 80)
        best = results[0]
        print(best.summary(library, top_n=5))
    else:
        print("⚠ Nenhuma solução na Fronteira de Pareto")
        
except Exception as e:
    print(f"✗ ERRO durante otimização: {e}")
    traceback.print_exc()
    sys.exit(1)

# Resumo Final
print("\n" + "=" * 80)
print("RESUMO DA VALIDAÇÃO")
print("=" * 80)
print("✓ Todos os testes passaram com sucesso!")
print("\nO SynPhytica Core está funcional e pronto para uso.")

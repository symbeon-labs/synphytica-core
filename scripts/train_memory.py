"""
SynPhytica Memory Initializer
==============================

Inicializa e salva o "cérebro" da IA (pesos do modelo) baseado
nos dados reais de Cannabis.

Author: Symbeon Labs
"""

import os
import sys
import torch
# Adicionar diretório raiz ao path para importar synphytica_core
sys.path.append(os.getcwd())

from synphytica_core import CompoundLibrary, SynPhyticaTransformer, UserProfile

def init_memory():
    print("🧠 Inicializando Memória da IA...")
    
    # 1. Carregar Dados
    # Usamos a biblioteca sintética como base estrutural confiável
    library = CompoundLibrary.create_synthetic_cannabis_library()
    print(f"✓ Biblioteca carregada: {library.size()} compostos")
    
    # 2. Calcular Dimensões
    n_indications = len(library.all_indications)
    n_effects = len(library.all_effects)
    
    sample_compound = library.compounds[0]
    compound_vec = sample_compound.to_vector(library.all_indications, library.all_effects)
    compound_dim = len(compound_vec)
    
    # Mock user just to get dimension
    user = UserProfile({}, {}, {})
    user_vec = user.to_vector(library.all_indications, library.all_effects)
    user_dim = len(user_vec)
    
    print(f"✓ Dimensões: Compound={compound_dim}, User={user_dim}")
    
    # 3. Inicializar Modelo (O Cérebro)
    model = SynPhyticaTransformer(
        compound_dim=compound_dim,
        user_dim=user_dim,
        n_indications=n_indications,
        n_effects=n_effects,
        d_model=64,
        n_heads=4,
        n_layers=2
    )
    
    # 4. Salvar Memória
    os.makedirs('models', exist_ok=True)
    save_path = 'models/synphytica_brain_v1.pth'
    model.save(save_path)
    
    print(f"\n✨ Memória criada com sucesso em: {save_path}")
    print("Agora a IA pode ser carregada e continuar aprendendo.")

if __name__ == "__main__":
    init_memory()

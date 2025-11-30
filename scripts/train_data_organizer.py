"""
SynPhytica Data Organizer Trainer
==================================

Este script treina um modelo de "Meta-Learning" que aprende a ESTRUTURA e ORGANIZAÇÃO
dos dados de Cannabis para aplicar esse padrão a outras plantas.

Objetivo: Permitir que desenvolvedores insiram dados brutos de qualquer espécie
(Copaíba, Ginseng, etc.) e o sistema categorize automaticamente baseando-se
no "Gold Standard" da Cannabis.

Author: Symbeon Labs
"""

import pandas as pd
import json
import re
import os
from collections import defaultdict
import numpy as np

def analyze_structure(file_path):
    """
    Analisa a estrutura do CSV de Cannabis para extrair padrões de organização.
    """
    print(f"🔍 Analisando estrutura de referência: {file_path}")
    
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print("⚠ Arquivo não encontrado. Usando dados sintéticos para demonstração.")
        # Dados sintéticos simulando a estrutura real
        data = {
            'Compound': ['THC', 'CBD', 'Myrcene', 'Limonene', 'Pinene'],
            'Type': ['Cannabinoid', 'Cannabinoid', 'Terpene', 'Terpene', 'Terpene'],
            'Boiling_Point_C': [157, 180, 168, 176, 155],
            'Effect_Analgesic': [0.9, 0.7, 0.6, 0.2, 0.3],
            'Effect_Sedative': [0.4, 0.2, 0.8, 0.1, 0.0],
            'Molecule_Weight': [314.45, 314.46, 136.23, 136.24, 136.23]
        }
        df = pd.DataFrame(data)

    schema_knowledge = {
        "column_types": {},
        "value_patterns": {},
        "categorical_vocabularies": {},
        "numerical_ranges": {}
    }

    # 1. Aprender Tipos de Colunas
    for col in df.columns:
        dtype = str(df[col].dtype)
        schema_knowledge["column_types"][col] = dtype
        
        # 2. Aprender Vocabulários Controlados (para texto)
        if df[col].dtype == 'object':
            unique_vals = df[col].dropna().unique().tolist()
            if len(unique_vals) < 50:  # Se tem poucos valores únicos, é uma categoria
                schema_knowledge["categorical_vocabularies"][col] = unique_vals
            
            # Aprender padrões de texto (Regex simples)
            suffixes = [val[-3:] for val in unique_vals if isinstance(val, str) and len(val) > 3]
            if suffixes:
                from collections import Counter
                common_suffixes = Counter(suffixes).most_common(3)
                schema_knowledge["value_patterns"][col] = {
                    "common_suffixes": [s[0] for s in common_suffixes]
                }

        # 3. Aprender Faixas Numéricas (para validação)
        elif np.issubdtype(df[col].dtype, np.number):
            schema_knowledge["numerical_ranges"][col] = {
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "mean": float(df[col].mean()),
                "std": float(df[col].std())
            }

    return schema_knowledge

def generate_universal_classifier(schema_knowledge):
    """
    Gera regras universais baseadas no conhecimento extraído.
    Exemplo: "Se termina em 'ene', provavelmente é um Terpeno (como na Cannabis)."
    """
    classifier_rules = []

    # Regra para identificar Terpenos vs Canabinoides/Alcaloides
    if "Compound" in schema_knowledge["value_patterns"]:
        suffixes = schema_knowledge["value_patterns"]["Compound"]["common_suffixes"]
        classifier_rules.append({
            "target_category": "Terpene",
            "rule_type": "suffix_match",
            "patterns": [s for s in suffixes if s in ['ene', 'ol']] # Refinamento manual da IA
        })

    # Regra para identificar Colunas de Efeito
    effect_cols = [col for col in schema_knowledge["column_types"] if "Effect" in col or "Indication" in col]
    if effect_cols:
        classifier_rules.append({
            "target_type": "Biological_Effect",
            "rule_type": "column_name_match",
            "patterns": ["Effect_", "Indication_", "Treats_"]
        })

    return {
        "learned_schema": schema_knowledge,
        "universal_rules": classifier_rules,
        "meta_info": {
            "source_organism": "Cannabis sativa",
            "description": "Ontology derived from Cannabis data to structure other botanical datasets."
        }
    }

def save_model(model, output_path):
    """Salva o 'Cérebro Organizador' em JSON."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(model, f, indent=4)
    print(f"✓ Modelo de Organização Universal salvo em: {output_path}")

if __name__ == "__main__":
    # Caminho para os dados reais de Cannabis
    raw_data_path = "data/raw/compostos_cannabis_curated.csv"
    output_model_path = "models/universal_data_organizer.json"

    print("🧠 Iniciando Treinamento do Organizador Universal...")
    
    # 1. Analisar a estrutura da Cannabis
    knowledge = analyze_structure(raw_data_path)
    
    # 2. Gerar regras universais
    universal_model = generate_universal_classifier(knowledge)
    
    # 3. Salvar o modelo
    save_model(universal_model, output_model_path)
    
    print("\nConclusão:")
    print("A IA aprendeu como a Cannabis é organizada.")
    print("Agora ela pode aplicar essa lógica para estruturar dados de Copaíba, Ginseng, etc.")

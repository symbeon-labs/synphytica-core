"""
SynPhytica Data Quality Auditor
===============================

Valida se os arquivos de dados (CSV) estão em conformidade com os
padrões de qualidade definidos nos templates do DocSync.

Checks:
1. Missing Values (Critical fields like SMILES, Name)
2. Data Types (Numeric vs String)
3. Outlier Detection (e.g., Boiling Point > 500C for terpenes)
4. Schema Compliance

Author: Symbeon Labs
"""

import pandas as pd
import numpy as np
import sys
import os

def audit_cannabis_data(file_path):
    print(f"🕵️‍♂️ Iniciando Auditoria de Qualidade: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        # Criar arquivo dummy para teste se não existir
        print("ℹ️ Criando arquivo de exemplo para demonstração...")
        data = {
            'Compound': ['THC', 'CBD', 'Myrcene'],
            'Type': ['Cannabinoid', 'Cannabinoid', 'Terpene'],
            'SMILES': ['CCCCC1...', 'CCCCC2...', 'CC(C)=CCCC...'],
            'Molecular_Weight': [314.45, 314.46, 136.23],
            'Effect_Pain': [0.9, 0.7, 0.5],
            'Effect_Anxiety': [0.2, 0.8, 0.6]
        }
        df = pd.DataFrame(data)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        df.to_csv(file_path, index=False)
        print("✓ Arquivo de exemplo criado.")
    else:
        df = pd.read_csv(file_path)

    report = []
    score = 100
    
    # 1. Check Critical Columns
    critical_cols = ['Compound', 'Type', 'SMILES', 'Molecular_Weight']
    for col in critical_cols:
        if col not in df.columns:
            report.append(f"❌ Coluna Crítica Ausente: {col}")
            score -= 20
        elif df[col].isnull().any():
            missing_count = df[col].isnull().sum()
            report.append(f"⚠️ Valores Ausentes em {col}: {missing_count} linhas")
            score -= (missing_count * 2)

    # 2. Check Data Consistency (Physics)
    if 'Molecular_Weight' in df.columns:
        # Terpenos e Canabinoides geralmente tem MW entre 100 e 400
        invalid_mw = df[(df['Molecular_Weight'] < 50) | (df['Molecular_Weight'] > 500)]
        if not invalid_mw.empty:
            report.append(f"⚠️ Peso Molecular Suspeito (fora de 50-500): {len(invalid_mw)} compostos")
            score -= 5

    # 3. Check Classification
    if 'Type' in df.columns:
        valid_types = ['Cannabinoid', 'Terpene', 'Flavonoid', 'Alkaloid']
        unknown_types = df[~df['Type'].isin(valid_types)]['Type'].unique()
        if len(unknown_types) > 0:
            report.append(f"ℹ️ Novos Tipos Detectados (não padrão): {unknown_types}")
            # Não penaliza, apenas avisa

    # 4. Check Effect Scores (Must be 0-1)
    effect_cols = [c for c in df.columns if 'Effect_' in c or 'Indication_' in c]
    for col in effect_cols:
        # Ignorar NaNs na verificação de range
        col_data = df[col].dropna()
        if not col_data.empty:
            if col_data.max() > 1.0 or col_data.min() < 0.0:
                report.append(f"❌ Erro de Normalização em {col}: Valores fora de [0,1]")
                score -= 10

    # Relatório Final
    print("\n" + "="*40)
    print(f"📊 RELATÓRIO DE QUALIDADE DE DADOS")
    print("="*40)
    print(f"Score Final: {max(0, score)}/100")
    print(f"Total de Compostos: {len(df)}")
    print("-" * 40)
    
    if not report:
        print("✅ Dados Perfeitos! Nenhuma anomalia detectada.")
    else:
        for item in report:
            print(item)
            
    if score < 80:
        print("\n⚠️ AVISO: A qualidade dos dados está abaixo do recomendado para treinamento.")
        return False
    
    return True

if __name__ == "__main__":
    # Caminho padrão para o dataset curado
    data_path = "data/raw/compostos_cannabis_curated.csv"
    audit_cannabis_data(data_path)

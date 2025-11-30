import pandas as pd
import json

# Ler CSV curado
df = pd.read_csv('data/raw/compostos_cannabis_curated.csv')

print("=" * 80)
print("ANÁLISE DO DATASET CURADO DE CANNABIS")
print("=" * 80)

print(f"\nTotal de compostos: {len(df)}")
print(f"\nColunas ({len(df.columns)}):")
for i, col in enumerate(df.columns, 1):
    print(f"  {i}. {col}")

print("\n" + "=" * 80)
print("PRIMEIRAS 10 LINHAS")
print("=" * 80)
print(df.head(10).to_string())

print("\n" + "=" * 80)
print("INFORMAÇÕES DO DATASET")
print("=" * 80)
print(df.info())

print("\n" + "=" * 80)
print("ESTATÍSTICAS DESCRITIVAS")
print("=" * 80)
print(df.describe(include='all'))

# Salvar resumo
with open('data/processed/curated_dataset_summary.txt', 'w', encoding='utf-8') as f:
    f.write("DATASET CURADO DE CANNABIS - RESUMO\n")
    f.write("=" * 80 + "\n\n")
    f.write(f"Total de compostos: {len(df)}\n\n")
    f.write("Colunas:\n")
    for col in df.columns:
        f.write(f"  - {col}\n")
    f.write("\n" + "=" * 80 + "\n")
    f.write("DADOS COMPLETOS:\n")
    f.write("=" * 80 + "\n")
    f.write(df.to_string())

print("\n✓ Resumo salvo em data/processed/curated_dataset_summary.txt")

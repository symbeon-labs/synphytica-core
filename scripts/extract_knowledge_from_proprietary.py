"""
Knowledge Extractor - Proprietary to Public Schema
===================================================

Extracts the STRUCTURE and SCHEMA from proprietary research data
without exposing the actual sensitive content.

Creates:
1. Public template with field descriptions
2. Example entries (anonymized/synthetic)
3. Validation schema

Author: Symbeon Labs
"""

import pandas as pd
import json
from pathlib import Path

def analyze_proprietary_data(csv_path: Path) -> dict:
    """Analyze proprietary data to extract schema."""
    df = pd.read_csv(csv_path)
    
    schema = {
        "total_compounds": len(df),
        "total_fields": len(df.columns),
        "fields": {}
    }
    
    for col in df.columns:
        schema["fields"][col] = {
            "type": str(df[col].dtype),
            "non_null_count": int(df[col].notna().sum()),
            "null_count": int(df[col].isna().sum()),
            "unique_values": int(df[col].nunique()),
            "sample_length": float(df[col].astype(str).str.len().mean()) if df[col].notna().any() else 0.0,
            "has_data": bool(df[col].notna().any())
        }
    
    return schema

def create_public_template(schema: dict) -> pd.DataFrame:
    """Create a public template CSV with field descriptions."""
    template_data = []
    
    # Create 3 example rows with synthetic/generic data
    for i in range(3):
        row = {}
        for field, info in schema["fields"].items():
            if "Composto" in field or "Compound" in field:
                row[field] = f"Example_Compound_{i+1}"
            elif "Classe" in field or "Class" in field:
                row[field] = "Terpene" if i == 0 else ("Cannabinoid" if i == 1 else "Flavonoid")
            elif "Efeitos" in field or "Effects" in field:
                row[field] = "Describe known physiological/psychological effects here"
            elif "Dosagem" in field or "Dosage" in field:
                row[field] = "5-20 mg (oral)"
            elif "Potencial" in field or "Therapeutic" in field:
                row[field] = "Condition (Evidence level: Clinical/Preclinical/Anecdotal)"
            elif "Colaterais" in field or "Side" in field:
                row[field] = "List side effects with frequency (common/occasional/rare)"
            elif "Interações" in field or "Interactions" in field:
                row[field] = "List drug interactions and mechanisms"
            elif "Fontes" in field or "Sources" in field:
                row[field] = "DOI: 10.xxxx/xxxxx, PMID: xxxxxxx"
            elif "Links" in field or "BD" in field:
                row[field] = "PubChem CID: xxxxx, ChEMBL: CHEMBLxxxx"
            else:
                row[field] = f"[{field} data here]"
        
        template_data.append(row)
    
    return pd.DataFrame(template_data)

def create_validation_schema(schema: dict) -> dict:
    """Create JSON schema for validation."""
    validation = {
        "version": "1.0",
        "required_fields": [],
        "optional_fields": [],
        "field_types": {}
    }
    
    # Determine required vs optional based on data completeness
    for field, info in schema["fields"].items():
        completeness = info["non_null_count"] / schema["total_compounds"]
        
        if completeness > 0.9:  # 90%+ filled = required
            validation["required_fields"].append(field)
        else:
            validation["optional_fields"].append(field)
        
        validation["field_types"][field] = {
            "type": "string",  # Simplified for CSV
            "description": f"Field from proprietary schema",
            "example_length": int(info["sample_length"])
        }
    
    return validation

def main():
    """Main execution."""
    print("=" * 80)
    print("KNOWLEDGE EXTRACTOR - Proprietary to Public")
    print("=" * 80)
    
    # Path to proprietary data (NOT committed to git)
    proprietary_path = Path("data/raw/compostos_cannabis_curated.csv")
    
    if not proprietary_path.exists():
        print(f"✗ Proprietary data not found at {proprietary_path}")
        print("  This is expected if running from a clean clone.")
        return
    
    print(f"\n[1/3] Analyzing proprietary data structure...")
    schema = analyze_proprietary_data(proprietary_path)
    
    print(f"✓ Found {schema['total_compounds']} compounds with {schema['total_fields']} fields")
    
    # Save schema (metadata only, no sensitive data)
    schema_path = Path("data/schema/compound_schema_metadata.json")
    schema_path.parent.mkdir(parents=True, exist_ok=True)
    with open(schema_path, 'w', encoding='utf-8') as f:
        json.dump(schema, f, indent=2)
    print(f"✓ Schema metadata saved to {schema_path}")
    
    print(f"\n[2/3] Creating public template...")
    template_df = create_public_template(schema)
    
    template_path = Path("data/templates/compound_contribution_template.csv")
    template_path.parent.mkdir(parents=True, exist_ok=True)
    template_df.to_csv(template_path, index=False)
    print(f"✓ Public template saved to {template_path}")
    
    print(f"\n[3/3] Creating validation schema...")
    validation = create_validation_schema(schema)
    
    validation_path = Path("data/schema/validation_schema.json")
    with open(validation_path, 'w', encoding='utf-8') as f:
        json.dump(validation, f, indent=2)
    print(f"✓ Validation schema saved to {validation_path}")
    
    # Print summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Required fields: {len(validation['required_fields'])}")
    print(f"Optional fields: {len(validation['optional_fields'])}")
    print("\nRequired fields:")
    for field in validation['required_fields']:
        print(f"  - {field}")
    
    print("\n✓ Knowledge extraction complete!")
    print("\nPublic files created (safe to commit):")
    print(f"  - {schema_path}")
    print(f"  - {template_path}")
    print(f"  - {validation_path}")
    print("\nProprietary data remains local (protected by .gitignore)")

if __name__ == "__main__":
    main()

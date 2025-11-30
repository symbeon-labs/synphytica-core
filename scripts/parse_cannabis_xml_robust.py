"""
Robust XML Parser for Cannabis Compound Database
=================================================

Handles malformed XML by parsing line-by-line and extracting compound blocks.

Author: Symbeon Labs
"""

import re
import json
import pandas as pd
from pathlib import Path
from typing import List, Dict

def extract_compound_blocks(xml_path: Path) -> List[str]:
    """Extract individual compound XML blocks from potentially malformed file."""
    print(f"Reading {xml_path}...")
    
    with open(xml_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Find all compound blocks using regex
    pattern = r'<compound>.*?</compound>'
    compounds = re.findall(pattern, content, re.DOTALL)
    
    print(f"✓ Found {len(compounds)} compound blocks")
    return compounds

def parse_compound_block(xml_block: str) -> Dict:
    """Parse a single compound XML block."""
    compound = {}
    
    # Extract simple fields
    fields = {
        'compound_id': r'<id>(.*?)</id>',
        'name': r'<name>(.*?)</name>',
        'description': r'<description>(.*?)</description>',
        'cas_number': r'<cas-number>(.*?)</cas-number>',
        'formula': r'<chemical-formula>(.*?)</chemical-formula>',
        'molecular_weight': r'<average-molecular-weight>(.*?)</average-molecular-weight>',
        'smiles': r'<smiles>(.*?)</smiles>',
        'inchi': r'<inchi>(.*?)</inchi>',
    }
    
    for field, pattern in fields.items():
        match = re.search(pattern, xml_block, re.DOTALL)
        compound[field] = match.group(1).strip() if match else None
    
    # Extract indications
    indications = re.findall(r'<indication>(.*?)</indication>', xml_block, re.DOTALL)
    compound['therapeutic_indications'] = [ind.strip() for ind in indications]
    
    # Extract targets
    target_blocks = re.findall(r'<target>.*?</target>', xml_block, re.DOTALL)
    targets = []
    for target_block in target_blocks:
        target_name = re.search(r'<name>(.*?)</name>', target_block)
        target_id = re.search(r'<id>(.*?)</id>', target_block)
        if target_name:
            targets.append({
                'name': target_name.group(1).strip(),
                'id': target_id.group(1).strip() if target_id else None
            })
    compound['protein_targets'] = targets
    
    # Extract properties
    property_blocks = re.findall(r'<property>.*?</property>', xml_block, re.DOTALL)
    properties = {}
    for prop_block in property_blocks:
        kind = re.search(r'<kind>(.*?)</kind>', prop_block)
        value = re.search(r'<value>(.*?)</value>', prop_block)
        if kind and value:
            properties[kind.group(1).strip()] = value.group(1).strip()
    compound['properties'] = properties
    
    return compound

def main():
    """Main execution."""
    print("=" * 60)
    print("Robust Cannabis Compound Parser")
    print("=" * 60)
    
    xml_path = Path("data/raw/cannabis_compounds.xml")
    
    if not xml_path.exists():
        print(f"✗ File not found: {xml_path}")
        return
    
    # Extract compound blocks
    compound_blocks = extract_compound_blocks(xml_path)
    
    # Parse each block
    print("\nParsing compound blocks...")
    compounds = []
    for i, block in enumerate(compound_blocks):
        try:
            compound = parse_compound_block(block)
            compounds.append(compound)
            if (i + 1) % 100 == 0:
                print(f"Processed {i + 1}/{len(compound_blocks)} compounds...")
        except Exception as e:
            print(f"✗ Error parsing compound {i}: {e}")
            continue
    
    print(f"\n✓ Successfully parsed {len(compounds)} compounds")
    
    # Convert to DataFrame
    df = pd.DataFrame(compounds)
    
    # Convert lists/dicts to JSON strings for CSV compatibility
    df['therapeutic_indications'] = df['therapeutic_indications'].apply(json.dumps)
    df['protein_targets'] = df['protein_targets'].apply(json.dumps)
    df['properties'] = df['properties'].apply(json.dumps)
    
    # Save
    output_path = Path("data/processed/compounds_parsed.csv")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    
    print(f"✓ Saved to {output_path}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total compounds: {len(df)}")
    print(f"Compounds with names: {df['name'].notna().sum()}")
    print(f"Compounds with formulas: {df['formula'].notna().sum()}")
    print(f"Compounds with indications: {df['therapeutic_indications'].apply(lambda x: len(json.loads(x)) > 0).sum()}")
    print(f"Compounds with targets: {df['protein_targets'].apply(lambda x: len(json.loads(x)) > 0).sum()}")
    
    print("\nSample compounds:")
    print(df[['name', 'formula', 'molecular_weight']].head(10).to_string())

if __name__ == "__main__":
    main()

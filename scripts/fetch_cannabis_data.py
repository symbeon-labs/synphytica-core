"""
Cannabis Compound Database - Data Fetcher
==========================================

Downloads and processes data from cannabisdatabase.ca for SynPhytica validation.

Author: Symbeon Labs
"""

import requests
import xml.etree.ElementTree as ET
import pandas as pd
import json
from pathlib import Path
from typing import Dict, List
import time

# Create data directories
DATA_DIR = Path("data")
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

for dir_path in [DATA_DIR, RAW_DIR, PROCESSED_DIR]:
    dir_path.mkdir(exist_ok=True)

# Download URLs
URLS = {
    "compounds": "https://cannabisdatabase.ca/simple/download_compound_as_xml",
    "proteins": "https://cannabisdatabase.ca/simple/download_protein_as_xml",
    "structures": "https://cannabisdatabase.ca/simple/download_compound_as_sdf",
}

def download_file(url: str, output_path: Path):
    """Download file from URL with progress indication."""
    print(f"Downloading {url}...")
    try:
        response = requests.get(url, stream=True, timeout=60)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with open(output_path, 'wb') as f:
            if total_size == 0:
                f.write(response.content)
            else:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    downloaded += len(chunk)
                    progress = (downloaded / total_size) * 100
                    print(f"\rProgress: {progress:.1f}%", end='')
        
        print(f"\n✓ Saved to {output_path}")
        return True
    except Exception as e:
        print(f"\n✗ Error downloading: {e}")
        return False

def parse_compound_xml(xml_path: Path) -> pd.DataFrame:
    """Parse Cannabis Compound Database XML to DataFrame."""
    print(f"\nParsing {xml_path}...")
    
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        
        compounds = []
        
        for compound in root.findall('.//compound'):
            data = {
                'compound_id': compound.findtext('id'),
                'name': compound.findtext('name'),
                'description': compound.findtext('description'),
                'cas_number': compound.findtext('cas_number'),
                'formula': compound.findtext('chemical_formula'),
                'molecular_weight': compound.findtext('average_molecular_weight'),
                'smiles': compound.findtext('smiles'),
                'inchi': compound.findtext('inchi'),
            }
            
            # Extract therapeutic indications
            indications = []
            for indication in compound.findall('.//indication'):
                indications.append(indication.text)
            data['therapeutic_indications'] = json.dumps(indications)
            
            # Extract protein targets
            targets = []
            for target in compound.findall('.//target'):
                targets.append({
                    'name': target.findtext('name'),
                    'id': target.findtext('id')
                })
            data['protein_targets'] = json.dumps(targets)
            
            # Extract pharmacological properties
            properties = {}
            for prop in compound.findall('.//property'):
                prop_kind = prop.findtext('kind')
                prop_value = prop.findtext('value')
                if prop_kind and prop_value:
                    properties[prop_kind] = prop_value
            data['properties'] = json.dumps(properties)
            
            compounds.append(data)
        
        df = pd.DataFrame(compounds)
        print(f"✓ Parsed {len(df)} compounds")
        return df
        
    except Exception as e:
        print(f"✗ Error parsing XML: {e}")
        return pd.DataFrame()

def create_synphytica_format(df: pd.DataFrame) -> pd.DataFrame:
    """Convert parsed data to SynPhytica compound library format."""
    print("\nConverting to SynPhytica format...")
    
    synphytica_compounds = []
    
    for _, row in df.iterrows():
        compound = {
            'name': row['name'],
            'compound_id': row['compound_id'],
            'formula': row['formula'],
            'molecular_weight': row['molecular_weight'],
            'smiles': row['smiles'],
            
            # Therapeutic indications (will need manual mapping)
            'therapeutic_indications': row['therapeutic_indications'],
            
            # Adverse effects (placeholder - needs additional data source)
            'adverse_effects': json.dumps({}),
            
            # Pharmacokinetics (extract from properties if available)
            'pharmacokinetics': row['properties'],
            
            # Organoleptic (placeholder - needs additional data)
            'organoleptic': json.dumps({}),
            
            # Dosage (placeholder - needs literature review)
            'max_dose': 100.0,  # mg
            'min_dose': 0.1,    # mg
            
            # Legal status
            'legal_status': 'research',
        }
        
        synphytica_compounds.append(compound)
    
    result_df = pd.DataFrame(synphytica_compounds)
    print(f"✓ Converted {len(result_df)} compounds to SynPhytica format")
    return result_df

def main():
    """Main execution function."""
    print("=" * 60)
    print("Cannabis Compound Database - Data Acquisition")
    print("=" * 60)
    
    # Step 1: Download files
    print("\n[Step 1/3] Downloading data files...")
    for name, url in URLS.items():
        output_path = RAW_DIR / f"cannabis_{name}.{'xml' if name != 'structures' else 'sdf'}"
        if not output_path.exists():
            download_file(url, output_path)
        else:
            print(f"✓ {output_path} already exists, skipping download")
        time.sleep(1)  # Be respectful to the server
    
    # Step 2: Parse XML
    print("\n[Step 2/3] Parsing compound data...")
    compounds_xml = RAW_DIR / "cannabis_compounds.xml"
    if compounds_xml.exists():
        df_compounds = parse_compound_xml(compounds_xml)
        
        if not df_compounds.empty:
            # Save parsed data
            parsed_path = PROCESSED_DIR / "compounds_parsed.csv"
            df_compounds.to_csv(parsed_path, index=False)
            print(f"✓ Saved parsed data to {parsed_path}")
            
            # Step 3: Convert to SynPhytica format
            print("\n[Step 3/3] Creating SynPhytica-compatible dataset...")
            df_synphytica = create_synphytica_format(df_compounds)
            
            synphytica_path = PROCESSED_DIR / "synphytica_compound_library.csv"
            df_synphytica.to_csv(synphytica_path, index=False)
            print(f"✓ Saved SynPhytica library to {synphytica_path}")
            
            # Print summary statistics
            print("\n" + "=" * 60)
            print("SUMMARY")
            print("=" * 60)
            print(f"Total compounds: {len(df_synphytica)}")
            print(f"Unique formulas: {df_synphytica['formula'].nunique()}")
            print(f"Compounds with targets: {df_synphytica['protein_targets'].apply(lambda x: len(json.loads(x)) > 0).sum()}")
            print("\nSample compounds:")
            print(df_synphytica[['name', 'formula', 'molecular_weight']].head(10))
        else:
            print("✗ No compounds parsed from XML")
    else:
        print(f"✗ Compounds XML not found at {compounds_xml}")
    
    print("\n✓ Data acquisition complete!")
    print(f"Check {PROCESSED_DIR} for output files.")

if __name__ == "__main__":
    main()

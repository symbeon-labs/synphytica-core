# SynPhytica Data Acquisition Strategy

**Date**: November 29, 2025  
**Objective**: Acquire real-world phytochemical and pharmacological data for SynPhytica validation

---

## 🎯 Primary Data Sources Identified

### 1. **Cannabis Compound Database** (cannabisdatabase.ca)
**Status**: ✅ ACCESSIBLE

**Available Downloads:**
- **Compounds Data**: XML format (6,000+ compounds)
  - URL: https://cannabisdatabase.ca/simple/download_compound_as_xml
- **Chemical Structures**: SDF format
  - URL: https://cannabisdatabase.ca/simple/download_compound_as_sdf
- **Protein Targets**: XML format
  - URL: https://cannabisdatabase.ca/simple/download_protein_as_xml
- **Spectra**: mzML format
  - URL: https://cannabisdatabase.ca/simple/download_spectra

**Data Includes:**
- 115 cannabis cultivars with chemical concentrations
- Physiological/medicinal effects
- Human protein targets
- Pathway information

**Next Steps:**
1. Download XML compound data
2. Parse to extract:
   - Compound names and IDs
   - Cannabinoid/terpene profiles
   - Therapeutic indications
   - Adverse effects
   - Protein binding affinities

---

### 2. **Medical Cannabis Library (MCL)**
**Status**: 🔍 TO INVESTIGATE

**Features:**
- NLP-classified cannabinoid-condition relationships
- CSV downloadable
- Focus on therapeutic activity

**Access Method:**
- Search for specific conditions/cannabinoids
- Export results as CSV

**Next Steps:**
1. Access MCL website
2. Query for common indications (pain, anxiety, insomnia)
3. Download CSV datasets

---

### 3. **ChEMBL Database** (EMBL-EBI)
**Status**: ✅ ACCESSIBLE VIA API

**Cannabinoid Receptors:**
- CB1: CHEMBL218
- CB2: Available

**API Endpoint (Conceptual):**
```
https://www.ebi.ac.uk/chembl/api/data/activity?target_chembl_id=CHEMBL218&format=json
```

**Data Includes:**
- Binding affinity (Ki, IC50, EC50)
- Assay types
- Compound structures

**Next Steps:**
1. Query ChEMBL API for CB1/CB2 activities
2. Extract binding data for known cannabinoids/terpenes
3. Correlate with therapeutic effects

---

### 4. **PubChem** (NIH)
**Status**: ✅ ACCESSIBLE

**Approach:**
- Search for individual terpenes/cannabinoids
- Download bioactivity data
- Use FTP for bulk downloads

**Target Compounds:**
- Alpha-pinene
- Myrcene
- Beta-caryophyllene
- Limonene
- Terpinolene
- THC, CBD, CBG, CBN, etc.

---

## 📊 Data Processing Pipeline

### Phase 1: Download (Week 1)
```bash
# Cannabis Compound Database
wget https://cannabisdatabase.ca/simple/download_compound_as_xml -O data/raw/cannabis_compounds.xml
wget https://cannabisdatabase.ca/simple/download_protein_as_xml -O data/raw/cannabis_proteins.xml

# ChEMBL API
python scripts/fetch_chembl_data.py --target CHEMBL218 --output data/raw/cb1_activities.json
python scripts/fetch_chembl_data.py --target CHEMBL2 --output data/raw/cb2_activities.json
```

### Phase 2: Parse & Clean (Week 1-2)
```python
# Parse XML to structured format
python scripts/parse_cannabis_xml.py

# Output: data/processed/compounds.csv
# Columns: compound_id, name, class, concentration_range, cultivars, effects, targets
```

### Phase 3: Feature Engineering (Week 2)
```python
# Create SynPhytica-compatible format
python scripts/create_compound_library.py

# Output: data/synphytica/compound_library.csv
# Columns: name, therapeutic_indications (JSON), adverse_effects (JSON), 
#          pharmacokinetics (JSON), organoleptic (JSON), max_dose, min_dose
```

### Phase 4: Validation (Week 3)
```python
# Train model on real data
python examples/train_on_real_data.py

# Compare performance with synthetic data baseline
python scripts/benchmark_real_vs_synthetic.py
```

---

## 🎯 Success Metrics

1. **Data Coverage:**
   - ✅ 50+ cannabinoids with binding data
   - ✅ 100+ terpenes with profiles
   - ✅ 20+ therapeutic indications mapped
   - ✅ 15+ adverse effects cataloged

2. **Model Performance:**
   - Target: Hypervolume > 0.85 on real data
   - Target: 95%+ constraint satisfaction
   - Target: Correlation with clinical outcomes > 0.7

3. **Publication Readiness:**
   - Real-world case studies (3-5)
   - Comparison with expert formulations
   - Statistical significance tests

---

## 📅 Timeline

**Week 1 (Dec 2-8, 2025):**
- Download all available datasets
- Set up data processing pipeline
- Initial exploratory data analysis

**Week 2 (Dec 9-15, 2025):**
- Feature engineering
- Data quality assessment
- Integration with SynPhytica codebase

**Week 3 (Dec 16-22, 2025):**
- Model training on real data
- Validation and benchmarking
- Prepare results for publication

**Week 4 (Dec 23-29, 2025):**
- Write validation section for paper
- Create visualizations
- Submit to arXiv

---

## 💡 Additional Opportunities

### Partnerships for Clinical Data
- **Cannabis clinics** (patient outcomes)
- **Dispensaries** (product formulations + customer feedback)
- **Research institutions** (controlled trials)

### Crowdsourced Data
- **Leafly API** (strain profiles + user reviews)
- **Reddit r/trees** (anecdotal reports - with NLP)
- **Erowid** (experience reports)

---

## 🚨 Ethical & Legal Considerations

1. **Data Privacy**: Ensure no patient-identifiable information
2. **Licensing**: Verify all datasets are open-access or properly licensed
3. **Citations**: Properly attribute all data sources in publications
4. **Regulatory**: Avoid making medical claims without clinical validation

---

**Next Immediate Action**: Download Cannabis Compound Database XML files and begin parsing.

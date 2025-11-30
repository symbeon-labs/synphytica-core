# SynPhytica Compound Database Schema

**Version**: 1.0  
**Date**: November 29, 2025  
**Purpose**: Standardized format for phytochemical compound data contributions

---

## 📋 Overview

This schema defines the structure for contributing compound data to the SynPhytica knowledge base. By following this standard, researchers can contribute high-quality phytochemical data that the AI can use for formulation optimization.

---

## 🗂️ File Format

**Preferred Format**: CSV (UTF-8 encoded)  
**Alternative Formats**: JSON, Excel (.xlsx)

**Naming Convention**: `{plant_name}_compounds_{version}.csv`  
Example: `cannabis_compounds_v1.csv`, `turmeric_compounds_v1.csv`

---

## 📊 Required Fields

### 1. **Composto** (Compound Name)
- **Type**: String
- **Required**: Yes
- **Description**: Common or scientific name of the compound
- **Example**: "THC", "CBD", "Curcumin", "Limonene"

### 2. **Classe** (Chemical Class)
- **Type**: String
- **Required**: Yes
- **Description**: Chemical classification
- **Allowed Values**: 
  - "Cannabinoid"
  - "Terpene"
  - "Flavonoid"
  - "Alkaloid"
  - "Phenolic"
  - "Other" (specify in notes)
- **Example**: "Cannabinoid", "Terpene"

### 3. **Efeitos Conhecidos** (Known Effects)
- **Type**: Text (multi-line)
- **Required**: Yes
- **Description**: Documented physiological/psychological effects
- **Format**: Bullet points or comma-separated
- **Example**: "Analgesia, Relaxamento muscular, Redução de ansiedade"

### 4. **Potencial Terapêutico** (Therapeutic Potential)
- **Type**: Text
- **Required**: Yes
- **Description**: Potential medical applications with evidence level
- **Format**: Condition + Evidence level (Clinical/Preclinical/Anecdotal)
- **Example**: "Dor crônica (Clinical), Ansiedade (Preclinical), Insônia (Anecdotal)"

---

## 📊 Highly Recommended Fields

### 5. **Dosagem Recomendada** (Recommended Dosage)
- **Type**: String
- **Required**: Highly Recommended
- **Description**: Safe dosage range with units
- **Format**: "Min-Max unit (route)"
- **Example**: "5-20 mg (oral)", "0.1-0.5 ml (sublingual)"

### 6. **Efeitos Colaterais** (Side Effects)
- **Type**: Text
- **Required**: Highly Recommended
- **Description**: Known adverse effects with frequency
- **Format**: Effect (frequency/severity)
- **Example**: "Sonolência (comum), Boca seca (ocasional), Taquicardia (raro)"

### 7. **Interações Medicamentosas** (Drug Interactions)
- **Type**: Text
- **Required**: Highly Recommended
- **Description**: Known interactions with medications
- **Example**: "CYP3A4 inhibitor - pode aumentar níveis de benzodiazepínicos"

---

## 📊 Optional Fields (Enrich Dataset Quality)

### 8. **Forma de Administração** (Administration Route)
- **Type**: String
- **Options**: "Oral", "Sublingual", "Inalação", "Tópica", "Intravenosa"

### 9. **Método de Extração** (Extraction Method)
- **Type**: String
- **Example**: "CO2 supercrítico", "Etanol", "Butano", "Prensagem a frio"

### 10. **Fontes** (Sources)
- **Type**: Text (URLs or DOIs)
- **Description**: Scientific references
- **Format**: DOI, PubMed ID, or URL
- **Example**: "https://doi.org/10.1016/..., PMID:12345678"

### 11. **BD / LINKS / ARTIGOS** (Database Links)
- **Type**: Text (URLs)
- **Description**: Links to compound databases
- **Example**: "PubChem CID: 16078, ChEMBL: CHEMBL218"

### 12. **Cultivo** (Cultivation)
- **Type**: Text
- **Description**: Growing conditions, strains, or varieties
- **Example**: "Indica-dominant, Indoor, 18-22°C"

### 13. **Legalidade e Regulamentação** (Legal Status)
- **Type**: String
- **Example**: "Schedule I (USA), Legal (Canada), Controlada (Brasil)"

### 14. **PUREZA** (Purity)
- **Type**: String
- **Description**: Typical purity range in commercial products
- **Example**: "95-99% (isolado), 60-80% (extrato)"

### 15. **Métodos de Teste** (Testing Methods)
- **Type**: String
- **Description**: Analytical methods for quantification
- **Example**: "HPLC, GC-MS, LC-MS/MS"

### 16. **SUG.PESQ.CIENTIFIC** (Research Suggestions)
- **Type**: Text
- **Description**: Gaps in knowledge, suggested future research
- **Example**: "Estudar interação com sistema endocanabinoide em modelos de dor neuropática"

### 17. **METAFORIZAÇÃO** (Metaphorization/Conceptual Notes)
- **Type**: Text
- **Description**: Conceptual frameworks, traditional medicine perspectives
- **Example**: "Na MTC, considerado 'quente' e 'yang', usado para dispersar frio"

---

## 📝 Example Entry (CSV Format)

```csv
Composto,Classe,Efeitos Conhecidos,Potencial Terapêutico,Dosagem Recomendada,Efeitos Colaterais
CBD,Cannabinoid,"Ansiolítico, Anti-inflamatório, Neuroprotetor","Ansiedade (Clinical), Epilepsia (Clinical), Dor (Preclinical)","10-100 mg oral","Sonolência (comum), Diarreia (ocasional)"
Limonene,Terpene,"Elevação de humor, Energizante, Digestivo","Ansiedade (Preclinical), Refluxo (Anecdotal)","5-20 mg inalado","Irritação cutânea (raro)"
```

---

## 🤝 Contribution Guidelines

### How to Contribute

1. **Prepare Your Data**:
   - Use this schema as template
   - Fill at minimum the Required fields
   - Add as many Optional fields as possible

2. **Validate Your Data**:
   - Run validation script: `python scripts/validate_compound_data.py your_file.csv`
   - Fix any errors reported

3. **Submit**:
   - **Option A (GitHub)**: Fork repo, add to `data/community/`, submit Pull Request
   - **Option B (Email)**: Send to research@symbeonlabs.com
   - **Option C (Form)**: Fill web form at symbeonlabs.com/contribute

4. **Review Process**:
   - Symbeon Labs team reviews for quality
   - May request citations for therapeutic claims
   - Approved contributions credited in CONTRIBUTORS.md

---

## 🏆 Contribution Recognition

Contributors will be:
- ✅ Listed in CONTRIBUTORS.md
- ✅ Cited in academic publications using the data
- ✅ Granted early access to SynPhytica Pro features
- ✅ Invited to co-author papers (for substantial contributions)

---

## 🔬 Data Quality Standards

### Minimum Acceptance Criteria:
- [ ] At least 3 compounds per submission
- [ ] All Required fields completed
- [ ] At least 1 scientific reference per compound
- [ ] No plagiarized content

### Gold Standard (Preferred):
- [ ] 10+ compounds
- [ ] All Required + Highly Recommended fields
- [ ] Multiple peer-reviewed references
- [ ] Dosage data from clinical studies
- [ ] Interaction data from pharmacological databases

---

## 📚 Resources for Contributors

### Recommended Databases:
- **PubChem**: https://pubchem.ncbi.nlm.nih.gov/
- **ChEMBL**: https://www.ebi.ac.uk/chembl/
- **DrugBank**: https://go.drugbank.com/
- **PubMed**: https://pubmed.ncbi.nlm.nih.gov/

### Citation Tools:
- **DOI Lookup**: https://www.doi.org/
- **PubMed ID Converter**: https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/

---

## ⚖️ Legal & Ethical

### Data Licensing:
- By contributing, you agree to license your data under **CC BY 4.0**
- You retain copyright but grant SynPhytica perpetual use rights
- Data will be publicly accessible (except proprietary formulations)

### Ethical Guidelines:
- ✅ Only submit data you have rights to share
- ✅ Properly cite all sources
- ✅ Do not make unsubstantiated medical claims
- ✅ Disclose conflicts of interest

---

## 🚀 Future Enhancements

We plan to add support for:
- [ ] Synergy matrices (compound-compound interactions)
- [ ] Genetic/metabolomic data
- [ ] Patient outcome data (anonymized)
- [ ] Traditional medicine knowledge (TCM, Ayurveda)

---

**Questions?** Open an issue on GitHub or email research@symbeonlabs.com

**Thank you for advancing phytotherapeutic science!** 🌿🔬

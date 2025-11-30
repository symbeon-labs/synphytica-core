# SynPhytica Templates

This directory contains standardized templates for contributing data and documentation to the SynPhytica project.

## 📋 Available Templates

### 1. Compound Contribution (`compound_contribution.md`)
**Purpose**: Submit data about bioactive compounds for inclusion in the SynPhytica database.

**Who should use this**: Researchers, pharmacologists, herbalists with verified data about plant compounds.

**How to use**:
1. Copy `compound_contribution.md` to a new file named after your compound (e.g., `beta_caryophyllene_data.md`)
2. Fill in all sections with accurate data
3. Include proper citations
4. Submit via:
   - GitHub Pull Request to `data/contributions/`
   - Email to: data@symbeonlabs.com

### 2. Plant Species Profile (Coming Soon)
Template for submitting comprehensive data about entire plant species.

### 3. Experimental Protocol (Coming Soon)
Template for documenting experimental validation protocols.

---

## 🎯 DocSync Integration

This folder is managed by [DocSync](https://github.com/SH1W4/docsync), the SynPhytica documentation automation tool.

**Features**:
- Auto-validation of submitted templates
- Conversion to structured CSV/JSON for database ingestion
- Quality checking against schema definitions
- Automatic indexing

**For Contributors**:
Simply fill the templates. DocSync will handle:
- Format validation
- Schema compliance
- Metadata extraction
- Routing to appropriate review pipelines

---

## 📚 Template Guidelines

### Data Quality Standards
- **High**: Peer-reviewed publications, clinical trials
- **Medium**: Laboratory studies, animal models
- **Low**: Traditional knowledge, anecdotal evidence

All quality levels are valuable, but please self-assess accurately.

### Required vs. Optional Fields
- **Required** (marked with *): Must be filled for submission acceptance
- **Optional**: Encouraged but not mandatory

### Units of Measurement
Use SI units unless otherwise specified:
- Mass: mg, g
- Concentration: mg/mL, %
- Temperature: °C

---

## 🤝 Contributing New Templates

If you need a template type not listed here:

1. Open an issue describing your use case
2. Propose a draft structure
3. We'll work with you to create an official template

---

**Maintained by**: Symbeon Labs  
**Last Updated**: November 2025  
**Questions?**: templates@symbeonlabs.com

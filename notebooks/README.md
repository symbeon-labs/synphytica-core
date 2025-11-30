# SynPhytica Notebooks

This directory contains Jupyter notebooks for validating and demonstrating the SynPhytica framework.

## 📓 Available Notebooks

### `SynPhytica_Validation_Standalone.ipynb`
**Purpose**: Validation WITHOUT cloning the repository (works for private repos).

**How it works**:
1. You manually upload `synphytica_core.py` to Colab
2. It runs the same validation steps as the standard notebook
3. No GitHub credentials or public access required

### `SynPhytica_Validation.ipynb`
**Purpose**: Complete validation cloning from public GitHub.

**What it does**:
1. Installs all dependencies
2. Clones the repository
3. Creates a synthetic cannabis library (52 compounds)
4. Defines a patient profile
5. Runs multi-objective optimization
6. Generates visualizations (Pareto Front, Convergence)
7. Exports results to CSV

**Runtime**: ~10-15 minutes (with GPU)

---

## 🚀 How to Use

### Option 1: Google Colab (Recommended - Free GPU)

1. Go to [Google Colab](https://colab.research.google.com/)
2. Click `File` → `Upload notebook`
3. Upload `SynPhytica_Validation.ipynb`
4. Click `Runtime` → `Change runtime type` → Select `T4 GPU`
5. Run all cells (`Runtime` → `Run all`)

### Option 2: Local Jupyter

```bash
# Install Jupyter
pip install jupyter

# Navigate to project root
cd SynPhytica

# Launch Jupyter
jupyter notebook

# Open notebooks/SynPhytica_Validation.ipynb in the browser
```

---

## 📊 Expected Outputs

After running the validation notebook, you will get:

1. **Console Output**: Step-by-step validation logs
2. **Visualizations**:
   - `pareto_front_colab.png`: Pareto Frontier plot
   - `convergence_colab.png`: Optimization convergence
3. **Data Export**: `synphytica_results.csv` with optimized formulations

---

## 🔧 Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'synphytica_core'`  
**Solution**: Make sure the notebook cloned the repository successfully. Re-run the clone cell.

**Issue**: Slow execution  
**Solution**: Enable GPU in Colab (`Runtime` → `Change runtime type` → `T4 GPU`)

**Issue**: Out of memory  
**Solution**: Reduce `population_size` and `generations` in the optimization cell.

---

**Symbeon Labs** | November 2025

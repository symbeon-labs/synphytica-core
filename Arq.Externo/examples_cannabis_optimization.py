import sys
import os

# Ensure we can import the core from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from synphytica_core import (
    create_synthetic_cannabis_library, 
    generate_synthetic_users, 
    train_surrogate_model, 
    SynPhyticaOptimizer,
    print_results
)

def run_cannabis_case_study():
    print("🌿 Running SynPhytica: Cannabis Optimization Case Study\n")
    
    # 1. Initialize Library (Cannabis specific)
    print("[1/4] Initializing Compound Library...")
    library = create_synthetic_cannabis_library()
    print(f"      Loaded {len(library.compounds)} compounds (Cannabinoids + Terpenes)")
    
    # 2. Create a specific patient profile
    print("[2/4] Defining Patient Profile...")
    # Patient: Chronic Pain (High), Anxiety (Medium), Low sedation tolerance
    patient = generate_synthetic_users(n=1)[0] 
    print(f"      Patient ID: {patient.id}")
    print(f"      Goals: {patient.therapeutic_goals}")
    
    # 3. Train Model (Quick demo training)
    print("[3/4] Training Neural Surrogate...")
    model = train_surrogate_model(library, epochs=5) # Reduced epochs for demo
    
    # 4. Run Optimization
    print("[4/4] Optimizing Formulation...")
    optimizer = SynPhyticaOptimizer(population_size=50, n_generations=20)
    pareto_front = optimizer.optimize(library, patient, model)
    
    # 5. Display Results
    print("\n🏆 Optimization Complete! Top Recommended Formulations:")
    print_results(pareto_front[:3])

if __name__ == "__main__":
    run_cannabis_case_study()

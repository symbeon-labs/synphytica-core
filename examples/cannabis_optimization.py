"""
SynPhytica Example: Cannabis Medicinal Optimization
===================================================

This example demonstrates how to use SynPhytica to optimize a cannabis
formulation for a patient with chronic pain and anxiety.

Author: Symbeon Labs
"""

from synphytica_core import (
    CompoundLibrary,
    UserProfile,
    SynPhyticaTransformer,
    SynPhyticaOptimizer,
    train_surrogate_model,
    print_results
)
import torch

def main():
    print("\n" + "="*70)
    print("  SYNPHYTICA EXAMPLE: Cannabis Medicinal Optimization")
    print("="*70 + "\n")
    
    # Step 1: Load compound library
    print("Step 1: Loading cannabis compound library...")
    library = CompoundLibrary.create_synthetic_cannabis_library()
    print(f"✓ Loaded {library.size()} compounds\n")
    
    # Step 2: Define patient profile
    print("Step 2: Creating patient profile...")
    patient = UserProfile(
        therapeutic_goals={
            'pain_relief': 1.0,          # Primary goal
            'anxiety_reduction': 0.8,    # Secondary goal
            'sleep_improvement': 0.6,    # Tertiary goal
            'inflammation_reduction': 0.5
        },
        risk_sensitivities={
            'paranoia': 1.0,             # Very sensitive
            'anxiety_increase': 0.9,     # Very sensitive
            'memory_impairment': 0.7,    # Moderately sensitive
            'sedation': 0.3              # Low sensitivity (acceptable)
        },
        preferences={
            'flavor': 'citrus',
            'form': 'oil'
        },
        constraints={
            'allergies': []  # No allergies
        },
        demographic={
            'age': 52,
            'weight': 78
        }
    )
    print("✓ Patient profile created")
    print(f"  - Primary goal: Pain relief")
    print(f"  - Secondary goal: Anxiety reduction")
    print(f"  - Avoiding: Paranoia, anxiety increase\n")
    
    # Step 3: Train neural model
    print("Step 3: Training neural surrogate model...")
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = train_surrogate_model(
        library=library,
        n_samples=1000,
        epochs=15,
        batch_size=32,
        device=device
    )
    
    # Step 4: Run optimization
    print("Step 4: Running hybrid optimization (NSGA-II + PSO)...")
    optimizer = SynPhyticaOptimizer(
        library=library,
        model=model,
        user_profile=patient,
        population_size=80,
        n_generations=40,
        device=device
    )
    
    pareto_front = optimizer.optimize()
    
    # Step 5: Display results
    print("\nStep 5: Analyzing results...")
    print_results(pareto_front, library, top_n=5)
    
    # Step 6: Detailed analysis of top solution
    print("\n" + "="*70)
    print("  DETAILED ANALYSIS: Top Solution")
    print("="*70 + "\n")
    
    top_solution = pareto_front[0]
    
    print(f"Overall Fitness: {top_solution.fitness:.4f}\n")
    
    print("Efficacy Predictions:")
    for i, indication in enumerate(library.all_indications):
        if patient.therapeutic_goals.get(indication, 0) > 0:
            score = top_solution.efficacy_scores[i]
            uncertainty = top_solution.efficacy_variance[i]
            print(f"  - {indication}: {score:.2f} ± {uncertainty:.3f}")
    
    print("\nRisk Predictions:")
    for i, effect in enumerate(library.all_effects):
        if patient.risk_sensitivities.get(effect, 0) > 0.5:
            score = top_solution.risk_scores[i]
            uncertainty = top_solution.risk_variance[i]
            print(f"  - {effect}: {score:.2f} ± {uncertainty:.3f}")
    
    print("\nTop 10 Compounds by Concentration:")
    doses_norm = top_solution.doses / top_solution.doses.sum()
    top_indices = doses_norm.argsort()[-10:][::-1]
    
    for idx in top_indices:
        if doses_norm[idx] > 0.01:
            comp = library.compounds[idx]
            print(f"  - {comp.name}: {doses_norm[idx]*100:.2f}%")
    
    print("\n" + "="*70)
    print("  Optimization completed successfully!")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()

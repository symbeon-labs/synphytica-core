"""
Basic tests for SynPhytica core functionality.
"""

import pytest
import numpy as np
import torch
from synphytica_core import (
    Compound,
    CompoundLibrary,
    UserProfile,
    SynPhyticaTransformer,
    FitnessEvaluator
)


def test_compound_creation():
    """Test compound object creation."""
    comp = Compound(
        name="CBD",
        therapeutic_indications={'pain_relief': 0.8, 'anxiety_reduction': 0.9},
        adverse_effects={'dry_mouth': 0.2},
        max_dose=100.0,
        min_dose=1.0
    )
    
    assert comp.name == "CBD"
    assert comp.therapeutic_indications['pain_relief'] == 0.8
    assert comp.max_dose == 100.0


def test_compound_library():
    """Test compound library creation and operations."""
    library = CompoundLibrary.create_synthetic_cannabis_library()
    
    assert library.size() == 52
    assert len(library.all_indications) > 0
    assert len(library.all_effects) > 0
    
    matrix = library.get_compound_matrix()
    assert matrix.shape[0] == 52


def test_user_profile():
    """Test user profile creation."""
    user = UserProfile(
        therapeutic_goals={'pain_relief': 1.0},
        risk_sensitivities={'paranoia': 0.9},
        preferences={'flavor': 'citrus'},
        demographic={'age': 45, 'weight': 75}
    )
    
    assert user.therapeutic_goals['pain_relief'] == 1.0
    assert user.demographic['age'] == 45


def test_transformer_model():
    """Test transformer model initialization and forward pass."""
    model = SynPhyticaTransformer(
        compound_dim=50,
        user_dim=30,
        d_model=64,
        n_heads=4,
        n_layers=2,
        n_indications=10,
        n_effects=5
    )
    
    # Create dummy input
    batch_size = 2
    n_compounds = 10
    compound_features = torch.randn(batch_size, n_compounds, 50)
    user_features = torch.randn(batch_size, 30)
    
    # Forward pass
    efficacy, risk = model(compound_features, user_features)
    
    assert efficacy.shape == (batch_size, 10)
    assert risk.shape == (batch_size, 5)
    assert torch.all((efficacy >= 0) & (efficacy <= 1))
    assert torch.all((risk >= 0) & (risk <= 1))


def test_mc_dropout():
    """Test Monte Carlo Dropout uncertainty quantification."""
    model = SynPhyticaTransformer(
        compound_dim=50,
        user_dim=30,
        d_model=64,
        n_heads=4,
        n_layers=2,
        n_indications=10,
        n_effects=5
    )
    
    compound_features = torch.randn(1, 10, 50)
    user_features = torch.randn(1, 30)
    
    eff_mean, eff_var, risk_mean, risk_var = model.mc_dropout_predict(
        compound_features, user_features, n_samples=5
    )
    
    assert eff_mean.shape == (1, 10)
    assert eff_var.shape == (1, 10)
    assert np.all(eff_var >= 0)  # Variance must be non-negative


def test_fitness_evaluator():
    """Test fitness evaluation."""
    library = CompoundLibrary.create_synthetic_cannabis_library()
    
    model = SynPhyticaTransformer(
        compound_dim=library.feature_dim,
        user_dim=50,
        d_model=64,
        n_heads=4,
        n_layers=2,
        n_indications=len(library.all_indications),
        n_effects=len(library.all_effects)
    )
    
    user = UserProfile(
        therapeutic_goals={'pain_relief': 1.0},
        risk_sensitivities={'paranoia': 0.9},
        preferences={'flavor': 'citrus'},
        demographic={'age': 45, 'weight': 75}
    )
    
    evaluator = FitnessEvaluator(model, library)
    
    # Random formulation
    doses = np.random.rand(library.size()) * 10
    
    fitness, details = evaluator.evaluate(doses, user)
    
    assert isinstance(fitness, float)
    assert 'efficacy' in details
    assert 'risk' in details
    assert 'efficacy_scores' in details


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

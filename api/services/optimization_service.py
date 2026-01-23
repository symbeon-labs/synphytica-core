"""
SynPhytica API - Optimization Service
Business logic for formulation optimization
"""
import sys
import os
from pathlib import Path
import asyncio
from typing import List
import uuid

# Add parent directory to path to import synphytica_core
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from synphytica_core import (
    CompoundLibrary,
    UserProfile,
    SynPhyticaTransformer,
    SynPhyticaOptimizer,
    train_surrogate_model
)

from api.models import (
    OptimizationRequest,
    FormulationResponse,
    CompoundDose,
    CompoundInfo
)


class OptimizationService:
    """Service for handling optimization requests"""
    
    def __init__(self):
        """Initialize service with library and model"""
        print("🔧 Initializing Optimization Service...")
        
        # Load compound library
        self.library = CompoundLibrary.create_synthetic_cannabis_library()
        print(f"📚 Loaded {self.library.size()} compounds")
        
        # Train or load model
        self.model = self._initialize_model()
        print("🧠 Model ready")
        
        # Cache for compound info
        self._compounds_cache = None
    
    def _initialize_model(self) -> SynPhyticaTransformer:
        """Initialize or load the neural model"""
        # TODO: Load pre-trained model from disk if available
        # For now, train a lightweight model
        print("🏋️ Training surrogate model (this may take a minute)...")
        model = train_surrogate_model(
            self.library,
            n_samples=500,  # Reduced for faster startup
            epochs=10,      # Reduced for faster startup
            device='cpu'
        )
        return model
    
    async def optimize(self, request: OptimizationRequest) -> List[FormulationResponse]:
        """
        Run optimization algorithm
        
        Args:
            request: OptimizationRequest with user profile and parameters
            
        Returns:
            List of FormulationResponse objects (Pareto front)
        """
        # Convert API request to core UserProfile
        user_profile = self._request_to_user_profile(request)
        
        # Run optimization in thread pool (CPU-bound operation)
        loop = asyncio.get_event_loop()
        pareto_front = await loop.run_in_executor(
            None,
            self._run_optimization,
            user_profile,
            request.population_size,
            request.n_generations
        )
        
        # Convert results to API response
        formulations = self._pareto_to_responses(pareto_front)
        
        return formulations
    
    def _request_to_user_profile(self, request: OptimizationRequest) -> UserProfile:
        """Convert API request to UserProfile"""
        return UserProfile(
            therapeutic_goals=request.user_profile.therapeutic_goals,
            risk_sensitivities=request.user_profile.risk_sensitivities,
            budget_constraint=request.user_profile.budget_constraint,
            organoleptic_preferences=request.user_profile.organoleptic_preferences or {}
        )
    
    def _run_optimization(
        self,
        user_profile: UserProfile,
        population_size: int,
        n_generations: int
    ):
        """Run the optimization (blocking operation)"""
        optimizer = SynPhyticaOptimizer(
            library=self.library,
            model=self.model,
            user_profile=user_profile,
            population_size=population_size,
            n_generations=n_generations,
            device='cpu'
        )
        
        return optimizer.optimize()
    
    def _pareto_to_responses(self, pareto_front) -> List[FormulationResponse]:
        """Convert Pareto front to API responses"""
        formulations = []
        
        for result in pareto_front[:5]:  # Return top 5 formulations
            # Get top compounds (non-zero doses)
            compound_doses = []
            total_dose = result.doses.sum()
            
            for i, dose in enumerate(result.doses):
                if dose > 0.01:  # Threshold for relevance
                    compound_doses.append(CompoundDose(
                        name=self.library.compounds[i].name,
                        dose_mg=float(dose),
                        percentage=float((dose / total_dose) * 100) if total_dose > 0 else 0
                    ))
            
            # Sort by dose descending
            compound_doses.sort(key=lambda x: x.dose_mg, reverse=True)
            
            formulations.append(FormulationResponse(
                formulation_id=str(uuid.uuid4()),
                compounds=compound_doses,
                fitness=float(result.fitness),
                efficacy_score=float(result.efficacy_score),
                risk_score=float(result.risk_score),
                cost=float(result.cost),
                metadata=result.metadata
            ))
        
        return formulations
    
    def get_compounds_info(self) -> List[CompoundInfo]:
        """Get information about available compounds"""
        if self._compounds_cache is None:
            self._compounds_cache = [
                CompoundInfo(
                    name=compound.name,
                    therapeutic_indications=compound.therapeutic_indications,
                    adverse_effects=compound.adverse_effects,
                    cost_per_mg=compound.cost_per_mg
                )
                for compound in self.library.compounds
            ]
        
        return self._compounds_cache

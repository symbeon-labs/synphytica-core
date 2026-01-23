"""
SynPhytica REST API - Data Models
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional, Any
from enum import Enum


class TherapeuticGoal(str, Enum):
    """Available therapeutic indications"""
    CHRONIC_PAIN = "chronic_pain"
    ANXIETY = "anxiety"
    INSOMNIA = "insomnia"
    INFLAMMATION = "inflammation"
    NAUSEA = "nausea"
    APPETITE_LOSS = "appetite_loss"
    DEPRESSION = "depression"
    PTSD = "ptsd"


class AdverseEffect(str, Enum):
    """Possible adverse effects"""
    PSYCHOACTIVITY = "psychoactivity"
    SEDATION = "sedation"
    ANXIETY_INCREASE = "anxiety_increase"
    DRY_MOUTH = "dry_mouth"
    DIZZINESS = "dizziness"


class UserProfileRequest(BaseModel):
    """User profile for optimization"""
    therapeutic_goals: Dict[str, float] = Field(
        ...,
        description="Therapeutic goals with importance weights [0,1]",
        example={"chronic_pain": 0.9, "anxiety": 0.7}
    )
    risk_sensitivities: Dict[str, float] = Field(
        default_factory=dict,
        description="Adverse effect sensitivities [0,1]",
        example={"psychoactivity": 0.8}
    )
    budget_constraint: float = Field(
        default=150.0,
        ge=0,
        description="Maximum budget in USD"
    )
    organoleptic_preferences: Optional[Dict[str, float]] = Field(
        default=None,
        description="Taste/aroma preferences"
    )
    
    @validator('therapeutic_goals')
    def validate_goals(cls, v):
        if not v:
            raise ValueError("At least one therapeutic goal required")
        for key, value in v.items():
            if not 0 <= value <= 1:
                raise ValueError(f"Goal weight must be [0,1], got {value}")
        return v


class OptimizationRequest(BaseModel):
    """Request for formulation optimization"""
    user_profile: UserProfileRequest
    population_size: int = Field(
        default=100,
        ge=10,
        le=500,
        description="Genetic algorithm population size"
    )
    n_generations: int = Field(
        default=50,
        ge=10,
        le=200,
        description="Number of evolution generations"
    )


class CompoundDose(BaseModel):
    """Single compound with dosage"""
    name: str
    dose_mg: float = Field(ge=0)
    percentage: float = Field(ge=0, le=100)


class FormulationResponse(BaseModel):
    """Optimized formulation result"""
    formulation_id: str
    compounds: List[CompoundDose]
    fitness: float
    efficacy_score: float
    risk_score: float
    cost: float
    metadata: Dict[str, Any] = Field(default_factory=dict)


class OptimizationResponse(BaseModel):
    """Response with multiple formulations (Pareto front)"""
    model_config = {"protected_namespaces": ()}
    
    formulations: List[FormulationResponse]
    computation_time_seconds: float
    model_version: str = "0.2.0"


class CompoundInfo(BaseModel):
    """Compound library information"""
    name: str
    therapeutic_indications: Dict[str, float]
    adverse_effects: Dict[str, float]
    cost_per_mg: float


class CompoundsResponse(BaseModel):
    """List of available compounds"""
    compounds: List[CompoundInfo]
    total_count: int


class HealthResponse(BaseModel):
    """API health status"""
    model_config = {"protected_namespaces": ()}
    
    status: str
    version: str
    model_loaded: bool
    library_size: int


class ErrorResponse(BaseModel):
    """Error response"""
    detail: str
    error_type: str

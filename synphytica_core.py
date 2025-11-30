"""
SynPhytica Core Framework
=========================

Core implementation of the SynPhytica framework for multi-objective optimization
of phytotherapeutic formulations using Transformers and Evolutionary Algorithms.

Author: Symbeon Labs
Institution: Symbeon Labs
License: Apache 2.0
Copyright: © 2025 Symbeon Labs

Mathematical Foundation:
-----------------------
This framework implements a multi-objective optimization approach for designing
personalized phytotherapeutic formulations. The core fitness function is:

    F(x,u) = αE(x,u) - βR(x,u) + γM(x,u) - δP(x) - εU(x,u)

Where:
    - E(x,u): Weighted therapeutic efficacy
    - R(x,u): Weighted risk scores
    - M(x,u): Preference matching
    - P(x): Constraint penalties
    - U(x,u): Epistemic uncertainty penalty

The optimization uses a hybrid approach combining:
    - NSGA-II (Non-dominated Sorting Genetic Algorithm II)
    - PSO (Particle Swarm Optimization)
    - Transformer-based neural surrogate model with dual attention
"""
from tqdm import tqdm
import matplotlib.pyplot as plt
import seaborn as sns

warnings.filterwarnings('ignore')

# Set random seeds for reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
torch.manual_seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

# ============================================================================
# SECTION 1: DATA STRUCTURES AND COMPOUND LIBRARY
# ============================================================================

@dataclass
class Compound:
    """
    Represents a bioactive compound with pharmacological attributes.
    
    Attributes:
        name: Compound identifier
        therapeutic_indications: Dict mapping indication names to efficacy scores [0,1]
        adverse_effects: Dict mapping side effects to risk scores [0,1]
        pharmacokinetics: Dict with ADME properties
        organoleptic: Dict with taste, smell, color attributes
        legal_status: Regulatory classification
        max_dose: Maximum safe dose (mg)
        min_dose: Minimum effective dose (mg)
        cost_per_mg: Economic factor
    """
    name: str
    therapeutic_indications: Dict[str, float] = field(default_factory=dict)
    adverse_effects: Dict[str, float] = field(default_factory=dict)
    pharmacokinetics: Dict[str, float] = field(default_factory=dict)
    organoleptic: Dict[str, float] = field(default_factory=dict)
    legal_status: str = "approved"
    max_dose: float = 100.0
    min_dose: float = 0.1
    cost_per_mg: float = 0.01
    
    def to_vector(self, indication_list: List[str], effect_list: List[str]) -> np.ndarray:
        """
        Convert compound to fixed-size feature vector.
        
        Args:
            indication_list: Ordered list of all possible indications
            effect_list: Ordered list of all possible adverse effects
            
        Returns:
            Feature vector representation
        """
        # Therapeutic efficacy vector
        efficacy = np.array([self.therapeutic_indications.get(ind, 0.0) 
                            for ind in indication_list])
        
        # Risk vector
        risks = np.array([self.adverse_effects.get(eff, 0.0) 
                         for eff in effect_list])
        
        # Pharmacokinetic features
        pk_features = np.array([
            self.pharmacokinetics.get('bioavailability', 0.5),
            self.pharmacokinetics.get('half_life', 0.5),
            self.pharmacokinetics.get('protein_binding', 0.5),
            self.pharmacokinetics.get('metabolism_rate', 0.5)
        ])
        
        # Organoleptic features
        org_features = np.array([
            self.organoleptic.get('sweetness', 0.0),
            self.organoleptic.get('bitterness', 0.0),
            self.organoleptic.get('aroma_intensity', 0.0)
        ])
        
        # Concatenate all features
        return np.concatenate([efficacy, risks, pk_features, org_features])


@dataclass
class UserProfile:
    """
    Patient/user preferences and constraints.
    
    Attributes:
        therapeutic_goals: Dict mapping indications to importance weights [0,1]
        risk_sensitivities: Dict mapping adverse effects to sensitivity [0,1]
        preferences: Dict with organoleptic and delivery preferences
        constraints: Dict with hard constraints (allergies, interactions, etc.)
        demographic: Age, weight, gender, etc.
    """
    therapeutic_goals: Dict[str, float] = field(default_factory=dict)
    risk_sensitivities: Dict[str, float] = field(default_factory=dict)
    preferences: Dict[str, Union[str, float]] = field(default_factory=dict)
    constraints: Dict[str, List[str]] = field(default_factory=dict)
    demographic: Dict[str, Union[str, float]] = field(default_factory=dict)
    
    def to_vector(self, indication_list: List[str], effect_list: List[str]) -> np.ndarray:
        """Convert user profile to fixed-size feature vector."""
        # Goal weights
        goals = np.array([self.therapeutic_goals.get(ind, 0.0) 
                         for ind in indication_list])
        
        # Risk sensitivities
        sensitivities = np.array([self.risk_sensitivities.get(eff, 0.5) 
                                 for eff in effect_list])
        
        # Demographic features (normalized)
        age = self.demographic.get('age', 40) / 100.0
        weight = self.demographic.get('weight', 70) / 150.0
        
        # Preference features
        pref_features = np.array([
            1.0 if self.preferences.get('flavor') == 'sweet' else 0.0,
            1.0 if self.preferences.get('flavor') == 'bitter' else 0.0,
            1.0 if self.preferences.get('form') == 'oil' else 0.0,
            1.0 if self.preferences.get('form') == 'capsule' else 0.0,
        ])
        
        return np.concatenate([goals, sensitivities, [age, weight], pref_features])


class CompoundLibrary:
    """
    Manages a collection of bioactive compounds.
    """
    
    def __init__(self, compounds: List[Compound] = None):
        self.compounds = compounds or []
        self._build_indices()
    
    def _build_indices(self):
        """Build internal indices for fast lookup."""
        # Extract all unique indications and effects
        self.all_indications = sorted(list(set(
            ind for comp in self.compounds 
            for ind in comp.therapeutic_indications.keys()
        )))
        
        self.all_effects = sorted(list(set(
            eff for comp in self.compounds 
            for eff in comp.adverse_effects.keys()
        )))
        
        # Feature dimension
        self.feature_dim = (len(self.all_indications) + 
                           len(self.all_effects) + 
                           4 +  # pharmacokinetics
                           3)   # organoleptic
    
    def add_compound(self, compound: Compound):
        """Add a compound to the library."""
        self.compounds.append(compound)
        self._build_indices()
    
    def get_compound_matrix(self) -> np.ndarray:
        """
        Get matrix representation of all compounds.
        
        Returns:
            Matrix of shape (n_compounds, feature_dim)
        """
        return np.array([comp.to_vector(self.all_indications, self.all_effects) 
                        for comp in self.compounds])
    
    def size(self) -> int:
        """Return number of compounds in library."""
        return len(self.compounds)
    
    @classmethod
    def from_csv(cls, filepath: str) -> 'CompoundLibrary':
        """
        Load compound library from CSV file.
        
        CSV format:
            name, indication_1, indication_2, ..., effect_1, effect_2, ...
        """
        # Placeholder implementation
        # In production, parse CSV and create Compound objects
        raise NotImplementedError("CSV loading to be implemented")
    
    @classmethod
    def create_synthetic_cannabis_library(cls) -> 'CompoundLibrary':
        """
        Create a synthetic library of cannabis compounds for testing.
        
        Returns:
            CompoundLibrary with 52 compounds (9 cannabinoids + 43 terpenes)
        """
        compounds = []
        
        # Define common indications
        indications = [
            'pain_relief', 'anxiety_reduction', 'sleep_improvement',
            'inflammation_reduction', 'nausea_relief', 'appetite_stimulation',
            'muscle_relaxation', 'neuroprotection', 'mood_enhancement',
            'focus_enhancement', 'creativity_boost', 'energy_boost',
            'stress_relief', 'depression_relief', 'ptsd_relief',
            'seizure_reduction', 'glaucoma_relief', 'cancer_symptom_relief'
        ]
        
        # Define common adverse effects
        effects = [
            'dry_mouth', 'red_eyes', 'dizziness', 'paranoia',
            'anxiety_increase', 'memory_impairment', 'coordination_loss',
            'tachycardia', 'hypotension', 'sedation', 'euphoria', 'confusion'
        ]
        
        # Cannabinoids
        cannabinoids = [
            ('THC', {'pain_relief': 0.8, 'anxiety_reduction': 0.3, 'appetite_stimulation': 0.9},
                    {'paranoia': 0.4, 'anxiety_increase': 0.3, 'memory_impairment': 0.5}),
            ('CBD', {'anxiety_reduction': 0.9, 'inflammation_reduction': 0.8, 'seizure_reduction': 0.9},
                    {'dry_mouth': 0.2, 'sedation': 0.3}),
            ('CBG', {'inflammation_reduction': 0.7, 'neuroprotection': 0.6, 'glaucoma_relief': 0.7},
                    {'dry_mouth': 0.2}),
            ('CBN', {'sleep_improvement': 0.8, 'sedation': 0.7, 'pain_relief': 0.5},
                    {'sedation': 0.6, 'dizziness': 0.3}),
            ('CBC', {'inflammation_reduction': 0.6, 'pain_relief': 0.5, 'depression_relief': 0.6},
                    {}),
            ('THCV', {'appetite_suppression': 0.7, 'energy_boost': 0.6, 'focus_enhancement': 0.5},
                    {'anxiety_increase': 0.2}),
            ('CBDV', {'seizure_reduction': 0.7, 'nausea_relief': 0.6},
                    {}),
            ('THCA', {'inflammation_reduction': 0.7, 'neuroprotection': 0.6},
                    {}),
            ('CBDA', {'nausea_relief': 0.7, 'inflammation_reduction': 0.6},
                    {})
        ]
        
        for name, indic, adv in cannabinoids:
            compounds.append(Compound(
                name=name,
                therapeutic_indications=indic,
                adverse_effects=adv,
                pharmacokinetics={
                    'bioavailability': np.random.uniform(0.3, 0.9),
                    'half_life': np.random.uniform(0.2, 0.8),
                    'protein_binding': np.random.uniform(0.5, 0.95),
                    'metabolism_rate': np.random.uniform(0.3, 0.7)
                },
                organoleptic={
                    'sweetness': np.random.uniform(0, 0.3),
                    'bitterness': np.random.uniform(0.2, 0.8),
                    'aroma_intensity': np.random.uniform(0.4, 0.9)
                },
                max_dose=100.0,
                min_dose=0.5
            ))
        
        # Terpenes (43 common cannabis terpenes)
        terpenes = [
            'Myrcene', 'Limonene', 'Caryophyllene', 'Pinene', 'Linalool',
            'Humulene', 'Ocimene', 'Terpinolene', 'Bisabolol', 'Borneol',
            'Camphene', 'Carene', 'Cedrene', 'Eucalyptol', 'Farnesene',
            'Geraniol', 'Guaiol', 'Isopulegol', 'Nerolidol', 'Phytol',
            'Pulegone', 'Sabinene', 'Terpineol', 'Valencene', 'Cymene',
            'Fenchol', 'Menthol', 'Camphor', 'Citronellol', 'Nerol',
            'Phellandrene', 'Bergamotene', 'Elemene', 'Fenchone', 'Isoborneol',
            'Longifolene', 'Myrtenol', 'Perillyl', 'Sabinene_Hydrate', 'Selinene',
            'Terpinene', 'Thujone', 'Verbenone'
        ]
        
        for terp_name in terpenes:
            # Random therapeutic profile
            indic = {ind: np.random.uniform(0.1, 0.7) 
                    for ind in np.random.choice(indications, size=np.random.randint(2, 6), replace=False)}
            
            # Minimal adverse effects for terpenes
            adv = {eff: np.random.uniform(0.0, 0.2) 
                  for eff in np.random.choice(effects, size=np.random.randint(0, 2), replace=False)}
            
            compounds.append(Compound(
                name=terp_name,
                therapeutic_indications=indic,
                adverse_effects=adv,
                pharmacokinetics={
                    'bioavailability': np.random.uniform(0.4, 0.8),
                    'half_life': np.random.uniform(0.1, 0.5),
                    'protein_binding': np.random.uniform(0.3, 0.7),
                    'metabolism_rate': np.random.uniform(0.5, 0.9)
                },
                organoleptic={
                    'sweetness': np.random.uniform(0, 0.6),
                    'bitterness': np.random.uniform(0, 0.4),
                    'aroma_intensity': np.random.uniform(0.6, 1.0)
                },
                max_dose=10.0,
                min_dose=0.1
            ))
        
        return cls(compounds)


@dataclass
class FormulationResult:
    """
    Represents an optimized formulation with metadata.
    
    Attributes:
        doses: Array of compound doses (same order as library)
        fitness: Overall fitness score
        efficacy_scores: Per-indication efficacy predictions
        risk_scores: Per-effect risk predictions
        efficacy_variance: Uncertainty in efficacy predictions
        risk_variance: Uncertainty in risk predictions
        constraint_violations: List of violated constraints
        explanation: Human-readable explanation
    """
    doses: np.ndarray
    fitness: float
    efficacy_scores: np.ndarray
    risk_scores: np.ndarray
    efficacy_variance: np.ndarray
    risk_variance: np.ndarray
    constraint_violations: List[str] = field(default_factory=list)
    explanation: str = ""
    
    def summary(self, library: CompoundLibrary, top_n: int = 10) -> str:
        """
        Generate human-readable summary of formulation.
        
        Args:
            library: CompoundLibrary to get compound names
            top_n: Number of top compounds to show
            
        Returns:
            Formatted string summary
        """
        # Get top compounds by dose
        top_indices = np.argsort(self.doses)[-top_n:][::-1]
        
        lines = []
        lines.append(f"Fitness: {self.fitness:.4f}")
        lines.append(f"Efficacy: {self.efficacy_scores.mean():.2f} | Risk: {self.risk_scores.mean():.2f}")
        lines.append("Compounds:")
        
        for idx in top_indices:
            if self.doses[idx] > 0.01:  # Only show significant doses
                comp_name = library.compounds[idx].name
                dose_pct = (self.doses[idx] / self.doses.sum()) * 100
                lines.append(f"  - {comp_name}: {dose_pct:.1f}%")
        
        if self.constraint_violations:
            lines.append(f"Violations: {', '.join(self.constraint_violations)}")
        
        if self.explanation:
            lines.append(f"Explanation: {self.explanation}")
        
        return "\n".join(lines)


# ============================================================================
# SECTION 2: NEURAL SURROGATE MODEL (TRANSFORMER)
# ============================================================================

class MultiHeadAttention(nn.Module):
    """
    Multi-head attention mechanism.
    """
    
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0, "d_model must be divisible by n_heads"
        
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear projections in batch
        Q = self.W_q(query).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        
        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / np.sqrt(self.d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        
        context = torch.matmul(attn_weights, V)
        
        # Concatenate heads
        context = context.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        
        # Final linear projection
        output = self.W_o(context)
        
        return output, attn_weights


class TransformerBlock(nn.Module):
    """
    Single transformer block with self-attention and feed-forward.
    """
    
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        
        self.attention = MultiHeadAttention(d_model, n_heads, dropout)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        
    def forward(self, x, mask=None):
        # Self-attention with residual
        attn_output, _ = self.attention(x, x, x, mask)
        x = self.norm1(x + attn_output)
        
        # Feed-forward with residual
        ff_output = self.feed_forward(x)
        x = self.norm2(x + ff_output)
        
        return x


class SynPhyticaTransformer(nn.Module):
    """
    Transformer-based neural surrogate model for formulation prediction.
    
    Architecture:
        1. Compound embedding layer
        2. Self-attention layers (learn compound synergies)
        3. Cross-attention with user profile (personalization)
        4. Dual output heads (efficacy + risk)
        5. MC Dropout for uncertainty quantification
    """
    
    def __init__(
        self,
        compound_dim: int,
        user_dim: int,
        d_model: int = 128,
        n_heads: int = 8,
        n_layers: int = 4,
        d_ff: int = 512,
        dropout: float = 0.1,
        n_indications: int = 18,
        n_effects: int = 12
    ):
        super().__init__()
        
        self.compound_dim = compound_dim
        self.user_dim = user_dim
        self.d_model = d_model
        
        # Input projections
        self.compound_embedding = nn.Linear(compound_dim, d_model)
        self.user_embedding = nn.Linear(user_dim, d_model)
        
        # Positional encoding (learnable)
        self.pos_encoding = nn.Parameter(torch.randn(1, 100, d_model))
        
        # Self-attention layers (compound synergies)
        self.self_attention_layers = nn.ModuleList([
            TransformerBlock(d_model, n_heads, d_ff, dropout)
            for _ in range(n_layers)
        ])
        
        # Cross-attention layer (user personalization)
        self.cross_attention = MultiHeadAttention(d_model, n_heads, dropout)
        self.cross_norm = nn.LayerNorm(d_model)
        
        # Output heads
        self.efficacy_head = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, n_indications),
            nn.Sigmoid()
        )
        
        self.risk_head = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, n_effects),
            nn.Sigmoid()
        )
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, compound_features, user_features, apply_dropout=False):
        """
        Forward pass.
        
        Args:
            compound_features: (batch, n_compounds, compound_dim)
            user_features: (batch, user_dim)
            apply_dropout: Whether to apply dropout (for MC sampling)
            
        Returns:
            efficacy_pred: (batch, n_indications)
            risk_pred: (batch, n_effects)
        """
        batch_size, n_compounds, _ = compound_features.shape
        
        # Embed compounds
        x = self.compound_embedding(compound_features)  # (batch, n_compounds, d_model)
        
        # Add positional encoding
        x = x + self.pos_encoding[:, :n_compounds, :]
        
        # Self-attention (learn synergies)
        for layer in self.self_attention_layers:
            x = layer(x)
        
        # Embed user profile
        user_emb = self.user_embedding(user_features).unsqueeze(1)  # (batch, 1, d_model)
        
        # Cross-attention (personalization)
        cross_output, _ = self.cross_attention(user_emb, x, x)
        x_personalized = self.cross_norm(user_emb + cross_output)
        
        # Pool across compounds
        x_pooled = x.mean(dim=1)  # (batch, d_model)
        
        # Combine personalized and pooled
        x_combined = x_pooled + x_personalized.squeeze(1)
        
        # Apply dropout if requested (for MC sampling)
        if apply_dropout:
            x_combined = self.dropout(x_combined)
        
        # Dual outputs
        efficacy_pred = self.efficacy_head(x_combined)
        risk_pred = self.risk_head(x_combined)
        
        return efficacy_pred, risk_pred
    
    def mc_dropout_predict(self, compound_features, user_features, n_samples=20):
        """
        Monte Carlo Dropout for uncertainty quantification.
        
        Args:
            compound_features: (batch, n_compounds, compound_dim)
            user_features: (batch, user_dim)
            n_samples: Number of MC samples
            
        Returns:
            efficacy_mean, efficacy_var, risk_mean, risk_var
        """
        self.train()  # Enable dropout
        
        efficacy_samples = []
        risk_samples = []
        
        with torch.no_grad():
            for _ in range(n_samples):
                eff, risk = self.forward(compound_features, user_features, apply_dropout=True)
                efficacy_samples.append(eff.cpu().numpy())
                risk_samples.append(risk.cpu().numpy())
        
class FitnessEvaluator:
    """
    Multi-objective fitness function for formulation evaluation.
    
    F(x,u) = αE(x,u) - βR(x,u) + γM(x,u) - δP(x) - εU(x,u)
    """
    
    def __init__(
        self,
        model: SynPhyticaTransformer,
        library: CompoundLibrary,
        alpha: float = 0.6,
        beta: float = 0.3,
        gamma: float = 0.5,
        delta: float = 0.2,
        epsilon: float = 0.1,
        device: str = 'cpu'
    ):
        self.model = model
        self.library = library
        self.alpha = alpha
        self.beta = beta
        self.gamma = gamma
        self.delta = delta
        self.epsilon = epsilon
        self.device = device
        
        # Precompute compound matrix
        self.compound_matrix = library.get_compound_matrix()
        
    def evaluate(self, doses: np.ndarray, user: UserProfile) -> Tuple[float, Dict]:
        """
        Evaluate fitness of a formulation.
        
        Args:
            doses: Array of compound doses (length = n_compounds)
            user: UserProfile object
            
        Returns:
            fitness: Overall fitness score
            details: Dict with component scores
        """
        # Normalize doses
        doses_norm = doses / (doses.sum() + 1e-8)
        
        # Weight compound features by doses
        weighted_compounds = self.compound_matrix * doses_norm[:, np.newaxis]
        
        # Prepare tensors
        compound_features = torch.FloatTensor(weighted_compounds).unsqueeze(0).to(self.device)
        user_features = torch.FloatTensor(
            user.to_vector(self.library.all_indications, self.library.all_effects)
        ).unsqueeze(0).to(self.device)
        
        # Get predictions with uncertainty
        eff_mean, eff_var, risk_mean, risk_var = self.model.mc_dropout_predict(
            compound_features, user_features, n_samples=10
        )
        
        eff_mean = eff_mean[0]  # (n_indications,)
        eff_var = eff_var[0]
        risk_mean = risk_mean[0]  # (n_effects,)
        risk_var = risk_var[0]
        
        # E(x,u): Weighted efficacy
        goal_weights = np.array([user.therapeutic_goals.get(ind, 0.0) 
                                for ind in self.library.all_indications])
        E = np.dot(goal_weights, eff_mean)
        
        # R(x,u): Weighted risk
        risk_weights = np.array([user.risk_sensitivities.get(eff, 0.5) 
                                for eff in self.library.all_effects])
        R = np.dot(risk_weights, risk_mean)
        
        # M(x,u): Preference matching (organoleptic similarity)
        M = self._preference_match(doses_norm, user)
        
        # P(x): Constraint penalties
        P = self._constraint_penalty(doses, user)
        
        # U(x,u): Uncertainty penalty
        U = np.dot(goal_weights, eff_var)
        
        # Total fitness
        fitness = (self.alpha * E - 
                  self.beta * R + 
                  self.gamma * M - 
                  self.delta * P - 
                  self.epsilon * U)
        
        details = {
            'efficacy': E,
            'risk': R,
            'preference_match': M,
            'penalty': P,
            'uncertainty': U,
            'efficacy_scores': eff_mean,
            'risk_scores': risk_mean,
            'efficacy_var': eff_var,
            'risk_var': risk_var
        }
        
        return fitness, details
    
    def _preference_match(self, doses_norm: np.ndarray, user: UserProfile) -> float:
        """
        Calculate organoleptic preference matching score.
        """
        # Aggregate organoleptic profile
        sweetness = sum(doses_norm[i] * self.library.compounds[i].organoleptic.get('sweetness', 0)
                       for i in range(len(doses_norm)))
        bitterness = sum(doses_norm[i] * self.library.compounds[i].organoleptic.get('bitterness', 0)
                        for i in range(len(doses_norm)))
        
        # User preference
        pref_sweet = 1.0 if user.preferences.get('flavor') == 'sweet' else 0.0
        pref_bitter = 1.0 if user.preferences.get('flavor') == 'bitter' else 0.0
        
        # Cosine similarity (simplified)
        match = (sweetness * pref_sweet + bitterness * pref_bitter) / (sweetness + bitterness + 1e-8)
        
        return match
    
    def _constraint_penalty(self, doses: np.ndarray, user: UserProfile) -> float:
        """
        Calculate penalty for constraint violations.
        """
        penalty = 0.0
        
        # Dose constraints
        for i, dose in enumerate(doses):
            comp = self.library.compounds[i]
            if dose > comp.max_dose:
                penalty += (dose - comp.max_dose) / comp.max_dose
            if dose < comp.min_dose and dose > 0:
                penalty += (comp.min_dose - dose) / comp.min_dose
        
        # Total dose constraint
        total_dose = doses.sum()
        if total_dose > 200.0:  # Example max total dose
            penalty += (total_dose - 200.0) / 200.0
        
        # Allergy constraints
        if 'allergies' in user.constraints:
            for i, comp in enumerate(self.library.compounds):
                if comp.name in user.constraints['allergies'] and doses[i] > 0:
                    penalty += 10.0  # Heavy penalty
        
        return penalty


# ============================================================================
# SECTION 4: HYBRID OPTIMIZER (NSGA-II + PSO)
# ============================================================================

class SynPhyticaOptimizer:
    """
    Hybrid multi-objective optimizer combining NSGA-II and PSO.
    """
    
    def __init__(
        self,
        library: CompoundLibrary,
        model: SynPhyticaTransformer,
        user_profile: UserProfile,
        population_size: int = 100,
        n_generations: int = 50,
        crossover_prob: float = 0.8,
        mutation_prob: float = 0.1,
        pso_iterations: int = 10,
        device: str = 'cpu'
    ):
        self.library = library
        self.model = model
        self.user = user_profile
        self.pop_size = population_size
        self.n_gen = n_generations
        self.crossover_prob = crossover_prob
        self.mutation_prob = mutation_prob
        self.pso_iterations = pso_iterations
        self.device = device
        
        self.fitness_eval = FitnessEvaluator(model, library, device=device)
        self.n_compounds = library.size()
        
        self.population = None
        self.pareto_front = []
        
    def initialize_population(self) -> np.ndarray:
        """
        Initialize population with random + seeded individuals.
        """
        population = []
        
        # Random individuals
        for _ in range(self.pop_size - 10):
            # Random doses with sparsity
            doses = np.random.exponential(scale=2.0, size=self.n_compounds)
            doses = np.clip(doses, 0, 50)
            population.append(doses)
        
        # Seeded individuals (single-compound formulations)
        for i in range(min(10, self.n_compounds)):
            doses = np.zeros(self.n_compounds)
            doses[i] = 10.0
            population.append(doses)
        
        return np.array(population)
    
    def evaluate_population(self, population: np.ndarray) -> Tuple[np.ndarray, List[Dict]]:
        """
        Evaluate fitness for entire population.
        """
        fitnesses = []
        details_list = []
        
        for individual in population:
            fitness, details = self.fitness_eval.evaluate(individual, self.user)
            fitnesses.append(fitness)
            details_list.append(details)
        
        return np.array(fitnesses), details_list
    
    def tournament_selection(self, population: np.ndarray, fitnesses: np.ndarray, k: int = 3) -> np.ndarray:
        """
        Tournament selection.
        """
        selected = []
        for _ in range(len(population)):
            tournament_idx = np.random.choice(len(population), k, replace=False)
            winner_idx = tournament_idx[np.argmax(fitnesses[tournament_idx])]
            selected.append(population[winner_idx].copy())
        return np.array(selected)
    
    def blend_crossover(self, parent1: np.ndarray, parent2: np.ndarray, alpha: float = 0.5) -> Tuple[np.ndarray, np.ndarray]:
        """
        Blend crossover (BLX-α).
        """
        child1 = alpha * parent1 + (1 - alpha) * parent2
        child2 = (1 - alpha) * parent1 + alpha * parent2
        return child1, child2
    
    def gaussian_mutation(self, individual: np.ndarray, sigma: float = 0.1) -> np.ndarray:
        """
        Gaussian mutation.
        """
        mutation_mask = np.random.rand(len(individual)) < self.mutation_prob
        individual[mutation_mask] += np.random.normal(0, sigma, mutation_mask.sum())
        individual = np.clip(individual, 0, 100)
        return individual
    
    def pso_refine(self, individuals: np.ndarray, n_iterations: int = 10) -> np.ndarray:
        """
        PSO refinement for continuous dose optimization.
        """
        n_particles = len(individuals)
        velocities = np.random.randn(n_particles, self.n_compounds) * 0.1
        
        # Evaluate initial positions
        fitnesses, _ = self.evaluate_population(individuals)
        personal_best = individuals.copy()
        personal_best_fitness = fitnesses.copy()
        
        global_best_idx = np.argmax(fitnesses)
        global_best = individuals[global_best_idx].copy()
        
        # PSO parameters
        w = 0.7  # Inertia
        c1 = 1.5  # Cognitive
        c2 = 1.5  # Social
        
        for _ in range(n_iterations):
            # Update velocities
            r1 = np.random.rand(n_particles, self.n_compounds)
            r2 = np.random.rand(n_particles, self.n_compounds)
            
            velocities = (w * velocities +
                         c1 * r1 * (personal_best - individuals) +
                         c2 * r2 * (global_best - individuals))
            
            # Update positions
            individuals += velocities
            individuals = np.clip(individuals, 0, 100)
            
            # Evaluate
            fitnesses, _ = self.evaluate_population(individuals)
            
            # Update personal bests
            improved = fitnesses > personal_best_fitness
            personal_best[improved] = individuals[improved]
            personal_best_fitness[improved] = fitnesses[improved]
            
            # Update global best
            best_idx = np.argmax(fitnesses)
            if fitnesses[best_idx] > personal_best_fitness[global_best_idx]:
                global_best = individuals[best_idx].copy()
                global_best_idx = best_idx
        
        
        Returns:
            List of FormulationResult objects (Pareto front)
        """
        print("\n" + "="*60)
        print("  SYNPHYTICA OPTIMIZATION ENGINE")
        print("  AI for Synergistic Phytopharmacology")
        print("="*60 + "\n")
        
        # Initialize
        self.population = self.initialize_population()
        
        # Evolution loop
        for gen in tqdm(range(self.n_gen), desc="Optimizing"):
            # Evaluate
            fitnesses, details_list = self.evaluate_population(self.population)
            
            # Update Pareto front
            self.update_pareto_front(self.population, fitnesses, details_list)
            
            # Selection
            selected = self.tournament_selection(self.population, fitnesses)
            
            # Crossover
            offspring = []
            for i in range(0, len(selected), 2):
                parent1 = selected[i]
                parent2 = selected[min(i+1, len(selected)-1)]
                
                if np.random.rand() < self.crossover_prob:
                    child1, child2 = self.blend_crossover(parent1, parent2)
                else:
                    child1, child2 = parent1.copy(), parent2.copy()
                
                offspring.extend([child1, child2])
            
            offspring = np.array(offspring[:self.pop_size])
            
            # Mutation
            for i in range(len(offspring)):
                offspring[i] = self.gaussian_mutation(offspring[i])
            
            # PSO refinement on top 20%
            top_20_idx = np.argsort(fitnesses)[-int(0.2 * self.pop_size):]
            top_individuals = self.population[top_20_idx]
            refined = self.pso_refine(top_individuals, self.pso_iterations)
            
            # Replace bottom 20% with refined
            bottom_20_idx = np.argsort(fitnesses)[:int(0.2 * self.pop_size)]
            offspring[bottom_20_idx] = refined
            
            # Update population
            self.population = offspring
            
            # Progress
            if (gen + 1) % 10 == 0:
                best_fitness = fitnesses.max()
                print(f"Generation {gen+1}/{self.n_gen} | Best Fitness: {best_fitness:.4f}")
        
        print("\n" + "="*60)
        print("  OPTIMIZATION COMPLETE")
        print("="*60 + "\n")
        
        return self.pareto_front


# ============================================================================
# SECTION 5: TRAINING AND UTILITIES
# ============================================================================

def train_surrogate_model(
    library: CompoundLibrary,
    n_samples: int = 1000,
    epochs: int = 20,
    batch_size: int = 32,
    device: str = 'cpu'
) -> SynPhyticaTransformer:
    """
    Train the neural surrogate model on synthetic data.
    
    Args:
        library: CompoundLibrary
        n_samples: Number of synthetic training samples
        epochs: Training epochs
        batch_size: Batch size
        device: 'cpu' or 'cuda'
        
    Returns:
        Trained SynPhyticaTransformer model
    """
    print("\nTraining neural surrogate model...")
    
    # Generate synthetic training data
    compound_matrix = library.get_compound_matrix()
    n_compounds = library.size()
    compound_dim = compound_matrix.shape[1]
    
    # Create synthetic users
    synthetic_users = []
    for _ in range(200):
        user = UserProfile(
            therapeutic_goals={ind: np.random.rand() 
                             for ind in np.random.choice(library.all_indications, 
                                                        size=np.random.randint(1, 5), 
                                                        replace=False)},
            risk_sensitivities={eff: np.random.rand() 
                               for eff in np.random.choice(library.all_effects, 
                                                          size=np.random.randint(1, 4), 
                                                          replace=False)},
            preferences={'flavor': np.random.choice(['sweet', 'bitter', 'neutral']),
                        'form': np.random.choice(['oil', 'capsule', 'tincture'])},
            demographic={'age': np.random.randint(18, 80),
                        'weight': np.random.randint(50, 120)}
        )
        synthetic_users.append(user)
    
    user_dim = synthetic_users[0].to_vector(library.all_indications, library.all_effects).shape[0]
    
    # Initialize model
    model = SynPhyticaTransformer(
        compound_dim=compound_dim,
        user_dim=user_dim,
        d_model=128,
        n_heads=8,
        n_layers=4,
        d_ff=512,
        dropout=0.1,
        n_indications=len(library.all_indications),
        n_effects=len(library.all_effects)
    ).to(device)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    
    # Training loop
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        
        for _ in range(n_samples // batch_size):
            # Generate batch
            batch_compounds = []
            batch_users = []
            batch_efficacy = []
            batch_risk = []
            
            for _ in range(batch_size):
                # Random formulation
                doses = np.random.exponential(scale=2.0, size=n_compounds)
                doses = doses / (doses.sum() + 1e-8)
                
                weighted_compounds = compound_matrix * doses[:, np.newaxis]
                
                # Random user
                user = np.random.choice(synthetic_users)
                user_vec = user.to_vector(library.all_indications, library.all_effects)
                
                # Synthetic labels (based on weighted sum)
                efficacy_label = weighted_compounds[:, :len(library.all_indications)].sum(axis=0)
                efficacy_label = np.clip(efficacy_label, 0, 1)
                
                risk_label = weighted_compounds[:, len(library.all_indications):len(library.all_indications)+len(library.all_effects)].sum(axis=0)
                risk_label = np.clip(risk_label, 0, 1)
                
                batch_compounds.append(weighted_compounds)
                batch_users.append(user_vec)
                batch_efficacy.append(efficacy_label)
                batch_risk.append(risk_label)
            
            # Convert to tensors
            batch_compounds = torch.FloatTensor(np.array(batch_compounds)).to(device)
            batch_users = torch.FloatTensor(np.array(batch_users)).to(device)
            batch_efficacy = torch.FloatTensor(np.array(batch_efficacy)).to(device)
            batch_risk = torch.FloatTensor(np.array(batch_risk)).to(device)
            
            # Forward pass
            pred_efficacy, pred_risk = model(batch_compounds, batch_users)
            
            # Loss
            loss_efficacy = F.mse_loss(pred_efficacy, batch_efficacy)
            loss_risk = F.mse_loss(pred_risk, batch_risk)
            loss = loss_efficacy + loss_risk
            
            # Backward
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        avg_loss = total_loss / (n_samples // batch_size)
        if (epoch + 1) % 5 == 0:
            print(f"Epoch {epoch+1}/{epochs} | Loss: {avg_loss:.4f}")
    
    print("✓ Model trained successfully\n")
    return model


def print_results(pareto_front: List[FormulationResult], library: CompoundLibrary, top_n: int = 5):
    """
    Print top formulations from Pareto front.
    """
    print("\n" + "="*60)
    print(f"  TOP {top_n} FORMULATIONS (PARETO FRONT)")
    print("="*60 + "\n")
    
    for i, result in enumerate(pareto_front[:top_n], 1):
        print(f"Solution {i}:")
        print(result.summary(library, top_n=10))
        print("-" * 60 + "\n")


# ============================================================================
# SECTION 6: MAIN EXECUTION
# ============================================================================

def main():
    """
    Main execution pipeline.
    """
    print("\n" + "╔" + "="*60 + "╗")
    print("║" + " "*15 + "SYNPHYTICA FRAMEWORK" + " "*25 + "║")
    print("║" + " "*10 + "AI for Personalized Phytotherapy" + " "*18 + "║")
    print("╚" + "="*60 + "╝\n")
    
    # Device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}\n")
    
    # 1. Create compound library
    print("Initializing compound library...")
    library = CompoundLibrary.create_synthetic_cannabis_library()
    print(f"✓ Loaded {library.size()} compounds")
    print(f"  - {len(library.all_indications)} therapeutic indications")
    print(f"  - {len(library.all_effects)} adverse effects\n")
    
    # 2. Train surrogate model
    model = train_surrogate_model(library, n_samples=1000, epochs=20, device=device)
    
    # 3. Create user profile
    print("Creating user profile...")
    user = UserProfile(
        therapeutic_goals={
            'pain_relief': 0.9,
            'anxiety_reduction': 0.7,
            'sleep_improvement': 0.6
        },
        risk_sensitivities={
            'paranoia': 0.9,
            'anxiety_increase': 0.8,
            'memory_impairment': 0.6
        },
        preferences={
            'flavor': 'citrus',
            'form': 'oil'
        },
        demographic={
            'age': 45,
            'weight': 75
        }
    )
    print("✓ User profile created\n")
    
    # 4. Run optimization
    optimizer = SynPhyticaOptimizer(
        library=library,
        model=model,
        user_profile=user,
        population_size=100,
        n_generations=50,
        device=device
    )
    
    pareto_front = optimizer.optimize()
    
    # 5. Display results
    print_results(pareto_front, library, top_n=5)
    
    print("\n" + "="*60)
    print("  SynPhytica execution completed successfully!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()

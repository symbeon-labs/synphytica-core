# SynPhytica REST API

## Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run API
uvicorn api.main:app --reload --port 8000
```

### Test Endpoints

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Get compounds
curl http://localhost:8000/api/v1/compounds

# Optimize (example)
curl -X POST http://localhost:8000/api/v1/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "user_profile": {
      "therapeutic_goals": {"chronic_pain": 0.9, "anxiety": 0.7},
      "risk_sensitivities": {"psychoactivity": 0.8},
      "budget_constraint": 150.0
    },
    "population_size": 50,
    "n_generations": 30
  }'
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

See main project README for deployment instructions.

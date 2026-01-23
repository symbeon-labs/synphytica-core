import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent))

print("Testing imports...")
try:
    from api.models import OptimizationRequest
    from api.services.optimization_service import OptimizationService
    print("Imports successful")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Initializing OptimizationService...")
try:
    service = OptimizationService()
    print("OptimizationService initialized")
    print(f"Library size: {service.library.size()}")
except Exception as e:
    print(f"Initialization failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Test completed successfully!")

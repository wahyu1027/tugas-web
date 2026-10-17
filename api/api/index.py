import importlib.util
from pathlib import Path
import sys

project_root = str(Path(__file__).resolve().parents[1])
if project_root not in sys.path:
    sys.path.insert(0, project_root)

backend_spec = importlib.util.spec_from_file_location(
    "beasiswa_backend", Path(project_root) / "index.py"
)
if backend_spec is None or backend_spec.loader is None:
    raise ImportError("Could not load the FastAPI application")

backend = importlib.util.module_from_spec(backend_spec)
sys.modules[backend_spec.name] = backend
backend_spec.loader.exec_module(backend)
app = backend.app
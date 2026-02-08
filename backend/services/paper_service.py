"""Paper lookup and PDF URL resolution via OpenAlex + arXiv fallback."""
import json
import random
import urllib.request
from pathlib import Path

import arxiv
from backend.core.config import MAG_ID_TO_TITLE_PATH

# In-memory cache: OpenAlex ID -> title
_mag_id_to_title: dict[str, str] | None = None

OPENALEX_WORKS_URL = "https://api.openalex.org/works"


def _normalize_mag_id(mag_id: str) -> str:
    """Normalize MAG id to OpenAlex URL key format (for our JSON lookup)."""
    s = mag_id.strip()
    if s.isdigit():
        return f"https://openalex.org/W{s}"
    if not s.startswith("http"):
        return f"https://openalex.org/W{s}" if s.startswith("W") else f"https://openalex.org/{s}"
    return s


def _mag_id_to_numeric(mag_id: str) -> str:
    """Extract numeric MAG id for OpenAlex API filter (e.g. W1578902217 or full URL -> 1578902217)."""
    s = mag_id.strip()
    if s.isdigit():
        return s
    if s.startswith("https://openalex.org/W"):
        return s.replace("https://openalex.org/W", "")
    if s.startswith("W"):
        return s[1:]
    return s


def _load_mag_id_to_title() -> dict[str, str]:
    global _mag_id_to_title
    if _mag_id_to_title is None:
        if not MAG_ID_TO_TITLE_PATH.exists():
            raise FileNotFoundError(f"MAG title mapping not found: {MAG_ID_TO_TITLE_PATH}")
        with open(MAG_ID_TO_TITLE_PATH, encoding="utf-8") as f:
            _mag_id_to_title = json.load(f)
    return _mag_id_to_title


def get_title_by_mag_id(mag_id: str) -> str | None:
    """Return paper title for a given MAG/OpenAlex id from backend/mag_id_to_title.json, or None."""
    mapping = _load_mag_id_to_title()
    key = _normalize_mag_id(mag_id)
    return mapping.get(key)


def get_doi_for_mag_id(mag_id: str) -> str | None:
    """Query OpenAlex API by MAG id to get DOI URL for the work."""
    numeric_id = _mag_id_to_numeric(mag_id)
    if not numeric_id:
        return None
    url = f"{OPENALEX_WORKS_URL}?filter=ids.mag:{numeric_id}&select=doi&per_page=1"
    req = urllib.request.Request(url, headers={"User-Agent": "AriadneBackend/1.0 (mailto:optional@example.com)"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
    except Exception:
        return None
    results = data.get("results", [])
    if not results:
        return None
    return results[0].get("doi")


def get_paper_info_by_mag_id(mag_id: str) -> dict:
    """Return title (from backend/mag_id_to_title.json) and DOI URL from OpenAlex."""
    normalized = _normalize_mag_id(mag_id)
    title = get_title_by_mag_id(mag_id)
    doi_url = get_doi_for_mag_id(mag_id)
    return {"mag_id": normalized, "title": title, "doi_url": doi_url}


def get_random_papers(n: int = 50) -> list[dict]:
    """Return n random papers (mag_id, title) from the mapping. For 'For You' placeholder."""
    mapping = _load_mag_id_to_title()
    keys = list(mapping.keys())
    if n >= len(keys):
        chosen = keys
    else:
        chosen = random.sample(keys, n)
    return [{"mag_id": k, "title": mapping[k]} for k in chosen]
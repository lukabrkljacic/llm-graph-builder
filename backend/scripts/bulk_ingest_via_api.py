"""Utilities for uploading preprocessed Markdown files via the FastAPI backend.

This module can be driven either from a command line interface or directly
within Python (for example, inside a Jupyter notebook). In both cases it
mirrors the manual UI flow (upload -> extract -> post processing) so large
batches of documents can be prepared ahead of time. The backend service must be
running and reachable via the configured base URL.
"""
from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
from typing import Iterable, List, Mapping, MutableMapping, Optional, Sequence

import requests
from dotenv import load_dotenv

LOGGER = logging.getLogger(__name__)

DEFAULT_TOKEN_CHUNK_SIZE = 100
DEFAULT_CHUNK_OVERLAP = 20
DEFAULT_CHUNKS_TO_COMBINE = 1

CHUNK_SIZE_ENV = "VITE_TOKENS_PER_CHUNK"
CHUNK_OVERLAP_ENV = "VITE_CHUNK_OVERLAP"
CHUNKS_TO_COMBINE_ENV = "VITE_CHUNK_TO_COMBINE"

DEFAULT_PROCESSED_ROOT = (
    Path(__file__).resolve().parents[2]
    / "preprocessing"
    / "input_data"
    / "processed"
)
UPLOAD_ENDPOINT = "/upload"
EXTRACT_ENDPOINT = "/extract"
POST_PROCESSING_ENDPOINT = "/post_processing"
DEFAULT_POST_PROCESSING_TASKS: Sequence[str] = (
    "enable_hybrid_search_and_fulltext_search_in_bloom",
    "materialize_text_chunk_similarities",
)


class IngestionError(RuntimeError):
    """Raised when one of the ingestion steps reports a failure."""


def _read_positive_int_from_env(env_var: str, fallback: int) -> int:
    """Return a positive integer value from the environment or the fallback."""

    raw_value = os.environ.get(env_var)
    if not raw_value:
        return fallback

    try:
        parsed = int(raw_value)
    except (TypeError, ValueError):
        LOGGER.warning(
            "Environment variable %s=%r is not an integer; using %d instead",
            env_var,
            raw_value,
            fallback,
        )
        return fallback

    if parsed <= 0:
        LOGGER.warning(
            "Environment variable %s=%r must be greater than zero; using %d instead",
            env_var,
            raw_value,
            fallback,
        )
        return fallback

    return parsed


def _resolve_chunk_defaults() -> tuple[int, int, int]:
    """Load the UI-equivalent default chunk settings from the environment."""

    default_chunk_size = _read_positive_int_from_env(
        CHUNK_SIZE_ENV, DEFAULT_TOKEN_CHUNK_SIZE
    )
    default_overlap = _read_positive_int_from_env(
        CHUNK_OVERLAP_ENV, DEFAULT_CHUNK_OVERLAP
    )
    default_chunks_to_combine = _read_positive_int_from_env(
        CHUNKS_TO_COMBINE_ENV, DEFAULT_CHUNKS_TO_COMBINE
    )
    if default_overlap >= default_chunk_size:
        adjusted_overlap = max(default_chunk_size - 1, 0)
        LOGGER.warning(
            "Chunk overlap %d must be smaller than the chunk size %d; using %d",
            default_overlap,
            default_chunk_size,
            adjusted_overlap,
        )
        default_overlap = adjusted_overlap
    return default_chunk_size, default_overlap, default_chunks_to_combine


def _coerce_chunk_parameters(
    token_chunk_size: Optional[int],
    chunk_overlap: Optional[int],
    chunks_to_combine: Optional[int],
) -> tuple[int, int, int]:
    """Return validated chunk settings with environment-aware defaults."""

    default_chunk_size, default_overlap, default_combine = _resolve_chunk_defaults()

    def _coerce(value: Optional[int], fallback: int, *, allow_zero: bool = False) -> int:
        if value in (None, ""):
            return fallback
        try:
            parsed = int(value)  # type: ignore[arg-type]
        except (TypeError, ValueError):
            LOGGER.warning(
                "Chunk parameter %r is not an integer; using %d instead", value, fallback
            )
            return fallback
        if parsed < 0 or (parsed == 0 and not allow_zero):
            LOGGER.warning(
                "Chunk parameter %r must be %spositive; using %d instead",
                value,
                "" if allow_zero else "strictly ",
                fallback,
            )
            return fallback
        return parsed

    resolved_chunk_size = _coerce(token_chunk_size, default_chunk_size)
    resolved_overlap = _coerce(chunk_overlap, default_overlap, allow_zero=True)
    resolved_combine = _coerce(chunks_to_combine, default_combine)

    if resolved_overlap >= resolved_chunk_size:
        LOGGER.warning(
            "Chunk overlap %d must be smaller than the chunk size %d; using %d",
            resolved_overlap,
            resolved_chunk_size,
            max(resolved_chunk_size - 1, 0),
        )
        resolved_overlap = max(resolved_chunk_size - 1, 0)

    if resolved_combine <= 0:
        LOGGER.warning(
            "chunks_to_combine must be at least 1; using %d instead", default_combine
        )
        resolved_combine = max(default_combine, 1)

    return resolved_chunk_size, resolved_overlap, resolved_combine


def _coerce_optional(value: Optional[object]) -> Optional[str]:
    """Convert optional values to strings while preserving ``None``."""

    if value is None:
        return None
    return str(value)


def _create_form_payload(base: Mapping[str, str], **extra: Optional[object]) -> Mapping[str, str]:
    """Build a ``dict`` of non-empty form fields."""

    payload: MutableMapping[str, str] = dict(base)
    for key, value in extra.items():
        coerced = _coerce_optional(value)
        if coerced is not None:
            payload[key] = coerced
    return payload


def _post_json(session: requests.Session, url: str, data: Mapping[str, str], files=None, timeout: int = 120) -> Mapping[str, object]:
    """Send a POST request and validate the API response structure."""

    response = session.post(url, data=data, files=files, timeout=timeout)
    response.raise_for_status()
    payload = response.json()
    status = payload.get("status")
    if status != "Success":
        raise IngestionError(f"Endpoint {url} returned non-success status: {payload}")
    return payload


def discover_markdown_files(project_root: Path) -> List[Path]:
    """Return all Markdown files for a project, sorted alphabetically."""

    if not project_root.exists():
        raise FileNotFoundError(
            f"The project directory '{project_root}' does not exist."
        )
    if not project_root.is_dir():
        raise NotADirectoryError(f"'{project_root}' is not a directory")

    files = sorted(project_root.glob("*.md"))
    if not files:
        raise FileNotFoundError(
            f"No Markdown files were found in '{project_root}'."
        )
    return files


def upload_markdown(
    session: requests.Session,
    base_url: str,
    file_path: Path,
    auth_payload: Mapping[str, str],
    model: str,
    chunk_number: int = 1,
    total_chunks: int = 1,
) -> Mapping[str, object]:
    """Upload a file to the backend so it is registered as a ``Document`` node."""

    LOGGER.info("Uploading %s", file_path.name)
    url = f"{base_url.rstrip('/')}{UPLOAD_ENDPOINT}"
    data = _create_form_payload(
        auth_payload,
        chunkNumber=chunk_number,
        totalChunks=total_chunks,
        originalname=file_path.name,
        model=model,
    )

    with file_path.open("rb") as fh:
        files = {"file": (file_path.name, fh, "text/markdown")}
        return _post_json(session, url, data=data, files=files)


def extract_markdown(
    session: requests.Session,
    base_url: str,
    file_name: str,
    auth_payload: Mapping[str, str],
    model: str,
    *,
    token_chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None,
    chunks_to_combine: Optional[int] = None,
    retry_condition: Optional[str] = None,
    additional_instructions: Optional[str] = None,
) -> Mapping[str, object]:
    """Trigger the extraction pipeline for a previously uploaded local file."""

    LOGGER.info("Extracting %s", file_name)
    url = f"{base_url.rstrip('/')}{EXTRACT_ENDPOINT}"
    data = _create_form_payload(
        auth_payload,
        model=model,
        source_type="local file",
        file_name=file_name,
        token_chunk_size=token_chunk_size,
        chunk_overlap=chunk_overlap,
        chunks_to_combine=chunks_to_combine,
        retry_condition=retry_condition,
        additional_instructions=additional_instructions,
    )
    return _post_json(session, url, data=data)


def run_post_processing(
    session: requests.Session,
    base_url: str,
    auth_payload: Mapping[str, str],
    tasks: Iterable[str],
) -> Mapping[str, object]:
    """Execute optional post-processing tasks once all files are extracted."""

    task_list = list(tasks)
    if not task_list:
        raise ValueError("At least one post-processing task must be specified")

    LOGGER.info("Running post processing tasks: %s", ", ".join(task_list))
    url = f"{base_url.rstrip('/')}{POST_PROCESSING_ENDPOINT}"
    data = _create_form_payload(
        auth_payload,
        tasks=json.dumps(task_list),
    )
    return _post_json(session, url, data=data)


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Bulk upload and process Markdown files through the FastAPI ingestion endpoints.",
    )
    parser.add_argument(
        "project_name",
        help="Name of the preprocessed project under preprocessing/input_data/processed",
    )
    parser.add_argument(
        "--processed-root",
        type=Path,
        default=DEFAULT_PROCESSED_ROOT,
        help="Root directory that contains preprocessed project folders (default: %(default)s)",
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("LLM_GRAPH_BUILDER_BASE_URL", "http://localhost:8000"),
        help="Base URL of the running FastAPI backend (default: %(default)s)",
    )
    parser.add_argument(
        "--model",
        default=os.environ.get("EMBEDDING_MODEL", "all-MiniLM-L6-v2"),
        help="Embedding model name to store alongside the document metadata (default: %(default)s)",
    )
    parser.add_argument("--uri", default=os.environ.get("NEO4J_URI"), help="Neo4j URI")
    parser.add_argument("--user", default=os.environ.get("NEO4J_USERNAME"), help="Neo4j username")
    parser.add_argument("--password", default=os.environ.get("NEO4J_PASSWORD"), help="Neo4j password")
    parser.add_argument(
        "--database",
        default=os.environ.get("NEO4J_DATABASE", "neo4j"),
        help="Neo4j database to target (default: %(default)s)",
    )
    parser.add_argument(
        "--token-chunk-size",
        type=int,
        default=None,
        help=(
            "Optional chunk size override passed to the /extract endpoint. "
            "Defaults to the UI configuration (VITE_TOKENS_PER_CHUNK, 100 if unset)."
        ),
    )
    parser.add_argument(
        "--chunk-overlap",
        type=int,
        default=None,
        help=(
            "Optional chunk overlap override passed to the /extract endpoint. "
            "Defaults to the UI configuration (VITE_CHUNK_OVERLAP, 20 if unset)."
        ),
    )
    parser.add_argument(
        "--chunks-to-combine",
        type=int,
        default=None,
        help=(
            "Optional number of chunks to combine during extraction. "
            "Defaults to the UI configuration (VITE_CHUNK_TO_COMBINE, 1 if unset)."
        ),
    )
    parser.add_argument(
        "--retry-condition",
        default=None,
        help="Optional retry condition flag used by the extractor.",
    )
    parser.add_argument(
        "--additional-instructions",
        default=None,
        help="Optional free-form instructions forwarded to the LLM during extraction.",
    )
    parser.add_argument(
        "--post-processing-tasks",
        nargs="*",
        default=list(DEFAULT_POST_PROCESSING_TASKS),
        help="List of post-processing tasks to execute after extraction.",
    )
    parser.add_argument(
        "--skip-post-processing",
        action="store_true",
        help="Skip calling the /post_processing endpoint.",
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=None,
        help="Optional path to a .env file containing backend credentials.",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        help="Python logging level (default: %(default)s)",
    )
    return parser


def configure_logging(level: str) -> None:
    logging.basicConfig(level=getattr(logging, level.upper(), logging.INFO), format="%(levelname)s - %(message)s")


def ingest_project_via_api(
    project_name: str,
    *,
    processed_root: Path = DEFAULT_PROCESSED_ROOT,
    base_url: Optional[str] = None,
    model: Optional[str] = None,
    uri: Optional[str] = None,
    user: Optional[str] = None,
    password: Optional[str] = None,
    database: Optional[str] = None,
    token_chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None,
    chunks_to_combine: Optional[int] = None,
    retry_condition: Optional[str] = None,
    additional_instructions: Optional[str] = None,
    post_processing_tasks: Optional[Iterable[str]] = DEFAULT_POST_PROCESSING_TASKS,
    skip_post_processing: bool = False,
    env_file: Optional[Path] = None,
    log_level: str = "INFO",
    session: Optional[requests.Session] = None,
) -> int:
    """Ingest an entire preprocessed project by calling the REST API.

    Parameters
    ----------
    project_name:
        Name of the project folder underneath ``processed_root``.
    processed_root:
        Location of the ``preprocessing/input_data/processed`` directory.
    base_url:
        Base URL of the FastAPI backend. Falls back to the ``LLM_GRAPH_BUILDER_BASE_URL``
        environment variable or ``http://localhost:8000``.
    model:
        Embedding model to store with the ``Document`` metadata. Defaults to the
        ``EMBEDDING_MODEL`` environment variable or ``all-MiniLM-L6-v2``.
    uri, user, password, database:
        Neo4j connection information. ``uri``, ``user`` and ``password`` are required.
        Each argument falls back to its respective ``NEO4J_*`` environment variable.
    token_chunk_size, chunk_overlap, chunks_to_combine, retry_condition,
    additional_instructions:
        Optional overrides that are forwarded to the ``/extract`` endpoint.
    post_processing_tasks:
        Iterable of tasks to run via the ``/post_processing`` endpoint. Set to ``None`` to
        skip. Ignored when ``skip_post_processing`` is ``True``.
    skip_post_processing:
        Disable the ``/post_processing`` call entirely.
    env_file:
        Optional path to a ``.env`` file. When provided the credentials are loaded from it.
    log_level:
        Logging level to configure for this run.
    session:
        Optional ``requests.Session`` to reuse. When omitted a session is created and
        closed automatically.

    Returns
    -------
    int
        Number of Markdown files that were ingested.
    """

    if env_file:
        load_dotenv(env_file)
    else:
        load_dotenv()

    configure_logging(log_level)

    base_url = base_url or os.environ.get("LLM_GRAPH_BUILDER_BASE_URL", "http://localhost:8000")
    model = model or os.environ.get("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    uri = uri or os.environ.get("NEO4J_URI")
    user = user or os.environ.get("NEO4J_USERNAME")
    password = password or os.environ.get("NEO4J_PASSWORD")
    database = database or os.environ.get("NEO4J_DATABASE", "neo4j")

    required_fields = {"Neo4j URI": uri, "Neo4j username": user, "Neo4j password": password}
    missing = [name for name, value in required_fields.items() if not value]
    if missing:
        raise ValueError(f"Missing required connection information: {', '.join(missing)}")

    (
        token_chunk_size,
        chunk_overlap,
        chunks_to_combine,
    ) = _coerce_chunk_parameters(token_chunk_size, chunk_overlap, chunks_to_combine)

    project_dir = processed_root / project_name / "markdown"
    markdown_files = discover_markdown_files(project_dir)
    auth_payload = {
        "uri": uri,
        "userName": user,
        "password": password,
        "database": database,
    }

    created_session = False
    if session is None:
        session = requests.Session()
        created_session = True

    try:
        for file_path in markdown_files:
            upload_markdown(session, base_url, file_path, auth_payload, model)
            extract_markdown(
                session,
                base_url,
                file_path.name,
                auth_payload,
                model,
                token_chunk_size=token_chunk_size,
                chunk_overlap=chunk_overlap,
                chunks_to_combine=chunks_to_combine,
                retry_condition=retry_condition,
                additional_instructions=additional_instructions,
            )

        if not skip_post_processing and post_processing_tasks:
            run_post_processing(session, base_url, auth_payload, post_processing_tasks)
    finally:
        if created_session:
            session.close()

    LOGGER.info("Completed ingestion for %s (%d files)", project_name, len(markdown_files))
    return len(markdown_files)


def main(argv: Optional[List[str]] = None) -> None:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    try:
        ingest_project_via_api(
            args.project_name,
            processed_root=args.processed_root,
            base_url=args.base_url,
            model=args.model,
            uri=args.uri,
            user=args.user,
            password=args.password,
            database=args.database,
            token_chunk_size=args.token_chunk_size,
            chunk_overlap=args.chunk_overlap,
            chunks_to_combine=args.chunks_to_combine,
            retry_condition=args.retry_condition,
            additional_instructions=args.additional_instructions,
            post_processing_tasks=args.post_processing_tasks,
            skip_post_processing=args.skip_post_processing,
            env_file=args.env_file,
            log_level=args.log_level,
        )
    except ValueError as exc:
        parser.error(str(exc))


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    main()
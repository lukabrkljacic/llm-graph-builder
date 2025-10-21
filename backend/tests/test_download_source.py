import os
import sys
import types
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_dir))

dummy_lh_module = types.ModuleType("langchain_huggingface")


class _DummyEmbedding:
    def __init__(self, *args, **kwargs):
        self.client = None

    def embed_documents(self, texts):
        return []

    def embed_query(self, text):
        return []


dummy_lh_module.HuggingFaceEmbeddings = _DummyEmbedding
dummy_lh_module.__all__ = ["HuggingFaceEmbeddings"]
sys.modules["langchain_huggingface"] = dummy_lh_module

from score import app, MERGED_DIR
from src.shared.common_fn import delete_uploaded_local_file


@pytest.fixture()
def client():
    return TestClient(app)


def _create_file_in_merged_dir(filename: str, content: bytes) -> Path:
    os.makedirs(MERGED_DIR, exist_ok=True)
    file_path = Path(MERGED_DIR) / filename
    file_path.write_bytes(content)
    return file_path


def test_download_source_serves_local_file(client):
    test_filename = "sample.txt"
    file_content = b"hello world"
    file_path = _create_file_in_merged_dir(test_filename, file_content)

    try:
        response = client.get("/download_source", params={"filename": test_filename})
        assert response.status_code == 200
        assert response.content == file_content
        content_disposition = response.headers.get("content-disposition", "")
        assert test_filename in content_disposition
    finally:
        file_path.unlink(missing_ok=True)


@pytest.mark.parametrize("filename", ["../score.py", "..\\score.py", "../../etc/passwd"])
def test_download_source_rejects_invalid_paths(client, filename):
    response = client.get("/download_source", params={"filename": filename})
    assert response.status_code == 400


def test_delete_uploaded_local_file_retains_when_configured(monkeypatch, tmp_path):
    monkeypatch.setenv("RETAIN_LOCAL_SOURCE_FILES", "true")
    file_path = tmp_path / "retained.txt"
    file_path.write_text("content")

    delete_uploaded_local_file(str(file_path), "retained.txt")

    assert file_path.exists()


def test_delete_uploaded_local_file_respects_force(monkeypatch, tmp_path):
    monkeypatch.setenv("RETAIN_LOCAL_SOURCE_FILES", "true")
    file_path = tmp_path / "forced.txt"
    file_path.write_text("content")

    delete_uploaded_local_file(str(file_path), "forced.txt", force=True)

    assert not file_path.exists()

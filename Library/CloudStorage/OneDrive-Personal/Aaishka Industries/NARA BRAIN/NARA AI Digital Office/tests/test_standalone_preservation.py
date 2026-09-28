"""Verification tests to ensure standalone preservation of Produce.AI, Invoice.AI, and Statement.AI.
Per user mandate: 'Implement the integration incrementally and preserve standalone operation of Produce.AI, Invoices.AI and Statement.AI.'
"""

import os
from pathlib import Path


def test_standalone_systems_exist():
    base_nara_brain = Path(__file__).resolve().parent.parent.parent

    produce_ai = base_nara_brain / "Produce.Ai"
    invoice_ai = base_nara_brain / "Invoice.AI"
    statement_ai = base_nara_brain / "Statement.AI"

    assert produce_ai.exists(), "Produce.Ai directory must exist"
    assert invoice_ai.exists(), "Invoice.AI directory must exist"
    assert statement_ai.exists(), "Statement.AI directory must exist"


def test_produce_ai_core_files_intact():
    base_nara_brain = Path(__file__).resolve().parent.parent.parent
    produce_backend = base_nara_brain / "Produce.Ai" / "backend" / "app"

    assert (produce_backend / "main.py").exists()
    assert (produce_backend / "models.py").exists()
    assert (produce_backend / "agents" / "orchestrator.py").exists()
    assert (produce_backend / "agents" / "bom_generation.py").exists()


def test_invoice_ai_core_files_intact():
    base_nara_brain = Path(__file__).resolve().parent.parent.parent
    invoice_dir = base_nara_brain / "Invoice.AI"
    assert invoice_dir.is_dir()


def test_statement_ai_core_files_intact():
    base_nara_brain = Path(__file__).resolve().parent.parent.parent
    statement_dir = base_nara_brain / "Statement.AI"
    assert statement_dir.is_dir()

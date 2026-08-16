from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Any
import logging
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "medicines.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("medassist")

app = Flask(__name__)

@app.before_request
def _log_request() -> None:
    try:
        logger.info("%s %s from %s", request.method, request.path, request.remote_addr)
    except Exception:
        # never fail a request because logging failed
        pass


@app.errorhandler(Exception)
def _handle_exception(err: Exception) -> Any:
    logger.exception("Unhandled exception during request")
    return jsonify({"error": "internal server error"}), 500


def load_medicines() -> list[dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def find_by_name_or_category(query: str, medicines: list[dict[str, Any]]) -> list[dict[str, Any]]:
    q = query.lower().strip()
    if not q:
        return []
    return [
        m
        for m in medicines
        if q in m.get("name", "").lower() or q in m.get("category", "").lower()
    ]


def format_medicine_line(m: dict[str, Any]) -> str:
    return (
        f"{m.get('name', 'Unknown')} | Stock: {m.get('stock', 0)} strips | "
        f"Price: ₹{m.get('price', '-') } per strip"
    )


def rule_based_reply(message: str, medicines: list[dict[str, Any]]) -> str:
    text = message.lower()

    if "stock" in text and ("low" in text or "summary" in text):
        low_stock = sum(1 for m in medicines if int(m.get("stock", 0)) < 100)
        out_stock = sum(1 for m in medicines if int(m.get("stock", 0)) == 0)
        return f"Stock summary: Low stock items: {low_stock}. Out of stock items: {out_stock}."

    if "antibiotic" in text:
        antibiotics = [m for m in medicines if "antibiotic" in m.get("category", "").lower()]
        if not antibiotics:
            return "No antibiotics found in current catalog."
        names = ", ".join(m["name"] for m in antibiotics[:6])
        return f"Available antibiotics include: {names}."

    exact_match = find_by_name_or_category(message, medicines)
    if exact_match:
        top = exact_match[:3]
        lines = "\n".join(format_medicine_line(m) for m in top)
        return f"Found {len(exact_match)} matching product(s):\n{lines}"

    if "offer" in text:
        return "Current offer: 8% discount on bulk orders above 500 strips."

    if "catalog" in text:
        return "Catalog is available. Try searching by medicine name or category like 'antibiotic'."

    return (
        "I can help with medicine availability, stock, pricing, and category search. "
        "Try: 'Paracetamol 500mg', 'show antibiotics', or 'stock summary'."
    )


@app.get("/")
def home() -> Any:
    return send_from_directory(BASE_DIR, "index.html")


@app.post("/api/chat")
def chat() -> Any:
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()

    if not message:
        return jsonify({"reply": "Please type a message."}), 400

    medicines = load_medicines()
    reply = rule_based_reply(message, medicines)

    return jsonify({"reply": reply})


@app.get("/api/health")
def health() -> Any:
    medicines = load_medicines()
    return jsonify({"status": "ok", "products": len(medicines)})


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host=host, port=port, debug=debug)

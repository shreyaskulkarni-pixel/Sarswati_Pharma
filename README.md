# MedAssist AI — Production-ready demo

Quick notes to run and build the project locally or with Docker.

Run locally (recommended for development):

```bash
python -m venv .venv
source .venv/bin/activate   # use .venv\Scripts\activate on Windows
pip install -r requirements-app.txt
gunicorn -c gunicorn.conf.py wsgi:app
```

Build and run with Docker:

```bash
docker build -t medassist:latest .
docker run -p 5000:5000 --rm medassist:latest
```

Notes & suggestions:
- Container runs as an unprivileged user.
- `HEALTHCHECK` probes `/api/health`.
- Use a process manager (systemd/container orchestrator) to run Gunicorn in production.
- Consider adding TLS (via a reverse proxy), authentication, and persistent storage for production.

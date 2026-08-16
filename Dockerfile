FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

WORKDIR /app

COPY requirements-app.txt ./
RUN pip install --no-cache-dir -r requirements-app.txt

# Create an unprivileged user and ensure files belong to that user
RUN useradd --create-home appuser && mkdir -p /app && chown appuser:appuser /app

# Copy application files and Gunicorn config
COPY --chown=appuser:appuser app.py index.html medicines.json ./
COPY --chown=appuser:appuser gunicorn.conf.py wsgi.py ./

USER appuser

EXPOSE 5000

# Healthcheck using Python (no extra packages required)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD python -c "import urllib.request,sys; urllib.request.urlopen('http://127.0.0.1:5000/api/health'); sys.exit(0)" || exit 1

CMD ["gunicorn", "-c", "gunicorn.conf.py", "wsgi:app"]

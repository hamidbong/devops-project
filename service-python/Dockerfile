FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Créer un utilisateur non-root
RUN useradd -m -u 1001 -s /bin/bash appuser && \
    chown -R appuser:appuser /app

# Basculer vers l'utilisateur non-root
USER appuser

EXPOSE 5003
CMD ["python", "app.py"]

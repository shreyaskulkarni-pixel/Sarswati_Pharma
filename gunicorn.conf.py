import multiprocessing

# Gunicorn configuration for production
workers = 2
threads = 4
worker_class = "gthread"
bind = "0.0.0.0:5000"
timeout = 30
reload = False
loglevel = "info"
accesslog = "-"
errorlog = "-"
